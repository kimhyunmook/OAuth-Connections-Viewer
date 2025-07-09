import { MsgType } from "./types/type";
import { SERVICES_BACKGROUND } from "./common/config/background-config";
import { BackgroundService } from "./modules/services/background-service";
import { MSGTYPE } from "./common/constants";
import { StorageService } from "./modules/services/storage-service";

const bgManager = new BackgroundService();
const storageService = new StorageService();
let matchTimeout: NodeJS.Timeout | null = null;

// 플랫폼별 매칭 아이콘 표시
function setMatchIcon(platform: string): void {
  chrome.action.setIcon({
    path: {
      "16": "assets/icons/icon-16.png",
      "32": "assets/icons/icon-32.png",
      "48": "assets/icons/icon-48.png",
      "128": "assets/icons/icon-128.png"
    }
  });
  let badgeColor = "#4CAF50";
  let badgeText = "✓";
  switch (platform.toLowerCase()) {
    case 'google': badgeColor = "#4285f4"; badgeText = "G"; break;
    case 'naver': badgeColor = "#03c75a"; badgeText = "N"; break;
    case 'kakao': badgeColor = "#fee500"; badgeText = "K"; break;
  }
  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ color: badgeColor });
}

// 기본 아이콘으로 복원
function resetIcon(): void {
  chrome.action.setIcon({
    path: {
      "16": "assets/icons/icon-16.png",
      "32": "assets/icons/icon-32.png",
      "48": "assets/icons/icon-48.png",
      "128": "assets/icons/icon-128.png"
    }
  });
  chrome.action.setBadgeText({ text: "" });
}

// 실시간 매칭 효과 (지속적 표시)
function showMatchEffect(platform: string): void {
  if (matchTimeout) {
    clearTimeout(matchTimeout);
    matchTimeout = null;
  }
  setMatchIcon(platform);
}

// 팝업에서 호출되는 임시 효과 (3초 후 자동 리셋)
function showTemporaryMatchEffect(platform: string): void {
  if (matchTimeout) {
    clearTimeout(matchTimeout);
  }
  setMatchIcon(platform);
  // 팝업에서만 임시효과, 자동 리셋(주석처리 가능)
  // matchTimeout = setTimeout(() => { resetIcon(); }, 3000);
}

// 매칭 확인 및 아이콘 처리
async function checkMatchForPage(pageInfo: { url: string; title: string; hostname: string }): Promise<void> {
  try {
    // 항상 query string이 없는 hostname만 사용
    let hostname = pageInfo.hostname;
    if (pageInfo.url) {
      try { hostname = new URL(pageInfo.url).hostname; } catch (e) { }
    }
    const EXCLUDE_WORDS = ['google', 'naver', 'kakao', '네이버', '카카오', '구글'];
    const domainParts = hostname.split('.')
      .filter(part => part.length > 2 && !['www', 'com', 'co', 'kr', 'net', 'org'].includes(part))
      .filter(part => !EXCLUDE_WORDS.includes(part.toLowerCase()));
    const connectionEntities = await storageService.getAllConnectionEntities();
    let matchedEntity = connectionEntities.find((entity: any) =>
      domainParts.some((part: string) => {
        const normalizedPart = part.toLowerCase();
        const normalizedName = entity.name.toLowerCase();
        return normalizedName.includes(normalizedPart) || normalizedPart.includes(normalizedName);
      })
    );
    if (!matchedEntity && pageInfo.title) {
      const titleWords = pageInfo.title.toLowerCase().split(' ').filter(word => word.length > 2 && !EXCLUDE_WORDS.includes(word));
      matchedEntity = connectionEntities.find((entity: any) =>
        titleWords.some((word: string) => {
          const normalizedWord = word.toLowerCase();
          const normalizedName = entity.name.toLowerCase();
          return normalizedName.includes(normalizedWord) || normalizedWord.includes(normalizedName);
        })
      );
    }
    if (matchedEntity) {
      showMatchEffect(matchedEntity.platform);
    } else {
      resetIcon();
    }
  } catch (error) {
    resetIcon();
  }
}

// URL 변경 감지 시 매칭 확인
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.url && tab.url.startsWith('http')) {
    let hostname = '';
    try { hostname = new URL(tab.url).hostname; } catch (e) { return; }
    checkMatchForPage({ url: tab.url, title: tab.title || '', hostname });
  } else if (changeInfo.url && (!tab.url || !tab.url.startsWith('http'))) {
    resetIcon();
  }
});

// 활성 탭 변경 감지(탭 전환)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && tab.url.startsWith('http')) {
      let hostname = '';
      try { hostname = new URL(tab.url).hostname; } catch (e) { return; }
      await checkMatchForPage({ url: tab.url, title: tab.title || '', hostname });
    } else {
      resetIcon();
    }
  } catch (error) {
    resetIcon();
  }
});

// 팝업에서 임시효과 요청 시
chrome.runtime.onMessage.addListener((msg: MsgType & { tabId?: number } | { type: string; payload?: any }, sender, sendResponse) => {
  if (msg.type === 'MATCH_FOUND') {
    const payload = (msg as any).payload;
    if (payload && payload.platform) {
      showTemporaryMatchEffect(payload.platform);
    }
    sendResponse({ received: true });
  } else if (msg.type === 'NO_MATCH_FOUND') {
    resetIcon();
    sendResponse({ received: true });
  } else if (msg.type === 'CHECK_MATCH_REQUEST') {
    const payload = (msg as any).payload;
    if (payload) {
      checkMatchForPage(payload);
    }
    sendResponse({ received: true });
  } else {
    for (const key in SERVICES_BACKGROUND) {
      const service = SERVICES_BACKGROUND[key];
      if (msg.type === service.saveType) {
        bgManager.handleSave(service, msg as MsgType, sender);
      }
      if (msg.type === service.getType) {
        bgManager.handleGet(service, sendResponse);
        return true; // 이 부분은 비동기 응답이므로 필요
      }
    }
    if (msg.type === MSGTYPE.LOGIN_REQUIRED) {
      sendResponse({ received: true });
    }
  }
});
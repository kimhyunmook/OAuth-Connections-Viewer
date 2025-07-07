import { ConnectionType } from "../types/type";
import { SERVICE_CONFIG } from "../config/script-config";
import { showLoading, hideLoading } from "./loading";
import { PLATFORM_INFO } from "../constants";

const listUL = document.getElementById("OAlists") as HTMLUListElement;

/**
 * 연결 리스트 렌더링
 */
function renderList(
  conns: ConnectionType[],
  emptyMsg: string,
  platform?: string
) {
  listUL.innerHTML = "";
  hideLoading();

  // OAlists를 원래 크기로 복원
  listUL.style.minHeight = "";
  listUL.style.height = "";
  listUL.style.overflow = "";
  listUL.style.overflowY = "scroll";

  if (conns.length === 0) {
    listUL.innerHTML = `<li class='list'>${emptyMsg}</li>`;
    return;
  }

  // 플랫폼 헤더 추가
  if (platform) {
    const headerLi = document.createElement("li");
    headerLi.className = "list platform-header";
    headerLi.innerHTML = `<p>${platform} (${conns.length}개)</p>`;
    listUL.appendChild(headerLi);
  }

  // 연결 목록 렌더링 (검색 리스트와 동일한 스타일)
  conns.forEach((c) => {
    const li = document.createElement("li");
    li.className = "list";
    li.innerHTML = `
      <img src="${c.image}" alt="${c.name}">
      <span class="service-name">${c.name}</span>
    `;
    listUL.appendChild(li);
  });
}

let lastPlatformKey: keyof typeof SERVICE_CONFIG | null = null;
let lastListener: ((msg: any, sender: any) => void) | null = null;

/**
 * 서비스 클릭 핸들러
 */
export function handleServiceClick(service: keyof typeof SERVICE_CONFIG) {
  const cfg = SERVICE_CONFIG[service];

  return (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    lastPlatformKey = service;

    const platformName = PLATFORM_INFO[service]?.DISPLAY_NAME || service;

    listUL.innerHTML = "";
    showLoading("#OAlists", cfg.LOADING_MSG);

    chrome.storage.local.get(cfg.STORAGE_KEY, (store) => {
      const cached = store[cfg.STORAGE_KEY];

      if (cached && cached.length > 0) {
        renderList(cached, cfg.EMPTY_MSG, platformName);
        return;
      }

      let openedTabId: number | null = null;
      chrome.tabs.create({ url: cfg.URL, active: false }, (tab) => {
        openedTabId = tab.id!;
        // 리스너 중복 방지
        if (lastListener) {
          chrome.runtime.onMessage.removeListener(lastListener);
        }
        lastListener = function listener(msg, sender) {
          if (msg.type === cfg.READY_TYPE && msg.tabId === tab.id) {
            chrome.tabs.remove(tab.id!);
            chrome.runtime.sendMessage(
              { type: cfg.GET_TYPE },
              (res: { connections: ConnectionType[] }) => {
                renderList(res.connections, cfg.EMPTY_MSG, platformName);
              }
            );
            chrome.runtime.onMessage.removeListener(listener);
            lastListener = null;
          }
          // LOGIN_REQUIRED 메시지 오면 열린 탭 닫기
          if (
            msg.type === "LOGIN_REQUIRED" &&
            openedTabId &&
            (!sender.tab ||
              sender.tab.id === openedTabId ||
              msg.tabId === openedTabId)
          ) {
            chrome.tabs.remove(openedTabId);
            chrome.runtime.onMessage.removeListener(listener);
            lastListener = null;
          }
        };
        chrome.runtime.onMessage.addListener(lastListener);
      });
    });
  };
}

// 로그인 필요 메시지 리스너 (항상 클릭한 플랫폼 기준 안내문구)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "LOGIN_REQUIRED") {
    hideLoading();
    let emptyMsg = "로그인이 필요합니다! 로그인 후 다시 시도해주세요.";
    // 클릭한 플랫폼이 있으면 그 EMPTY_MSG를 우선 사용
    if (
      lastPlatformKey &&
      SERVICE_CONFIG[lastPlatformKey] &&
      SERVICE_CONFIG[lastPlatformKey].EMPTY_MSG
    ) {
      emptyMsg = SERVICE_CONFIG[lastPlatformKey].EMPTY_MSG;
    } else {
      // 메시지에 serviceKey가 있으면 그 EMPTY_MSG 사용
      const serviceKey = msg.service as keyof typeof SERVICE_CONFIG;
      if (
        serviceKey &&
        SERVICE_CONFIG[serviceKey] &&
        SERVICE_CONFIG[serviceKey].EMPTY_MSG
      ) {
        emptyMsg = SERVICE_CONFIG[serviceKey].EMPTY_MSG;
      } else {
        emptyMsg = SERVICE_CONFIG.GOOGLE.EMPTY_MSG;
      }
    }
    listUL.innerHTML = `<li class='list fail'>${emptyMsg}</li>`;
    listUL.style.minHeight = "";
    listUL.style.height = "";
    listUL.style.overflow = "";
    listUL.style.overflowY = "scroll";
    // alert(emptyMsg);
  }
});

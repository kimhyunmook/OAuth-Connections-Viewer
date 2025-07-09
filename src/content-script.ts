import { MSGTYPE } from "./common/constants";
import { isLoginPage, sendMessageData } from "./modules/services/connection-parser-service";
import { PLATFORM_SCRIPT_CONFIGS } from "./common/config/platform-config";
import { ConnectionEntity } from "./types/type";

// 매칭 확인 함수
async function checkMatch(): Promise<void> {
  try {
    // 현재 페이지 정보 수집
    const pageInfo = {
      url: window.location.href,
      title: document.title,
      hostname: window.location.hostname
    };

    // background script에 매칭 확인 요청
    chrome.runtime.sendMessage({
      type: 'CHECK_MATCH_REQUEST',
      payload: pageInfo
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Failed to send match check request:', chrome.runtime.lastError);
      }
      return true
    });
  } catch (error) {
    console.error('Error checking match:', error);
  }
}

function handlePlatformScript({ url, type, service, parser }: any) {
  try {
    if (window.location.href.includes(url)) {
      if (isLoginPage()) {
        chrome.runtime.sendMessage({
          type: MSGTYPE.LOGIN_REQUIRED,
          service,
        }, () => {
          if (chrome.runtime.lastError) {
            console.error('Failed to send login required message:', chrome.runtime.lastError);
          }
        });
        return true;
      }

      // 파싱 시도에 타임아웃 설정
      const timeout = setTimeout(() => {
        console.error(`Parsing timeout for ${service}`);
        chrome.runtime.sendMessage({
          type: MSGTYPE.LOGIN_REQUIRED,
          service,
        }, () => {
          if (chrome.runtime.lastError) {
            console.error('Failed to send timeout message:', chrome.runtime.lastError);
          }
          return true
        });
      }, 10000); // 10초 타임아웃

      try {
        sendMessageData(type, parser, 1000);
        clearTimeout(timeout);
      } catch (parseError) {
        clearTimeout(timeout);
        console.error(`Parsing failed for ${service}:`, parseError);
        chrome.runtime.sendMessage({
          type: MSGTYPE.LOGIN_REQUIRED,
          service,
        }, () => {
          if (chrome.runtime.lastError) {
            console.error('Failed to send parse error message:', chrome.runtime.lastError);
          }
          return true
        });
      }
      return true;
    }
  } catch (error) {
    console.error(`Error handling platform script for ${service}:`, error);
    chrome.runtime.sendMessage({
      type: MSGTYPE.LOGIN_REQUIRED,
      service,
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to send error message:', chrome.runtime.lastError);
      }
      return false;
    });
  }

  // return false;
}

// background script로부터 매칭 확인 요청을 받는 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_MATCH') {
    checkMatch();
    sendResponse({ received: true });
    return true;
  }
});

window.addEventListener("load", () => {
  try {
    for (const config of PLATFORM_SCRIPT_CONFIGS) {
      if (handlePlatformScript(config)) break;
    }

    // 페이지 로드 시 초기 매칭 확인
    setTimeout(() => {
      checkMatch();
    }, 1000); // 1초 후 매칭 확인
  } catch (error) {
    console.error('Error in content script load handler:', error);
  }
});

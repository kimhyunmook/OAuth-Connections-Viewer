import { MSGTYPE } from "./common/constants";
import { isLoginPage, sendMessageData } from "./modules/services/connection-parser-service";
import { PLATFORM_SCRIPT_CONFIGS } from "./common/config/platform-config";

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
    });
  }
  return false;
}

window.addEventListener("load", () => {
  try {
    for (const config of PLATFORM_SCRIPT_CONFIGS) {
      if (handlePlatformScript(config)) break;
    }
  } catch (error) {
    console.error('Error in content script load handler:', error);
  }
});

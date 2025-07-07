import { MsgType } from "./types/type";
import { SERVICES_BACKGROUND } from "./config/background-config";
import { handleSave, handleGet } from "./helpers/background";

chrome.runtime.onMessage.addListener(
  (msg: MsgType & { tabId?: number }, sender, sendResponse) => {
    for (const key in SERVICES_BACKGROUND) {
      const service = SERVICES_BACKGROUND[key];

      if (msg.type === service.saveType) {
        handleSave(service, msg, sender);
        // NAVER_SAVE 실패(빈 payload) 시 탭 닫기
        if (
          msg.type === "NAVER_SAVE" &&
          (!msg.payload || msg.payload.length === 0) &&
          sender.tab &&
          sender.tab.id
        ) {
          chrome.tabs &&
            chrome.tabs.remove &&
            chrome.tabs.remove(sender.tab.id);
        }
      }
      if (msg.type === service.getType) {
        handleGet(service, sendResponse);
        return true;
      }
    }
    // LOGIN_REQUIRED 메시지 처리: 열린 탭 닫기 (sender.tab.id 또는 msg.tabId)
    if (msg.type === "LOGIN_REQUIRED") {
      const tabId = (sender.tab && sender.tab.id) || msg.tabId;
      if (tabId) {
        chrome.tabs && chrome.tabs.remove && chrome.tabs.remove(tabId);
      }
    }
  }
);

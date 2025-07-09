import { MsgType } from "./types/type";
import { SERVICES_BACKGROUND } from "./common/config/background-config";
import { BackgroundService } from "./modules/services/background-service";
import { MSGTYPE } from "./common/constants";

const bgManager = new BackgroundService();

chrome.runtime.onMessage.addListener(
  (msg: MsgType & { tabId?: number }, sender, sendResponse) => {
    for (const key in SERVICES_BACKGROUND) {
      const service = SERVICES_BACKGROUND[key];
      if (msg.type === service.saveType) {
        bgManager.handleSave(service, msg, sender);
      }
      if (msg.type === service.getType) {
        bgManager.handleGet(service, sendResponse);
        return true;
      }
    }

    // LOGIN_REQUIRED 메시지 처리: 열린 탭 닫기 (sender.tab.id 또는 msg.tabId)
    if (msg.type === MSGTYPE.LOGIN_REQUIRED) {
      const tabId = (sender.tab && sender.tab.id) || msg.tabId;

      sendResponse({ received: true });
      return true;
    }
  }
);

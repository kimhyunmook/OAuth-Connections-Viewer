import { MsgType } from "./types/type";
import { SERVICES_BACKGROUND } from "./config/background-config";
import { handleSave, handleGet } from "./utils/background";

chrome.runtime.onMessage.addListener((msg: MsgType, sender, sendResponse) => {
  for (const key in SERVICES_BACKGROUND) {
    const service = SERVICES_BACKGROUND[key];

    if (msg.type === service.saveType) {
      handleSave(service, msg, sender);
    }
    if (msg.type === service.getType) {
      handleGet(service, sendResponse);
      return true;
    }
  }
});

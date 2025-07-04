import { ServiceBackgroundConfig, MsgType } from "../types/type";

export function handleSave(
  service: ServiceBackgroundConfig,
  msg: MsgType,
  sender: chrome.runtime.MessageSender
) {
  if (msg.payload && msg.payload.length > 0) {
    service.latest = msg.payload;
    chrome.storage.local.set({ [service.key]: service.latest });
  }
  if (sender.tab && sender.tab.id) {
    chrome.runtime.sendMessage({
      type: service.readyType,
      tabId: sender.tab.id,
    });
  }
}

export function handleGet(
  service: ServiceBackgroundConfig,
  sendResponse: (res: any) => void
) {
  chrome.storage.local.get(service.key).then((store) => {
    sendResponse({ connections: store[service.key] || [] });
  });
}

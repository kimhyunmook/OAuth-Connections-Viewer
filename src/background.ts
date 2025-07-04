import { MsgType } from "./types/type";

let latestConnections: any[] = [];

chrome.runtime.onMessage.addListener((msg: MsgType, sender, sendResponse) => {
  if (msg.type === "GOOGLE_SAVE") {
    latestConnections = msg.payload;
    chrome.storage.local.set({ connections: latestConnections });
  }
});

chrome.runtime.onMessage.addListener((msg: MsgType, sender, sendResponse) => {
  if (msg.type === "GOOGLE_GET") {
    chrome.storage.local.get("connections").then((store) => {
      sendResponse({ connections: store.connections || [] });
    });
    return true;
  }
});

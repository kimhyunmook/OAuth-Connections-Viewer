// background.ts
let latestConnections: any[] = [];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SAVE_CONNECTIONS") {
    latestConnections = msg.payload;
    chrome.storage.local.set({ connections: latestConnections });
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_CONNECTIONS") {
    chrome.storage.local.get("connections").then((store) => {
      sendResponse({ connections: store.connections || [] });
    });
    // 비동기 sendResponse 를 사용
    return true;
  }
});

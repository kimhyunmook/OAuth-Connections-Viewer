import { MsgType } from "./types/type";

let latestConnections: any[] = [];
let latestNaverConnections: any[] = [];
let latestKakaoConnections: any[] = [];

chrome.runtime.onMessage.addListener((msg: MsgType, sender, sendResponse) => {
  if (msg.type === "GOOGLE_SAVE") {
    latestConnections = msg.payload;
    chrome.storage.local.set({ connections: latestConnections });
  }
  if (msg.type === "NAVER_SAVE") {
    latestNaverConnections = msg.payload;
    chrome.storage.local.set({ naverConnections: latestNaverConnections });
  }
  if (msg.type === "KAKAO_SAVE") {
    latestKakaoConnections = msg.payload;
    chrome.storage.local.set({ kakaoConnections: latestKakaoConnections });
  }
});

chrome.runtime.onMessage.addListener((msg: MsgType, sender, sendResponse) => {
  if (msg.type === "GOOGLE_GET") {
    chrome.storage.local.get("connections").then((store) => {
      sendResponse({ connections: store.connections || [] });
    });
    return true;
  }
  if (msg.type === "NAVER_GET") {
    chrome.storage.local.get("naverConnections").then((store) => {
      sendResponse({ connections: store.naverConnections || [] });
    });
    return true;
  }
  if (msg.type === "KAKAO_GET") {
    chrome.storage.local.get("kakaoConnections").then((store) => {
      sendResponse({ connections: store.kakaoConnections || [] });
    });
    return true;
  }
});

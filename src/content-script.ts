import { isLoginPage, sendMessageData } from "./services/connection-parser";
import { parseGoogleConnections, parseNaverConnections, parseKakaoConnections } from "./services/platform-parsers";

// 페이지 로드 후 실행
window.addEventListener("load", () => {
  // 각 플랫폼별로 조건부 실행
  if (window.location.href.includes('myaccount.google.com')) {
    sendMessageData("GOOGLE_SAVE", parseGoogleConnections, 1000);
  }

  if (window.location.href.includes('nid.naver.com')) {
    sendMessageData("NAVER_SAVE", parseNaverConnections, 1000);
  }

  if (window.location.href.includes('apps.kakao.com')) {
    sendMessageData("KAKAO_SAVE", parseKakaoConnections, 1000);
  }
});

if (isLoginPage()) {
  chrome.runtime.sendMessage({ type: "LOGIN_REQUIRED" });
}

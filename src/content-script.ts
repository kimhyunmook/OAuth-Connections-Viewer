import { MSGTYPE } from "./constants";
import { isLoginPage, sendMessageData } from "./services/connection-parser";
import {
  parseGoogleConnections,
  parseNaverConnections,
  parseKakaoConnections,
} from "./services/platform-parsers";

const PLATFORM_CONFIGS = [
  {
    url: "myaccount.google.com",
    type: "GOOGLE_SAVE",
    service: "GOOGLE",
    parser: parseGoogleConnections,
  },
  {
    url: "nid.naver.com",
    type: "NAVER_SAVE",
    service: "NAVER",
    parser: parseNaverConnections,
  },
  {
    url: "apps.kakao.com",
    type: "KAKAO_SAVE",
    service: "KAKAO",
    parser: parseKakaoConnections,
  },
];

function handlePlatformScript({ url, type, service, parser }: any) {
  if (window.location.href.includes(url)) {
    if (isLoginPage()) {
      chrome.runtime.sendMessage({
        type: MSGTYPE.LOGIN_REQUIRED,
        service,
      });
      return true;
    }
    sendMessageData(type, parser, 1000);
    return true;
  }
  return false;
}

window.addEventListener("load", () => {
  for (const config of PLATFORM_CONFIGS) {
    if (handlePlatformScript(config)) break;
  }
});

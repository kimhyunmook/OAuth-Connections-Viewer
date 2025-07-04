import { googleBtn, naverBtn, kakaoBtn } from "./config/script-config";
import { handleServiceClick } from "./utils/popup";

// 1분마다 localstorage 데이터 전체 삭제
setInterval(() => {
  chrome.storage.local.clear();
}, 60 * 1000);

googleBtn.addEventListener("click", handleServiceClick("google"));
naverBtn.addEventListener("click", handleServiceClick("naver"));
kakaoBtn.addEventListener("click", handleServiceClick("kakao"));

import { googleBtn, naverBtn, kakaoBtn } from "./config/script-config";
import { handleServiceClick } from "./helpers/popup";
import initTheme from "./helpers/popup-theme";

void initTheme();

// 스토리지 데이터 삭제 버튼 이벤트
const clearBtn = document.getElementById("clear-storage-btn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    chrome.storage.local.clear(() => {
      alert("스토리지 데이터가 삭제되었습니다!");
      const listUL = document.getElementById("OAlists");
      if (listUL) listUL.innerHTML = "<li class='list'>데이터가 삭제되었습니다.</li>";
    });
  });
}

// 1분마다 localstorage 데이터 전체 삭제
// setInterval(() => {
//   chrome.storage.local.clear();
// }, 60 * 1000);

googleBtn.addEventListener("click", handleServiceClick("google"));
naverBtn.addEventListener("click", handleServiceClick("naver"));
kakaoBtn.addEventListener("click", handleServiceClick("kakao"));

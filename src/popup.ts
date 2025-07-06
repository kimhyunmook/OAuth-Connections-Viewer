import { googleBtn, naverBtn, kakaoBtn } from "./config/script-config";
import { handleServiceClick } from "./helpers/popup";
import initTheme from "./helpers/popup-theme";
import { getAllConnections, searchConnections, renderSearchResults } from "./helpers/search";

void initTheme();

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

// 검색 기능 초기화
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchBtn = document.getElementById("search-btn") as HTMLButtonElement;
const listUL = document.getElementById("OAlists") as HTMLUListElement;

let allConnections: any = null;
let isSearching = false; // 검색 중인지 상태 추적

// 검색 실행 함수
async function performSearch() {
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    // 검색어가 없으면 기본 상태로 돌아감
    isSearching = false;
    listUL.innerHTML = "<li class='list'>아직 데이터가 없습니다.</li>";
    return;
  }

  isSearching = true;

  // 모든 연결 데이터를 가져옴
  if (!allConnections) {
    allConnections = await getAllConnections();
  }

  // 검색 실행
  const searchResults = searchConnections(allConnections, searchTerm);

  // 결과 렌더링
  renderSearchResults(searchResults, listUL, searchTerm);
}

// 검색 버튼 클릭 이벤트
if (searchBtn) {
  searchBtn.addEventListener("click", performSearch);
}

// 검색 입력창 엔터 키 이벤트
if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // 실시간 검색 (입력 중에도 검색)
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm.length >= 2) { // 2글자 이상일 때만 검색
      performSearch();
    } else if (searchTerm.length === 0) {
      // 검색어가 없으면 기본 상태로 돌아감
      isSearching = false;
      listUL.innerHTML = "<li class='list'>아직 데이터가 없습니다.</li>";
    }
  });
}

// 플랫폼 버튼 클릭 시 검색 상태 초기화
function clearSearch() {
  if (searchInput) {
    searchInput.value = '';
  }
  isSearching = false;
  listUL.innerHTML = "<li class='list'>아직 데이터가 없습니다.</li>";
}

// setInterval(() => {
//   chrome.storage.local.clear();
// }, 60 * 1000);

// 플랫폼 버튼 클릭 시 검색 상태를 고려한 핸들러
googleBtn.addEventListener("click", (e) => {
  if (isSearching) {
    clearSearch();
  }
  handleServiceClick("google")(e);
});

naverBtn.addEventListener("click", (e) => {
  if (isSearching) {
    clearSearch();
  }
  handleServiceClick("naver")(e);
});

kakaoBtn.addEventListener("click", (e) => {
  if (isSearching) {
    clearSearch();
  }
  handleServiceClick("kakao")(e);
});

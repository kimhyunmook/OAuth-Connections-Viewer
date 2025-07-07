import { getPlatformButtons } from "./utils/dom-utils";
import { applyTheme, setupSystemThemeListener } from "./utils/theme-utils";
import { getAllConnections, clearStorage } from "./services/storage-service";
import { isValidSearchTerm, searchConnections, filterConnectionsByPlatform } from "./services/search-service";
import { renderSearchResults, renderPlatformConnections } from "./utils/ui-utils";
import { handleServiceClick } from "./helpers/popup";
import {
  PlatformType,
  SearchViewType,
  AllConnections
} from "./types/type";
import {
  SEARCH_CONFIG,
  PLATFORM_INFO,
  UI_MESSAGES,
} from "./constants";

// ===== 초기화 =====
applyTheme('system');
setupSystemThemeListener();

// ===== DOM 요소 =====
const clearBtn = document.getElementById("clear-storage-btn");
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchBtn = document.getElementById("search-btn") as HTMLButtonElement;
const listUL = document.getElementById("OAlists") as HTMLUListElement;
const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement;

// ===== 상태 관리 =====
let allConnections: AllConnections | null = null;
let isSearching = false;
let currentView: SearchViewType = 'search';
let searchTimeout: NodeJS.Timeout | null = null;

// ===== 유틸리티 함수 =====

/**
 * 검색 상태 초기화
 */
function resetSearchState(): void {
  if (searchInput) {
    searchInput.value = '';
    searchInput.disabled = false;
    searchInput.placeholder = UI_MESSAGES.ENTER_TO_SEARCH;
  }

  isSearching = false;
  currentView = 'search';
  listUL.innerHTML = `<li class='list'>${UI_MESSAGES.NODATA}</li>`;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = null;
  }
}

/**
 * 검색 입력창을 플랫폼 모드로 업데이트
 */
function updateSearchInputForPlatform(platform: PlatformType): void {
  if (!searchInput) return;

  const platformInfo = PLATFORM_INFO[platform.toUpperCase() as keyof typeof PLATFORM_INFO];
  if (platformInfo) {
    searchInput.value = `${platformInfo.DISPLAY_NAME} 연결 목록`;
    searchInput.disabled = true;
  }
}

/**
 * 디바운스된 검색 실행
 */
function performDebouncedSearch(): void {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(performSearch, SEARCH_CONFIG.DEBOUNCE_DELAY);
}

// ===== 핵심 기능 함수 =====

/**
 * 검색 실행
 */
async function performSearch(): Promise<void> {
  const searchTerm = searchInput?.value || '';

  if (!isValidSearchTerm(searchTerm)) {
    resetSearchState();
    return;
  }

  isSearching = true;
  currentView = 'search';

  try {
    // 매번 최신 스토리지 데이터 가져오기
    allConnections = await getAllConnections();

    const searchResults = searchConnections(allConnections, searchTerm);
    renderSearchResults(searchResults, listUL, searchTerm);

    // 검색 완료 시 OAlists를 원래 크기로 복원
    listUL.style.minHeight = "";
    listUL.style.height = "";
    listUL.style.overflow = "";
    listUL.style.overflowY = "scroll";
  } catch (error) {
    console.error('Search failed:', error);
    listUL.innerHTML = `<li class="list no-results">${UI_MESSAGES.SEARCH_ERROR}</li>`;
  }
}

/**
 * 플랫폼 버튼 클릭 시 검색 상태 초기화
 */
function clearSearchAndReset(): void {
  if (isSearching || currentView === 'platform') {
    resetSearchState();
  }
}

// ===== 이벤트 핸들러 =====

/**
 * 스토리지 데이터 삭제
 */
if (clearBtn) {
  clearBtn.addEventListener("click", async () => {
    await clearStorage();
    alert(UI_MESSAGES.CLEAR_SUCCESS);
    resetSearchState();
  });
}

/**
 * 검색 버튼 클릭
 */
if (searchBtn) {
  searchBtn.addEventListener("click", performSearch);
}

/**
 * 테마 토글 버튼 클릭
 */
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const { cycleTheme } = require("./utils/theme-utils");
    cycleTheme();
  });
}

/**
 * 검색 입력창 이벤트
 */
if (searchInput) {
  // 엔터 키
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // 실시간 검색
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm.length === 0) {
      resetSearchState();
    } else if (isValidSearchTerm(searchTerm)) {
      performDebouncedSearch();
    }
  });

  // 포커스 시 스토리지에서 데이터 가져오기
  searchInput.addEventListener("focus", async () => {
    if (searchInput.placeholder !== UI_MESSAGES.ENTER_TO_SEARCH) {
      searchInput.placeholder = UI_MESSAGES.ENTER_TO_SEARCH;
    }

    try {
      // 스토리지에서 최신 데이터 가져오기
      allConnections = await getAllConnections();

      // 검색 상태 초기화
      isSearching = false;
      currentView = 'search';
      listUL.innerHTML = `<li class='list'>${UI_MESSAGES.NODATA}</li>`;

      // OAlists를 원래 크기로 복원
      listUL.style.minHeight = "";
      listUL.style.height = "";
      listUL.style.overflow = "";
      listUL.style.overflowY = "scroll";

      console.log('Storage data refreshed on focus');
    } catch (error) {
      console.error('Failed to refresh storage data:', error);
      listUL.innerHTML = `<li class='list'>${UI_MESSAGES.NODATA}</li>`;
    }
  });
}

/**
 * 플랫폼 버튼 클릭 핸들러
 */
const platformButtons = getPlatformButtons();

Object.entries(platformButtons).forEach(([platform, btn]) => {
  if (btn) {
    btn.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      clearSearchAndReset();
      const platformType = platform.toUpperCase() as 'GOOGLE' | 'NAVER' | 'KAKAO';
      handleServiceClick(platformType)(e);
    });
  }
});

// ===== 초기화 =====
resetSearchState();

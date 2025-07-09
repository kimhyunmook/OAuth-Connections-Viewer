import { getPlatformButtons } from "./common/utils/dom-utils";
import { applyTheme, setupSystemThemeListener } from "./common/utils/theme-utils";
import { StorageController } from "./modules/controllers/storage-controller";
import { PopupService } from "./modules/services/popup-service";
import { SearchService } from "./modules/services/search-service";
import { UI_MESSAGES } from "./common/constants";
import { ConnectionType } from "./types/type";

class PopupManager {
  private popupService!: PopupService;
  private searchService!: SearchService;

  // DOM 요소
  private clearBtn: HTMLElement | null = null;
  private allBtn: HTMLButtonElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private searchBtn: HTMLButtonElement | null = null;
  private listUL: HTMLUListElement | null = null;
  private currentPageUrl: HTMLParagraphElement | null = null;
  private currentPageTitle: HTMLParagraphElement | null = null;
  private storageController: StorageController = new StorageController();

  constructor() {
    try {
      // DOM 요소 초기화 및 검증
      this.initializeDOMElements();

      this.popupService = new PopupService();

      // SearchService 초기화
      this.searchService = new SearchService(this.searchInput, this.searchBtn, this.listUL);

      this.storageController = new StorageController();
      this.initialize();
    } catch (error) {
      console.error('Failed to initialize PopupManager:', error);
      this.showErrorMessage('초기화 중 오류가 발생했습니다.');
    }
  }

  /**
   * DOM 요소 초기화 및 검증
   */
  private initializeDOMElements(): void {
    this.clearBtn = document.getElementById("clear-storage-btn");
    this.allBtn = document.getElementById("all-btn") as HTMLButtonElement;
    this.searchInput = document.getElementById("search-input") as HTMLInputElement;
    this.searchBtn = document.getElementById("search-btn") as HTMLButtonElement;
    this.listUL = document.getElementById("OAlists") as HTMLUListElement;
    this.currentPageUrl = document.getElementById("current-page-url") as HTMLParagraphElement;
    this.currentPageTitle = document.getElementById("current-page-title") as HTMLParagraphElement;
    // 필수 DOM 요소 검증
    if (!this.allBtn) {
      throw new Error('Required DOM element "all-btn" not found');
    }
    if (!this.listUL) {
      throw new Error('Required DOM element "OAlists" not found');
    }
    if (!this.searchInput) {
      throw new Error('Required DOM element "search-input" not found');
    }
    if (!this.searchBtn) {
      throw new Error('Required DOM element "search-btn" not found');
    }
  }

  /**
   * 에러 메시지 표시
   */
  private showErrorMessage(message: string): void {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    // 5초 후 자동 제거
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  /**
   * 초기화
   */
  private initialize(): void {
    try {
      // 테마 설정 (시스템 테마만 사용)
      applyTheme("system");
      setupSystemThemeListener();

      // 현재 페이지 URL과 제목 표시
      this.updateCurrentPageInfo();

      // 이벤트 핸들러 설정
      this.setupEventHandlers();

      // 초기 상태 설정
      this.searchService.resetSearchState();
      this.initializeAllButton();
      this.initializePlatformButtons();
    } catch (error) {
      console.error('Failed to initialize:', error);
      this.showErrorMessage('초기화 중 오류가 발생했습니다.');
    }
  }

  /**
     * 현재 페이지 URL과 title 표시
     */
  private async updateCurrentPageInfo(): Promise<void> {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab) {
        throw new Error('No active tab found');
      }

      if (tab?.url && this.currentPageUrl) {
        try {
          const url = new URL(tab.url);
          const domain = url.hostname;
          this.currentPageUrl.textContent = domain;
        } catch (urlError) {
          this.currentPageUrl.textContent = 'Invalid URL';
        }
      }

      const allConnections = await this.storageController.getAllConnections();
      const connNames: string[] = Object.values(allConnections).reduce((a: ConnectionType[], c: ConnectionType[]) => {
        a.push(...c)
        return a
      }, []).map((v: ConnectionType) => v.name)
      // 여기
      if (tab && this.currentPageTitle) {

        if (tab.title) {
          const title = tab.title
          const titleValidation = title.split(' ').filter(chunk => {
            return connNames.filter(value2 => value2 === chunk)
          })
          if (titleValidation.length > 0)
            this.currentPageTitle.textContent = title
        }
      }
    } catch (error) {
      console.error("Failed to get current page info:", error);
      if (this.currentPageUrl) {
        this.currentPageUrl.textContent = "페이지 정보를 가져올 수 없습니다.";
      }
      if (this.currentPageTitle) {
        this.currentPageTitle.textContent = "제목을 가져올 수 없습니다.";
      }
    }
  }

  /**
     * 이벤트 핸들러 설정
     */
  private setupEventHandlers(): void {
    try {
      // 스토리지 데이터 삭제
      if (this.clearBtn) {
        this.clearBtn.addEventListener("click", this.handleClearStorage.bind(this));
      }

      // 검색 관련 이벤트 핸들러 설정
      this.searchService.setupEventHandlers();
    } catch (error) {
      console.error('Failed to setup event handlers:', error);
    }
  }

  /**
     * 스토리지 데이터 삭제 핸들러
   */
  private async handleClearStorage(): Promise<void> {
    try {
      await this.storageController.clearStorage();
      alert(UI_MESSAGES.CLEAR_SUCCESS);
      this.searchService.resetSearchState();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      alert('데이터 삭제 중 오류가 발생했습니다.');
    }
  }

  /**
   * All 버튼 초기화 및 이벤트 핸들러 설정
   */
  private initializeAllButton(): void {
    if (this.allBtn) {

      this.allBtn.addEventListener("click", (e: MouseEvent) => {
        try {
          e.preventDefault();
          e.stopPropagation();
          this.popupService.handleAllClick()(e);
        } catch (error) {
          console.error('All button click error:', error);
          this.showErrorMessage('All 버튼 클릭 중 오류가 발생했습니다.');
        }
      });
    }
  }

  /**
     * 플랫폼 버튼 초기화 및 이벤트 핸들러 설정
     */
  private initializePlatformButtons(): void {
    try {
      const platformButtons = getPlatformButtons();

      Object.entries(platformButtons).forEach(([platform, btn]) => {
        if (btn) {
          btn.addEventListener("click", (e: MouseEvent) => {
            try {
              e.preventDefault();
              e.stopPropagation();
              const platformType = platform.toUpperCase() as "GOOGLE" | "NAVER" | "KAKAO";
              this.popupService.handleServiceClick(platformType)(e);
            } catch (error) {
              console.error(`Platform button click error (${platform}):`, error);
              this.showErrorMessage(`${platform} 버튼 클릭 중 오류가 발생했습니다.`);
            }
          });
        }
      });
    } catch (error) {
      console.error('Failed to initialize platform buttons:', error);
    }
  }

  /**
   * 현재 검색 상태 확인
   */
  public getSearchState() {
    return this.searchService.getSearchState();
  }

  /**
   * 검색 상태 리셋 (외부에서 호출 가능)
   */
  public resetSearch(): void {
    this.searchService.resetSearch();
  }

  /**
   * 리소스 정리 (메모리 누수 방지)
   */
  public destroy(): void {
    try {
      if (this.popupService) {
        this.popupService.destroy();
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// 팝업 매니저 인스턴스 생성
const popupManager = new PopupManager();

// 페이지 언로드 시 리소스 정리
window.addEventListener('beforeunload', () => {
  popupManager.destroy();
});

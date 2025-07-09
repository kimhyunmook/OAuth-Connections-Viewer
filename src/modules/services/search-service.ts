import { StorageController } from "../controllers/storage-controller";
import { renderSearchResults } from "../../common/utils/ui-utils";
import { AllConnections, SearchViewType, PlatformType, SearchResult, SearchState, SearchElements } from "../../types/type";
import { SEARCH_CONFIG, UI_MESSAGES } from "../../common/constants";

export class SearchService {
    private readonly elements: SearchElements;
    private allConnections: AllConnections | null = null;
    private isSearching = false;
    private currentView: SearchViewType = "search";
    private searchTimeout: NodeJS.Timeout | null = null;
    private storageController: StorageController
    private readonly OAcontent: HTMLDivElement;

    constructor(
        searchInput: HTMLInputElement | null,
        searchBtn: HTMLButtonElement | null,
        listUL: HTMLUListElement | null,
    ) {
        this.elements = { searchInput, searchBtn, listUL };
        this.storageController = new StorageController();
        this.OAcontent = document.getElementById('OAcontent') as HTMLDivElement
    }

    /**
     * 이벤트 핸들러 설정
     */
    public setupEventHandlers(): void {
        this.setupSearchButtonHandler();
        this.setupSearchInputHandlers();
    }

    /**
     * 검색 버튼 이벤트 핸들러 설정
     */
    private setupSearchButtonHandler(): void {
        if (this.elements.searchBtn) {
            this.elements.searchBtn.addEventListener("click", this.performSearch.bind(this));
        }
    }

    /**
     * 검색 입력창 이벤트 핸들러 설정
     */
    private setupSearchInputHandlers(): void {
        if (!this.elements.searchInput) return;

        this.elements.searchInput.addEventListener("keypress", this.handleSearchKeypress.bind(this));
        this.elements.searchInput.addEventListener("input", this.handleSearchInput.bind(this));
        this.elements.searchInput.addEventListener("focus", this.handleSearchFocus.bind(this));
    }

    /**
     * 검색어 유효성 검사
     */
    private isValidSearchTerm(searchTerm: string): boolean {
        return searchTerm.trim().length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH;
    }

    /**
     * 연결 데이터에서 검색 실행
     */
    private searchConnections(
        allConnections: AllConnections,
        searchTerm: string
    ): SearchResult[] {
        const results: SearchResult[] = [];
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();

        Object.entries(allConnections).forEach(([platform, connections]) => {
            const platformResults = this.searchPlatformConnections(
                connections,
                normalizedSearchTerm,
                platform as PlatformType
            );
            results.push(...platformResults);
        });

        return results;
    }

    /**
     * 특정 플랫폼의 연결 데이터 검색
     */
    private searchPlatformConnections(
        connections: any[],
        searchTerm: string,
        platform: PlatformType
    ): SearchResult[] {
        return connections
            .filter((connection) => this.matchesSearchTerm(connection, searchTerm))
            .slice(0, SEARCH_CONFIG.MAX_RESULTS_PER_PLATFORM)
            .map((connection) => ({
                ...connection,
                platform,
            }));
    }

    /**
     * 검색어 매칭 확인
     */
    private matchesSearchTerm(connection: any, searchTerm: string): boolean {
        const name = connection.name?.toLowerCase() || '';
        return name.includes(searchTerm);
    }

    /**
     * 검색 상태 초기화
     */
    public resetSearchState(): void {
        this.resetSearchInput();
        this.resetInternalState();
        this.resetListDisplay();
        this.clearSearchTimeout();
    }

    /**
     * 검색 입력창 초기화
     */
    private resetSearchInput(): void {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = "";
            this.elements.searchInput.disabled = false;
            this.elements.searchInput.placeholder = UI_MESSAGES.ENTER_TO_SEARCH;
        }
    }

    /**
 * 검색 상태 초기화
 */
    private resetInternalState(): void {
        this.isSearching = false;
        this.currentView = "search";
    }

    /**
     * 리스트 표시 초기화
     */
    private resetListDisplay(): void {
        const header = this.OAcontent.querySelector('.platform-header');
        if (!header || header === null) {
            return
        }
        header.remove()
        if (this.elements.listUL) {
            this.elements.listUL.innerHTML = `<li class='list'>${UI_MESSAGES.NODATA}</li>`;
        }
    }

    /**
     * 검색 타임아웃 정리
     */
    private clearSearchTimeout(): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }
    }

    /**
     * 디바운스된 검색 실행
     */
    private performDebouncedSearch(): void {
        this.clearSearchTimeout();
        this.searchTimeout = setTimeout(
            this.performSearch.bind(this),
            SEARCH_CONFIG.DEBOUNCE_DELAY
        );
    }

    /**
     * 검색 실행
     */
    private async performSearch(): Promise<void> {
        const searchTerm = this.elements.searchInput?.value || "";

        if (!this.isValidSearchTerm(searchTerm)) {
            this.resetSearchState();
            return;
        }

        this.setSearchingState(true);

        try {
            await this.executeSearch(searchTerm);
        } catch (error) {
            this.handleSearchError(error);
        }
    }

    /**
     * 검색 상태 설정
     */
    private setSearchingState(searching: boolean): void {
        this.isSearching = searching;
        this.currentView = "search";
    }

    /**
     * 실제 검색 실행
     */
    private async executeSearch(searchTerm: string): Promise<void> {
        this.allConnections = await this.storageController.getAllConnections();

        if (this.allConnections && this.elements.listUL) {
            const searchResults = this.searchConnections(this.allConnections, searchTerm);
            renderSearchResults(searchResults, this.elements.listUL, searchTerm);
            this.resetListStyles();
        }
    }

    /**
     * 리스트 스타일 초기화
     */
    private resetListStyles(): void {
        if (this.elements.listUL) {
            this.elements.listUL.classList.add("list-scroll-reset");
        }
    }

    /**
     * 검색 오류 처리
     */
    private handleSearchError(error: any): void {
        console.error("Search failed:", error);
        if (this.elements.listUL) {
            this.elements.listUL.innerHTML = `<li class="list no-results">${UI_MESSAGES.SEARCH_ERROR}</li>`;
        }
    }

    /**
     * 검색 키프레스 핸들러
     */
    private handleSearchKeypress(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            this.performSearch();
        }
    }

    /**
     * 검색 입력 핸들러
     */
    private handleSearchInput(): void {
        const searchTerm = this.elements.searchInput?.value.trim() || "";

        if (searchTerm.length === 0) {
            this.resetSearchState();
        } else if (this.isValidSearchTerm(searchTerm)) {
            this.performDebouncedSearch();
        }
    }

    /**
     * 검색 포커스 핸들러
     */
    private async handleSearchFocus(): Promise<void> {
        this.updateSearchPlaceholder();
        await this.refreshStorageData();
    }

    /**
     * 검색 플레이스홀더 업데이트
     */
    private updateSearchPlaceholder(): void {
        if (this.elements.searchInput && this.elements.searchInput.placeholder !== UI_MESSAGES.ENTER_TO_SEARCH) {
            this.elements.searchInput.placeholder = UI_MESSAGES.ENTER_TO_SEARCH;
        }
    }

    /**
     * 스토리지 데이터 새로고침
     */
    private async refreshStorageData(): Promise<void> {
        try {
            this.allConnections = await this.storageController.getAllConnections();
            this.resetInternalState();
            this.resetListDisplay();
            this.resetListStyles();
            console.log("Storage data refreshed on focus");
        } catch (error) {
            console.error("Failed to refresh storage data:", error);
            this.resetListDisplay();
        }
    }

    /**
     * 검색 상태 가져오기
     */
    public getSearchState(): SearchState {
        return {
            isSearching: this.isSearching,
            currentView: this.currentView,
        };
    }

    /**
     * 검색 리셋
     */
    public resetSearch(): void {
        this.resetSearchState();
    }
} 
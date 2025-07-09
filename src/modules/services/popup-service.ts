import { ConnectionType, AllConnections, PlatformType, TabMessage, ConnectionResponse } from "../../types/type";
import { SERVICE_CONFIG, PLATFORM_INFO, MSGTYPE } from "../../common/constants";
import { LoadingService } from "./loading-service";
import { StorageController } from "../controllers/storage-controller";


export class PopupService {
    private readonly listUL: HTMLUListElement;
    private readonly OAcontent: HTMLDivElement;
    private lastPlatformKey: keyof typeof SERVICE_CONFIG | null = null;
    private lastListener: ((msg: TabMessage, sender: any) => void) | null = null;
    private readonly TIMEOUT_MS = 15000; // 15초 타임아웃
    private storageController: StorageController;
    private loadingService: LoadingService
    constructor() {
        const elementUl = document.getElementById("OAlists");
        const elementDiv = document.getElementById('OAcontent')

        if (!elementUl || !elementDiv) {
            let target = []
            switch (false) {
                case !elementUl: target.push('OAlist')
                    break;
                case !elementDiv: target.push('OAcontent')
                    break;
            }
            throw new Error(`Required DOM element not found ${target.join(',')}`);
        }

        this.OAcontent = elementDiv as HTMLDivElement;
        this.listUL = elementUl as HTMLUListElement;
        this.listUL.classList.add("list-scroll-reset");
        this.setupMessageListener();
        this.storageController = new StorageController()
        this.loadingService = new LoadingService()
    }

    /**
     * 사용자 친화적 에러 메시지 생성
     */
    private getErrorMessage(error: Error): string {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('permission') || errorMessage.includes('권한')) {
            return '권한이 필요합니다. 확장 프로그램 권한을 확인해주세요.';
        }
        if (errorMessage.includes('timeout') || errorMessage.includes('타임아웃')) {
            return '요청 시간이 초과되었습니다. 다시 시도해주세요.';
        }
        if (errorMessage.includes('network') || errorMessage.includes('네트워크')) {
            return '네트워크 연결을 확인해주세요.';
        }
        if (errorMessage.includes('storage')) {
            return '저장소 접근에 실패했습니다. 브라우저를 다시 시작해주세요.';
        }
        if (errorMessage.includes('tab')) {
            return '탭 생성에 실패했습니다. 브라우저 권한을 확인해주세요.';
        }

        return '오류가 발생했습니다. 다시 시도해주세요.';
    }

    /**
     * 연결 리스트 렌더링
     */
    private renderList(
        connections: ConnectionType[],
        emptyMessage: string,
        platformName?: string
    ): void {
        this.clearList();
        this.resetListStyles();

        if (connections.length === 0) {
            this.renderEmptyMessage(emptyMessage);
            return;
        }

        this.loadingService.showLoading('body');
        this.renderPlatformHeader(platformName, connections.length);
        this.renderConnectionItems(connections);
    }

    /**
     * All 연결 리스트 렌더링 (플랫폼별로 그룹화)
     */
    private renderAllConnections(allConnections: AllConnections): void {
        this.clearList();
        this.loadingService.hideLoading();
        this.resetListStyles();

        const totalConnections = this.getTotalConnectionCount(allConnections);

        if (totalConnections === 0) {
            this.renderEmptyMessage("저장된 OAuth 연결이 없습니다. <br /> 먼저 플랫폼 별 OAuth 데이터를 가져와주세요.");
            return;
        }

        let total: number = 0
        // 플랫폼별로 연결 렌더링
        Object.entries(allConnections).forEach(([platform, connections]) => {
            if (connections.length > 0) {
                const platformName = PLATFORM_INFO[platform.toUpperCase() as keyof typeof PLATFORM_INFO]?.DISPLAY_NAME || platform;
                total += connections.length
                this.renderConnectionItemsWithPlatform(connections, platform as PlatformType);
            }
        });
        this.renderPlatformHeader('내 전체 OAuth', total);
    }

    /**
     * 전체 연결 수 계산
     */
    private getTotalConnectionCount(allConnections: AllConnections): number {
        return Object.values(allConnections).reduce((total, connections) => total + connections.length, 0);
    }


    /**
     * 플랫폼 헤더 렌더링
     */
    private renderPlatformHeader(platformName?: string, count?: number): void {
        if (!platformName) return;
        // this.hideLoading()
        const headerElement = document.createElement("div");
        headerElement.className = "platform-header";
        headerElement.innerHTML = `<p>${platformName} (${count}개)</p>`;
        this.OAcontent.insertBefore(headerElement, this.OAcontent.firstChild);
    }


    /**
     * 플랫폼 정보와 함께 연결 아이템 렌더링
     */
    private renderConnectionItemsWithPlatform(connections: ConnectionType[], platform: PlatformType): void {
        connections.forEach((connection) => {
            const listItem = document.createElement("li");
            listItem.className = "list";
            listItem.innerHTML = `
                <img src="${connection.image}" alt="${connection.name}" onerror="this.style.display='none'">
                <span class="service-name">${connection.name}</span>
                <span class="platform-badge">${PLATFORM_INFO[platform.toUpperCase() as keyof typeof PLATFORM_INFO]?.DISPLAY_NAME || platform}</span>
            `;
            this.listUL.appendChild(listItem);
        });
    }

    /**
     * 리스트 초기화
     */
    private clearList(): boolean {
        this.listUL.innerHTML = "";
        const header = this.OAcontent.querySelector('.platform-header');
        if (!header || header === null) {
            return true
        }
        header.remove()
        return true
    }

    /**
     * 리스트 스타일 초기화
     */
    private resetListStyles(): void {
        this.listUL.classList.add("list-scroll-reset");
    }

    /**
     * 빈 메시지 렌더링
     */
    private renderEmptyMessage(message: string): void {
        this.listUL.innerHTML = `<li class='list'>${message}</li>`;
    }


    /**
     * 연결 아이템들 렌더링
     */
    private renderConnectionItems(connections: ConnectionType[]): void {
        connections.forEach((connection) => {
            const listItem = document.createElement("li");
            listItem.className = "list";
            listItem.innerHTML = `
        <img src="${connection.image}" alt="${connection.name}" onerror="this.style.display='none'">
        <span class="service-name">${connection.name}</span>
      `;
            this.listUL.appendChild(listItem);
        });
        this.hideLoading()

    }

    /**
     * All 버튼 클릭 핸들러
     */
    public handleAllClick() {
        return (event: MouseEvent) => {
            this.handleClickEvent(event);
            this.processAllRequest();
        };
    }

    /**
     * 서비스 클릭 핸들러
     */
    public handleServiceClick(service: keyof typeof SERVICE_CONFIG) {
        const config = SERVICE_CONFIG[service];

        return (event: MouseEvent) => {
            this.handleClickEvent(event);
            this.processServiceRequest(service, config);
        };
    }

    /**
     * 클릭 이벤트 처리
     */
    private handleClickEvent(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }

    /**
     * All 요청 처리
     */
    private async processAllRequest(): Promise<void> {
        this.lastPlatformKey = null;

        this.clearList();
        this.loadingService.showLoading("#OAlists", "모든 OAuth 연결을 가져오는 중...");

        try {
            const allConnections = await this.storageController.getAllConnections();
            this.renderAllConnections(allConnections);
        } catch (error) {
            console.error("Failed to load all connections:", error);
            const errorMessage = this.getErrorMessage(error as Error);
            this.renderEmptyMessage(errorMessage);
        }
    }

    /**
     * 서비스 요청 처리
     */
    private processServiceRequest(
        service: keyof typeof SERVICE_CONFIG,
        config: typeof SERVICE_CONFIG[keyof typeof SERVICE_CONFIG]
    ): void {
        this.lastPlatformKey = service;
        const platformName = PLATFORM_INFO[service]?.DISPLAY_NAME || service;

        this.clearList();
        this.loadingService.showLoading("#OAlists", config.LOADING_MSG);

        this.checkCachedData(config, platformName);
    }

    /**
     * 캐시된 데이터 확인
     */
    private checkCachedData(
        config: typeof SERVICE_CONFIG[keyof typeof SERVICE_CONFIG],
        platformName: string
    ): void {
        chrome.storage.local.get(config.STORAGE_KEY, (store) => {
            if (chrome.runtime.lastError) {
                console.error('Storage access error:', chrome.runtime.lastError);
                this.renderEmptyMessage('저장소 접근에 실패했습니다.');
                return;
            }

            const cachedData = store[config.STORAGE_KEY];

            if (cachedData && cachedData.length > 0) {
                this.renderList(cachedData, config.EMPTY_MSG, platformName);
                return;
            }

            this.createTabAndListen(config, platformName);
        });
    }

    /**
     * 탭 생성 및 메시지 리스너 설정
     */
    private createTabAndListen(
        config: typeof SERVICE_CONFIG[keyof typeof SERVICE_CONFIG],
        platformName: string
    ): void {
        let openedTabId: number | null = null;

        try {
            chrome.tabs.create({ url: config.URL, active: false }, (tab) => {
                if (chrome.runtime.lastError) {
                    console.error('Failed to create tab:', chrome.runtime.lastError);
                    this.renderEmptyMessage('탭을 생성할 수 없습니다. 권한을 확인해주세요.');
                    return;
                }

                if (!tab?.id) {
                    this.renderEmptyMessage('탭 생성에 실패했습니다.');
                    return;
                }

                openedTabId = tab.id;
                this.setupTabMessageListener(config, platformName, openedTabId);
            });
        } catch (error) {
            console.error('Error creating tab:', error);
            this.renderEmptyMessage('탭 생성 중 오류가 발생했습니다.');
        }
    }

    /**
     * 탭 메시지 리스너 설정
     */
    private setupTabMessageListener(
        config: typeof SERVICE_CONFIG[keyof typeof SERVICE_CONFIG],
        platformName: string,
        openedTabId: number
    ): void {
        // 기존 리스너 제거
        if (this.lastListener) {
            chrome.runtime.onMessage.removeListener(this.lastListener);
        }

        this.lastListener = (msg: TabMessage, sender: any) => {
            this.handleTabMessage(msg, sender, config, platformName, openedTabId);
            return true;
        };

        chrome.runtime.onMessage.addListener(this.lastListener);
    }

    /**
     * 탭 메시지 처리
     */
    private handleTabMessage(
        msg: TabMessage,
        sender: any,
        config: typeof SERVICE_CONFIG[keyof typeof SERVICE_CONFIG],
        platformName: string,
        openedTabId: number
    ): void {
        // READY 메시지 처리
        if (msg.type === config.READY_TYPE && msg.tabId === openedTabId) {
            this.handleReadyMessage(config, platformName, openedTabId);
        }

        // LOGIN_REQUIRED 메시지 처리
        if (msg.type === "LOGIN_REQUIRED" && this.isLoginRequiredForTab(msg, sender, openedTabId)) {
            this.handleLoginRequiredMessage(openedTabId);
        }
    }

    /**
     * READY 메시지 처리
     */
    private handleReadyMessage(
        config: typeof SERVICE_CONFIG[keyof typeof SERVICE_CONFIG],
        platformName: string,
        tabId: number
    ): void {
        chrome.tabs.remove(tabId, () => {
            if (chrome.runtime.lastError) {
                // console.error('Failed to remove tab:', chrome.runtime.lastError.message);
                return
            }
        });

        // 타임아웃 설정
        const timeout = setTimeout(() => {
            this.renderEmptyMessage('데이터를 가져오는 중 시간이 초과되었습니다.');
            this.cleanupListener();
        }, this.TIMEOUT_MS);

        chrome.runtime.sendMessage(
            { type: config.GET_TYPE },
            (response: ConnectionResponse) => {
                clearTimeout(timeout);

                if (chrome.runtime.lastError) {
                    console.error('Message error:', chrome.runtime.lastError);
                    this.renderEmptyMessage('데이터를 가져오는 중 오류가 발생했습니다.');
                    return;
                }

                if (response?.error) {
                    console.error('Response error:', response.error);
                    this.renderEmptyMessage('데이터를 가져오는 중 오류가 발생했습니다.');
                    return;
                }

                this.renderList(response.connections, config.EMPTY_MSG, platformName);
            }
        );
        this.cleanupListener();
    }

    /**
     * 로그인 필요 메시지 처리
     */
    private handleLoginRequiredMessage(tabId: number): void {
        chrome.tabs.remove(tabId, () => {
            if (chrome.runtime.lastError) {
                // console.error('Failed to remove tab:', chrome.runtime.lastError.message);
                return
            }
        });
        this.cleanupListener();
    }

    /**
     * 로그인 필요 여부 확인
     */
    private isLoginRequiredForTab(msg: TabMessage, sender: any, openedTabId: number): boolean {
        return (
            msg.type === MSGTYPE.LOGIN_REQUIRED &&
            openedTabId !== null &&
            (!sender.tab || sender.tab.id === openedTabId || msg.tabId === openedTabId)
        );
    }

    /**
     * 리스너 정리
     */
    private cleanupListener(): void {
        if (this.lastListener) {
            chrome.runtime.onMessage.removeListener(this.lastListener);
            this.lastListener = null;
        }
    }

    /**
     * 로그인 필요 메시지 리스너 설정
     */
    private setupMessageListener(): void {
        chrome.runtime.onMessage.addListener((msg: TabMessage) => {
            if (msg.type === "LOGIN_REQUIRED") {
                this.handleGlobalLoginRequiredMessage(msg);
            }
            return true
        });
    }

    /**
     * 전역 로그인 필요 메시지 처리
     */
    private handleGlobalLoginRequiredMessage(msg: TabMessage): void {
        this.loadingService.hideLoading();
        const emptyMessage = this.getLoginRequiredMessage(msg);

        this.renderEmptyMessage(emptyMessage);
        this.resetListStyles();
    }

    /**
     * 로그인 필요 메시지 가져오기
     */
    private getLoginRequiredMessage(msg: TabMessage): string {
        // 클릭한 플랫폼의 메시지 우선 사용
        if (this.lastPlatformKey && SERVICE_CONFIG[this.lastPlatformKey]) {
            return SERVICE_CONFIG[this.lastPlatformKey].EMPTY_MSG;
        }

        // 메시지에 포함된 서비스 키 사용
        if (msg.service && SERVICE_CONFIG[msg.service as keyof typeof SERVICE_CONFIG]) {
            return SERVICE_CONFIG[msg.service as keyof typeof SERVICE_CONFIG].EMPTY_MSG;
        }

        // 기본 메시지 사용
        return SERVICE_CONFIG.GOOGLE.EMPTY_MSG;
    }

    /**
     * 로딩 상태 확인
     */
    public isLoading(): boolean {
        return this.loadingService.isLoading();
    }

    /**
     * 로딩 숨기기
     */
    public hideLoading(): void {
        this.loadingService.hideLoading();
    }

    /**
     * 리소스 정리 (메모리 누수 방지)
     */
    public destroy(): void {
        this.cleanupListener();
        this.loadingService.hideLoading();
    }
}

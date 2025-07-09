export class LoadingService {
    private loadingDiv: HTMLElement | null = null;
    private targetElement: HTMLElement | null = null;

    public showLoading(targetSelector: string = "body", loadingMsg: string = '로딩 중...') {
        // 기존 로딩 UI제거
        this.hideLoading();

        this.loadingDiv = document.createElement("div");
        this.loadingDiv.id = "oacv-loading";
        this.loadingDiv.className = "oacv-loading-container";

        this.loadingDiv.innerHTML = `
            <li>
                <div class="oacv-loading-backdrop">
                    <div class="oacv-spinner">
                    <div class="oacv-spinner-circle"></div>
                    <p>${loadingMsg}</p>
                    </div>
                </div>
            </li>
        `;

        this.targetElement = document.querySelector(targetSelector) || document.body;

        // 타겟 요소에 position 설정
        if (this.targetElement !== document.body) {
            const targetElement = this.targetElement as HTMLElement;
            if (getComputedStyle(targetElement).position === 'static') {
                targetElement.style.position = 'relative';
            }

            // OAlists인 경우 스크롤 제어 클래스 추가
            if (targetElement.id === 'OAlists') {
                targetElement.classList.add('oacv-loading-active');
            }
        }

        this.targetElement.appendChild(this.loadingDiv);
    }

    public hideLoading() {
        if (this.loadingDiv) {
            this.loadingDiv.remove();
            this.loadingDiv = null;
        }

        // OAlists의 스크롤 제어 클래스 제거
        if (this.targetElement && this.targetElement.id === 'OAlists') {
            this.targetElement.classList.remove('oacv-loading-active');
            this.targetElement = null;
        }
    }

    public isLoading(): boolean {
        return this.loadingDiv !== null;
    }

    public getLoadingElement(): HTMLElement | null {
        return this.loadingDiv;
    }
}

// 싱글톤 인스턴스 생성
export const loadingService = new LoadingService();

// 기존 함수들을 유지하여 호환성 보장
export function showLoading(targetSelector: string = "body", loadingMsg: string = '로딩 중...') {
    loadingService.showLoading(targetSelector, loadingMsg);
}

export function hideLoading() {
    loadingService.hideLoading();
} 
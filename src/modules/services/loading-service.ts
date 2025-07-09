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


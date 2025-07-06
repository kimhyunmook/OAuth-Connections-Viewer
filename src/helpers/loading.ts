export function showLoading(targetSelector: string = "body", loadingMsg: string = '로딩 중...') {
  // 기존 로딩 UI가 있다면 제거
  hideLoading();

  const loadingDiv = document.createElement("div");
  loadingDiv.id = "oacv-loading";
  loadingDiv.style.position = "relative";
  loadingDiv.style.width = "100%";
  loadingDiv.style.height = "100%";
  loadingDiv.style.minHeight = "300px";

  loadingDiv.innerHTML = `
    <div class="oacv-loading-backdrop">
      <div class="oacv-spinner">
        <div class="oacv-spinner-circle"></div>
        <p>${loadingMsg}</p>
      </div>
    </div>
  `;

  const target = document.querySelector(targetSelector) || document.body;

  // 타겟 요소에 position 설정
  if (target !== document.body) {
    const targetElement = target as HTMLElement;
    if (getComputedStyle(targetElement).position === 'static') {
      targetElement.style.position = 'relative';
    }

    // OAlists인 경우 스크롤 제어 및 높이 설정
    if (targetElement.id === 'OAlists') {
      targetElement.style.overflow = 'hidden';
      targetElement.style.overflowY = 'hidden';
      targetElement.style.minHeight = '300px';
      targetElement.style.height = '300px';
    }
  }

  target.appendChild(loadingDiv);
}

export function hideLoading() {
  const loadingDiv = document.getElementById("oacv-loading");
  if (loadingDiv) {
    loadingDiv.remove();

    // OAlists의 스크롤 및 높이 복원
    const oaLists = document.getElementById("OAlists");
    if (oaLists) {
      oaLists.style.overflow = '';
      oaLists.style.overflowY = 'scroll';
      oaLists.style.minHeight = '';
      oaLists.style.height = '';
    }
  }
} 
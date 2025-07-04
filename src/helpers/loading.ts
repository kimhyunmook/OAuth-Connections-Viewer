export function showLoading(targetSelector: string = "body", loadingMsg: string = '로딩 중...') {
    if (document.getElementById("oacv-loading")) return;

    const loadingDiv = document.createElement("div");
    loadingDiv.id = "oacv-loading";
    loadingDiv.innerHTML = `
    <div class="oacv-loading-backdrop">
      <div class="oacv-spinner">
        <div class="oacv-spinner-circle"></div>
        <p>${loadingMsg}</p>
      </div>
    </div>
  `;
    const target = document.querySelector(targetSelector) || document.body;
    target.appendChild(loadingDiv);
}

export function hideLoading() {
    const loadingDiv = document.getElementById("oacv-loading");
    if (loadingDiv) loadingDiv.remove();
} 
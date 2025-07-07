import { ConnectionType } from "../types/type";
import { SERVICE_CONFIG } from "../config/script-config";
import { showLoading, hideLoading } from "./loading";
import { PLATFORM_INFO } from "../constants";

const listUL = document.getElementById("OAlists") as HTMLUListElement;

/**
 * 연결 리스트 렌더링
 */
function renderList(
  conns: ConnectionType[],
  emptyMsg: string,
  platform?: string
) {
  listUL.innerHTML = "";
  hideLoading();

  // OAlists를 원래 크기로 복원
  listUL.style.minHeight = "";
  listUL.style.height = "";
  listUL.style.overflow = "";
  listUL.style.overflowY = "scroll";

  if (conns.length === 0) {
    listUL.innerHTML = `<li class='list'>${emptyMsg}</li>`;
    return;
  }

  // 플랫폼 헤더 추가
  if (platform) {
    const headerLi = document.createElement("li");
    headerLi.className = "list platform-header";
    headerLi.innerHTML = `<p>${platform} (${conns.length}개)</p>`;
    listUL.appendChild(headerLi);
  }

  // 연결 목록 렌더링 (검색 리스트와 동일한 스타일)
  conns.forEach((c) => {
    const li = document.createElement("li");
    li.className = "list";
    li.innerHTML = `
      <img src="${c.image}" alt="${c.name}">
      <span class="service-name">${c.name}</span>
    `;
    listUL.appendChild(li);
  });
}

/**
 * 로그인 필요 메시지 리스너
 */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "LOGIN_REQUIRED") {
    hideLoading();
    let emptyMsg = "로그인이 필요합니다! 로그인 후 다시 시도해주세요.";
    const serviceKey = msg.service as keyof typeof SERVICE_CONFIG;
    if (
      serviceKey &&
      SERVICE_CONFIG[serviceKey] &&
      SERVICE_CONFIG[serviceKey].EMPTY_MSG
    ) {
      emptyMsg = SERVICE_CONFIG[serviceKey].EMPTY_MSG;
    } else {
      // serviceKey가 없거나 잘못된 경우에도 플랫폼별 EMPTY_MSG를 기본값으로 사용
      // (플랫폼별 기본 메시지 중 하나를 선택, 예: 구글)
      emptyMsg = SERVICE_CONFIG.GOOGLE.EMPTY_MSG;
    }
    listUL.innerHTML = `<li class='list fail'>${emptyMsg}</li>`;
    listUL.style.minHeight = "";
    listUL.style.height = "";
    listUL.style.overflow = "";
    listUL.style.overflowY = "scroll";
    // alert(emptyMsg);
  }
});

/**
 * 서비스 클릭 핸들러
 */
export function handleServiceClick(service: keyof typeof SERVICE_CONFIG) {
  const cfg = SERVICE_CONFIG[service];

  return (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const platformName = PLATFORM_INFO[service]?.DISPLAY_NAME || service;

    listUL.innerHTML = "";
    showLoading("#OAlists", cfg.LOADING_MSG);

    chrome.storage.local.get(cfg.STORAGE_KEY, (store) => {
      const cached = store[cfg.STORAGE_KEY];

      if (cached && cached.length > 0) {
        renderList(cached, cfg.EMPTY_MSG, platformName);
        return;
      }

      chrome.tabs.create({ url: cfg.URL, active: false }, (tab) => {
        chrome.runtime.onMessage.addListener(function listener(msg, sender) {
          if (msg.type === cfg.READY_TYPE && msg.tabId === tab.id) {
            chrome.tabs.remove(tab.id!);
            chrome.runtime.sendMessage(
              { type: cfg.GET_TYPE },
              (res: { connections: ConnectionType[] }) => {
                renderList(res.connections, cfg.EMPTY_MSG, platformName);
              }
            );
            chrome.runtime.onMessage.removeListener(listener);
          }
        });
      });
    });
  };
}

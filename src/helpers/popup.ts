import { ConnectionType } from "../types/type";
import { SERVICE_CONFIG } from "../config/script-config";
import { showLoading, hideLoading } from "./loading";

const listUL = document.getElementById("OAlists") as HTMLUListElement;

function renderList(conns: ConnectionType[], emptyMsg: string) {
  listUL.innerHTML = "";
  hideLoading();
  if (conns.length === 0) {
    listUL.innerHTML = `<li class='list'>${emptyMsg}</li>`;
    return;
  }
  conns.forEach((c) => {
    const li = document.createElement("li");
    li.className = "list";
    li.innerHTML = `<img src="${c.image}" alt=""><p class="font-medium">${c.name}</p>`;
    listUL.appendChild(li);
  });
}

// LOGIN_REQUIRED 메시지 수신 시 alert 표시
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "LOGIN_REQUIRED") {
    alert("로그인이 필요한 페이지로 이동했습니다! 로그인 후 다시 시도해주세요.");
  }
});

export function handleServiceClick(service: keyof typeof SERVICE_CONFIG) {
  const cfg = SERVICE_CONFIG[service];
  return (e: MouseEvent) => {
    e.preventDefault();
    console.log('스크립트 실행 페이지 URL:', cfg.url);
    listUL.innerHTML = '';
    showLoading("#OAlists");
    chrome.storage.local.get(cfg.storageKey, (store) => {
      const cached = store[cfg.storageKey];
      if (cached && cached.length > 0) {
        renderList(cached, cfg.emptyMsg);
        return;
      }
      chrome.tabs.create({ url: cfg.url, active: false }, (tab) => {
        chrome.runtime.onMessage.addListener(function listener(msg, sender) {
          if (msg.type === cfg.readyType && msg.tabId === tab.id) {
            chrome.tabs.remove(tab.id!);
            chrome.runtime.sendMessage(
              { type: cfg.getType },
              (res: { connections: ConnectionType[] }) => {
                renderList(res.connections, cfg.emptyMsg);
              }
            );
            chrome.runtime.onMessage.removeListener(listener);
          }
        });
      });
    });
  };
}

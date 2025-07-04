import { ConnectionType } from "../types/type";
import { SERVICE_CONFIG } from "../config/script-config";

const listUL = document.getElementById("OAlists") as HTMLUListElement;

function renderList(conns: ConnectionType[], emptyMsg: string) {
    listUL.innerHTML = "";
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

export function handleServiceClick(service: keyof typeof SERVICE_CONFIG) {
    const cfg = SERVICE_CONFIG[service];
    return (e: MouseEvent) => {
        e.preventDefault();
        listUL.innerHTML = cfg.loadingMsg;
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
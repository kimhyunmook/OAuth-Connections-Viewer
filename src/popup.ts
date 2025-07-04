import { ConnectionType, OauthType } from "./types/type";

const googleBtn = document.getElementById("google-load") as HTMLButtonElement;
const naverBtn = document.getElementById("naver-load") as HTMLButtonElement;
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
    li.innerHTML = `<img src="${c.image}" alt="image"><p class="font-medium">${c.name}</p>`;
    listUL.appendChild(li);
  });
}

googleBtn.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  chrome.runtime.sendMessage(
    { type: "GOOGLE_GET" } as { type: OauthType },
    (res: { connections: ConnectionType[] }): void => {
      renderList(
        res.connections,
        "데이터가 없습니다. <a href='https://myaccount.google.com/connections' target='_blank'>My Account 페이지</a>를 먼저 방문해주세요."
      );
    }
  );
});

naverBtn.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  chrome.runtime.sendMessage(
    { type: "NAVER_GET" } as { type: OauthType },
    (res: { connections: ConnectionType[] }): void => {
      renderList(
        res.connections,
        "데이터가 없습니다. <a href='https://nid.naver.com/internalToken/view/tokenList/pc/ko' target='_blank'>네이버 토큰 관리 페이지</a>를 먼저 방문해주세요."
      );
    }
  );
});

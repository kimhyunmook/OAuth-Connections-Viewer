import { Connection } from "./types/type";
const loadBtn = document.getElementById("google-load") as HTMLButtonElement;
const listUL = document.getElementById("OAlists") as HTMLUListElement;

loadBtn.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();

  chrome.runtime.sendMessage(
    { type: "GET_CONNECTIONS" },
    (res: { connections: Connection[] }) => {
      const conns = res.connections;
      listUL.innerHTML = "";
      if (conns.length === 0) {
        listUL.innerHTML =
          "<li class='list'>데이터가 없습니다. <a href='https://myaccount.google.com/connections'>My Account 페이지</a>를 먼저 방문해주세요.</li>";
        return;
      }
      conns.forEach((c) => {
        const li = document.createElement("li");
        li.className = "list";
        li.innerHTML = `<img src="${c.image}" class="w-8 h-8 rounded-full bg-gray-200" alt=""><p class="font-medium">${c.name}</p>`;
        listUL.appendChild(li);
      });
    }
  );
});

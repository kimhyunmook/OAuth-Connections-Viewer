const loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;
const listEl = document.getElementById("OAlist") as HTMLUListElement;

type Connection = {
  image?: string;
  name?: string;
};

loadBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage(
    { type: "GET_CONNECTIONS" },
    (res: { connections: Connection[] }) => {
      const conns = res.connections;
      listEl.innerHTML = "";
      if (conns.length === 0) {
        listEl.innerHTML =
          "<li class='text-gray-500'>데이터가 없습니다. My Account 페이지를 먼저 방문해주세요.</li>";
        return;
      }
      conns.forEach((c) => {
        const li = document.createElement("li");
        li.className = "flex items-center gap-3 bg-white rounded shadow p-2";
        li.innerHTML = `<img src="${c.image}" class="w-8 h-8 rounded-full bg-gray-200" alt=""><p class="font-medium">${c.name}</p>`;
        listEl.appendChild(li);
      });
    }
  );
});

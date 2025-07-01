// content-script.ts

// Connection 타입은 한 번만 선언
export type Connection = {
  image?: string;
  name?: string;
};

function parseConnections(): Connection[] {
  // ul.u7hyyf 안의 모든 li 요소의 텍스트를 추출
  const ul = document.querySelector("div.OZ7tnf div.edUmvf.iUwXVd ul.u7hyyf");
  if (!ul) {
    console.log("ul.u7hyyf not found");
    return [];
  }
  const items = Array.from(
    ul.querySelectorAll("li div.VfPpkd-ksKsZd-XxIAqe.i3FRte > a.RlFDUe.mlgsfe")
  ).map((li) => {
    const image = (li.querySelector("img.bLJ69") as HTMLImageElement)?.src;
    const name = li.querySelector("div.tXqPBe > div")?.textContent || undefined;
    return { image, name };
  });

  return items;
}

window.addEventListener("load", () => {
  setTimeout(() => {
    const data = parseConnections();
    chrome.runtime.sendMessage({ type: "SAVE_CONNECTIONS", payload: data });
  }, 1000);
});

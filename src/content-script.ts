import { ConnectionType, OauthType } from "./types/type";

function parseConnections_google(): ConnectionType[] {
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
    const data = parseConnections_google();
    chrome.runtime.sendMessage<{ type: OauthType; payload: any[] }>({
      type: "GOOGLE_GET",
      payload: data,
    });
  }, 1000);
});

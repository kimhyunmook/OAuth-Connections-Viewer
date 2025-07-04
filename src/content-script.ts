interface ParseConnectionType {
  parentDom: string
  listDom: string
  imageDom: string
  nameDom: string
}
type OauthType =
  | "GOOGLE_GET"
  | "GOOGLE_SAVE"
  | "NAVER_GET"
  | "NAVER_SAVE";


function parseConnection({ parentDom, listDom, imageDom, nameDom }: ParseConnectionType, cb?: () => void) {
  const parentEl = document.querySelector(parentDom);
  if (!parentEl) {
    console.log("parent element not found");
    return [];
  }
  const items = Array.from(
    parentEl.querySelectorAll(listDom)
  ).map((list) => {
    const image = (list.querySelector(imageDom) as HTMLImageElement)?.src;
    const name = list.querySelector(nameDom)?.textContent || undefined;
    return { image, name };
  });
  if (cb)
    cb()
  return items;
}
function sendMessageData(type: OauthType, dataFnc: () => any, time?: number) {
  setTimeout(() => {
    const data = dataFnc();
    chrome.runtime.sendMessage({
      type,
      payload: data,
    });
  }, time ? time : 1000);
}

function parseConnections_google() {
  const items = parseConnection({
    parentDom: "div.OZ7tnf div.edUmvf.iUwXVd ul.u7hyyf",
    listDom: "li div.VfPpkd-ksKsZd-XxIAqe.i3FRte > a.RlFDUe.mlgsfe",
    imageDom: "img.bLJ69",
    nameDom: "div.tXqPBe > div",
  })
  return items;
}

function parseConnections_naver() {
  const items = parseConnection({
    parentDom: "oauthTokenList",
    listDom: "tr.list",
    imageDom: "tr.list td.site img",
    nameDom: "td.site strong.service_title",
  })
  return items;
}

// window.addEventListener("load", () => {
//   sendMessageData('GOOGLE_SAVE', parseConnections_google)
// });
// window.addEventListener("load", () => {
//   sendMessageData('NAVER_SAVE', parseConnections_naver)
// });



// function parseConnections_google() {
//   const ul = document.querySelector("div.OZ7tnf div.edUmvf.iUwXVd ul.u7hyyf");
//   console.log(ul)
//   if (!ul) {
//     console.log("ul.u7hyyf not found");
//     return [];
//   }
//   const items = Array.from(
//     ul.querySelectorAll("li div.VfPpkd-ksKsZd-XxIAqe.i3FRte > a.RlFDUe.mlgsfe")
//   ).map((li) => {
//     const image = (li.querySelector("img.bLJ69") as HTMLImageElement)?.src;
//     const name = li.querySelector("div.tXqPBe > div")?.textContent || undefined;
//     return { image, name };
//   });

//   return items;
// }


// function parseConnections_naver() {
//   const oauthList = document.getElementById("oauthTokenList");
//   if (!oauthList) {
//     console.log("oauthList not found");
//     return [];
//   }
//   const items = Array.from(oauthList.querySelectorAll('tr.list')).map((row) => {
//     const image = (row.querySelector("td.site img") as HTMLImageElement)?.src;
//     const name = (row.querySelector("td.site strong.service_title") as HTMLElement)?.textContent?.trim() || undefined;
//     return { image, name };
//   });
//   return items;
// }

window.addEventListener("load", () => {
  setTimeout(() => {
    const data = parseConnections_google();
    chrome.runtime.sendMessage({
      type: "GOOGLE_GET",
      payload: data,
    });
  }, 1000);
});

window.addEventListener("load", () => {
  setTimeout(() => {
    const data = parseConnections_naver();
    chrome.runtime.sendMessage({
      type: "NAVER_SAVE",
      payload: data,
    });
  }, 1000);
});

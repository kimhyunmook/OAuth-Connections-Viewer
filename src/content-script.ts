import { parseConnection } from "./utils/connection";

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
    parentDom: "#oauthTokenList",
    listDom: "tr.list",
    imageDom: "tr.list td.site img",
    nameDom: "td.site strong.service_title",
  })
  return items;
}

function parseConnections_kakao() {
  const items = parseConnection({
    parentDom: "#serviceTabMenu1",
    listDom: ".kc_item_list fst",
    imageDom: ".kc_thumb_img img",
    nameDom: ".kc_tit_subject",
  })
  return items;
}

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

window.addEventListener("load", () => {
  setTimeout(() => {
    const data = parseConnections_kakao();
    chrome.runtime.sendMessage({
      type: "KAKAO_SAVE",
      payload: data,
    });
  }, 1000);
});

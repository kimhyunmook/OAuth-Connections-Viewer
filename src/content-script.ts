import { parseConnection, sendMessageData } from "./utils/connection";

function parseConnections_google() {
  const items = parseConnection({
    parentDom: "div.OZ7tnf ul.u7hyyf",
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
    parentDom: "div#serviceTabMenu1",
    listDom: "div.kc_item_list",
    imageDom: ".kc_thumb_img img",
    nameDom: ".kc_tit_subject",
  })
  return items;
}

window.addEventListener("load", () => {
  sendMessageData("GOOGLE_SAVE", parseConnections_google, 1000);
  sendMessageData("NAVER_SAVE", parseConnections_naver, 1000);
  sendMessageData("KAKAO_SAVE", parseConnections_kakao, 1000);
});


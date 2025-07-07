import { hideLoading } from "../helpers/loading";
import { parseConnection, isLoginPage } from "./connection-parser";

/**
 * Google 연결 정보 파싱 (재시도 로직 포함)
 */
export function parseGoogleConnections() {
  if (!window.location.href.includes("myaccount.google.com")) {
    return [];
  }
  if (isLoginPage()) {
    return [];
  }
  return parseConnection(
    {
      parentDom: "div.OZ7tnf ul.u7hyyf",
      listDom: "li div.VfPpkd-ksKsZd-XxIAqe.i3FRte > a.RlFDUe.mlgsfe",
      imageDom: "img.bLJ69",
      nameDom: "div.tXqPBe > div",
    },
    undefined,
    0,
    1
  ); // 최대 1번 재시도
}

/**
 * Naver 연결 정보 파싱 (재시도 로직 포함)
 */
export function parseNaverConnections() {
  if (!window.location.href.includes("nid.naver.com")) {
    return [];
  }
  if (isLoginPage()) {
    hideLoading();
    return [];
  }
  return parseConnection(
    {
      parentDom: "#oauthTokenList",
      listDom: "tr.list",
      imageDom: "tr.list td.site img",
      nameDom: "td.site strong.service_title",
    },
    undefined,
    0,
    1
  ); // 최대 1번 재시도
}

/**
 * Kakao 연결 정보 파싱 (재시도 로직 포함)
 */
export function parseKakaoConnections() {
  if (!window.location.href.includes("apps.kakao.com")) {
    return [];
  }
  if (isLoginPage()) {
    return [];
  }
  return parseConnection(
    {
      parentDom: "div#serviceTabMenu1",
      listDom: "div.kc_item_list",
      imageDom: ".kc_thumb_img img",
      nameDom: ".kc_tit_subject",
    },
    undefined,
    0,
    1
  ); // 최대 1번 재시도
}

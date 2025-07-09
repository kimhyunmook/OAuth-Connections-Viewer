import { PlatformType, PlatformConfig } from "../../types/type";
import { parseGoogleConnections, parseNaverConnections, parseKakaoConnections } from "../../modules/services/platform-parsers-service";

export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
    google: {
        url: "myaccount.google.com",
        service: "GOOGLE",
        selectors: {
            parentDom: "div.OZ7tnf ul.u7hyyf",
            listDom: "li div.VfPpkd-ksKsZd-XxIAqe.i3FRte > a.RlFDUe.mlgsfe",
            imageDom: "img.bLJ69",
            nameDom: "div.tXqPBe > div",
        },
    },
    naver: {
        url: "nid.naver.com",
        service: "NAVER",
        selectors: {
            parentDom: "#oauthTokenList",
            listDom: "tr.list",
            imageDom: "tr.list td.site img",
            nameDom: "td.site strong.service_title",
        },
    },
    kakao: {
        url: "apps.kakao.com",
        service: "KAKAO",
        selectors: {
            parentDom: "div#serviceTabMenu1",
            listDom: "div.kc_item_list",
            imageDom: ".kc_thumb_img img",
            nameDom: ".kc_tit_subject",
        },
    },
};

export const PLATFORM_SCRIPT_CONFIGS = [
    {
        url: "myaccount.google.com",
        type: "GOOGLE_SAVE",
        service: "GOOGLE",
        parser: parseGoogleConnections,
    },
    {
        url: "nid.naver.com",
        type: "NAVER_SAVE",
        service: "NAVER",
        parser: parseNaverConnections,
    },
    {
        url: "apps.kakao.com",
        type: "KAKAO_SAVE",
        service: "KAKAO",
        parser: parseKakaoConnections,
    },
];

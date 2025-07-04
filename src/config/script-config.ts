import { OauthType } from "../types/type";

export const googleBtn = document.getElementById("google-load") as HTMLButtonElement;
export const naverBtn = document.getElementById("naver-load") as HTMLButtonElement;
export const kakaoBtn = document.getElementById("kakao-load") as HTMLButtonElement;

export const SERVICE_CONFIG = {
    google: {
        btn: googleBtn,
        storageKey: "connections",
        saveType: "GOOGLE_SAVE" as OauthType,
        getType: "GOOGLE_GET" as OauthType,
        readyType: "GOOGLE_READY",
        url: "https://myaccount.google.com/connections",
        emptyMsg:
            "데이터가 없습니다. <a href='https://myaccount.google.com/connections' target='_blank'>My Account 페이지</a>를 먼저 방문해주세요.",
        loadingMsg: "<li class='list'>구글 연결 정보를 불러오는 중입니다...</li>",
    },
    naver: {
        btn: naverBtn,
        storageKey: "naverConnections",
        saveType: "NAVER_SAVE" as OauthType,
        getType: "NAVER_GET" as OauthType,
        readyType: "NAVER_READY",
        url: "https://nid.naver.com/internalToken/view/tokenList/pc/ko",
        emptyMsg:
            "데이터가 없습니다. <a href='https://nid.naver.com/internalToken/view/tokenList/pc/ko' target='_blank'>네이버 토큰 관리 페이지</a>를 먼저 방문해주세요.",
        loadingMsg: "<li class='list'>네이버 연결 정보를 불러오는 중입니다...</li>",
    },
    kakao: {
        btn: kakaoBtn,
        storageKey: "kakaoConnections",
        saveType: "KAKAO_SAVE" as OauthType,
        getType: "KAKAO_GET" as OauthType,
        readyType: "KAKAO_READY",
        url: "https://apps.kakao.com/connected/app/list?service_type=open",
        emptyMsg:
            "데이터가 없습니다. <a href='https://apps.kakao.com/connected/app/list?service_type=open' target='_blank'>카카오 연결 관리 페이지</a>를 먼저 방문해주세요.",
        loadingMsg: "<li class='list'>카카오 연결 정보를 불러오는 중입니다...</li>",
    },
};



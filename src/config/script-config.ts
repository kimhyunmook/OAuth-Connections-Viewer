import { ServiceConfig } from "../types/type";

export const googleBtn = document.getElementById(
  "google-load"
) as HTMLButtonElement;
export const naverBtn = document.getElementById(
  "naver-load"
) as HTMLButtonElement;
export const kakaoBtn = document.getElementById(
  "kakao-load"
) as HTMLButtonElement;


export const SERVICE_CONFIG: ServiceConfig = {
  google: {
    btn: googleBtn,
    storageKey: "connections",
    saveType: "GOOGLE_SAVE",
    getType: "GOOGLE_GET",
    readyType: "GOOGLE_READY",
    url: "https://myaccount.google.com/connections",
    emptyMsg:
      "데이터가 없습니다. 먼저 구글 로그인을 해주세요.",
    loadingMsg: "구글 연결 정보를 불러오는 중입니다...",
  },
  naver: {
    btn: naverBtn,
    storageKey: "naverConnections",
    saveType: "NAVER_SAVE",
    getType: "NAVER_GET",
    readyType: "NAVER_READY",
    url: "https://nid.naver.com/internalToken/view/tokenList/pc/ko",
    emptyMsg:
      "데이터가 없습니다. 네이버 로그인을 해주세요.",
    loadingMsg: "네이버 연결 정보를 불러오는 중입니다...",
  },
  kakao: {
    btn: kakaoBtn,
    storageKey: "kakaoConnections",
    saveType: "KAKAO_SAVE",
    getType: "KAKAO_GET",
    readyType: "KAKAO_READY",
    url: "https://apps.kakao.com/connected/app/list?service_type=open",
    emptyMsg:
      "데이터가 없습니다. 카카오 로그인 해주세요.",
    loadingMsg: "카카오 연결 정보를 불러오는 중입니다...",
  },
};

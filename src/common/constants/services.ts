import { MSGTYPE } from "./message-types";
import { STORAGE_KEYS } from "./storage";

export const SERVICE_CONFIG = {
    GOOGLE: {
        BTN: null,
        STORAGE_KEY: STORAGE_KEYS.GOOGLE,
        SAVE_TYPE: MSGTYPE.GOOGLE_SAVE,
        GET_TYPE: MSGTYPE.GOOGLE_GET,
        READY_TYPE: MSGTYPE.GOOGLE_READY,
        URL: "https://myaccount.google.com/connections",
        EMPTY_MSG:
            "데이터가 없습니다. 먼저<a href='https://myaccount.google.com/connections' target='_blank'>구글 로그인</a>을 해주세요.",
        LOADING_MSG: "구글 연결 정보를 불러오는 중입니다...",
    },
    NAVER: {
        BTN: null,
        STORAGE_KEY: STORAGE_KEYS.NAVER,
        SAVE_TYPE: MSGTYPE.NAVER_SAVE,
        GET_TYPE: MSGTYPE.NAVER_GET,
        READY_TYPE: MSGTYPE.NAVER_READY,
        URL: "https://nid.naver.com/internalToken/view/tokenList/pc/ko",
        EMPTY_MSG:
            "데이터가 없습니다. <a href='https://nid.naver.com/nidlogin.login' target='_blank'>네이버 로그인</a>을 해주세요.",
        LOADING_MSG: "네이버 연결 정보를 불러오는 중입니다...",
    },
    KAKAO: {
        BTN: null,
        STORAGE_KEY: STORAGE_KEYS.KAKAO,
        SAVE_TYPE: MSGTYPE.KAKAO_SAVE,
        GET_TYPE: MSGTYPE.KAKAO_GET,
        READY_TYPE: MSGTYPE.KAKAO_READY,
        URL: "https://apps.kakao.com/connected/app/list?service_type=open",
        EMPTY_MSG:
            "데이터가 없습니다. <a href='https://accounts.kakao.com/login/?continue=https%3A%2F%2Faccounts.kakao.com%2Fweblogin%2Faccount#login' target='_blank'>카카오 로그인</a>을 해주세요.",
        LOADING_MSG: "카카오 연결 정보를 불러오는 중입니다...",
    },
} as const; 
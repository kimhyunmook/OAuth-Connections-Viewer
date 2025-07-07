import { OauthType } from "../types/type";

export const MSGTYPE: Record<string, OauthType> = {
  // -------------------------------
  GOOGLE_SAVE: "GOOGLE_SAVE",
  GOOGLE_GET: "GOOGLE_GET",
  GOOGLE_READY: "GOOGLE_READY",
  // -------------------------------
  NAVER_SAVE: "NAVER_SAVE",
  NAVER_GET: "NAVER_GET",
  NAVER_READY: "NAVER_READY",
  // -------------------------------
  KAKAO_SAVE: "KAKAO_SAVE",
  KAKAO_GET: "KAKAO_GET",
  KAKAO_READY: "KAKAO_READY",
  // -------------------------------
  LOGIN_REQUIRED: "LOGIN_REQUIRED",
};

export const STORAGE_KEYS = {
  GOOGLE: "connections",
  NAVER: "naverConnections",
  KAKAO: "kakaoConnections",
};

export const UI_MESSAGES = {
  DEFAULT: "서비스를 선택 또는 검색해주세요",
  NODATA: "데이터가 없습니다.",
  CLEAR_SUCCESS: "스토리지 데이터가 삭제되었습니다!",
  LOGIN_REQUIRED: "로그인이 필요합니다! 로그인 후 다시 시도해주세요.",
  SEARCH_ERROR: "검색 중 오류가 발생했습니다.",
  PLATFORM_ERROR: "플랫폼 정보를 불러오는 중 오류가 발생했습니다.",
  NO_RESULTS: "검색 결과가 없습니다. / No search results found.",
  NO_CONNECTIONS: (platform: string) => `${platform}에 저장된 연결이 없습니다.`,
  LOADING: "검색 중... / Searching...",
  ENTER_TO_SEARCH: "서비스명으로 검색... / Search by service name...",
} as const;

export const PLATFORM_INFO = {
  GOOGLE: {
    NAME: "google",
    DISPLAY_NAME: "Google",
    STORAGE_KEY: "connections",
    COLOR: "#4285f4",
  },
  NAVER: {
    NAME: "naver",
    DISPLAY_NAME: "Naver",
    STORAGE_KEY: "naverConnections",
    COLOR: "#03c75a",
  },
  KAKAO: {
    NAME: "kakao",
    DISPLAY_NAME: "Kakao",
    STORAGE_KEY: "kakaoConnections",
    COLOR: "#fee500",
  },
} as const;

export const SERVICE_CONFIG = {
  GOOGLE: {
    BTN: null,
    STORAGE_KEY: STORAGE_KEYS.GOOGLE,
    SAVE_TYPE: MSGTYPE.GOOGLE_SAVE,
    GET_TYPE: MSGTYPE.GOOGLE_GET,
    READY_TYPE: MSGTYPE.GOOGLE_READY,
    URL: "https://myaccount.google.com/connections",
    EMPTY_MSG: "데이터가 없습니다. 먼저 구글 로그인을 해주세요.",
    LOADING_MSG: "구글 연결 정보를 불러오는 중입니다...",
  },
  NAVER: {
    BTN: null,
    STORAGE_KEY: STORAGE_KEYS.NAVER,
    SAVE_TYPE: MSGTYPE.NAVER_SAVE,
    GET_TYPE: MSGTYPE.NAVER_GET,
    READY_TYPE: MSGTYPE.NAVER_READY,
    URL: "https://nid.naver.com/internalToken/view/tokenList/pc/ko",
    EMPTY_MSG: "데이터가 없습니다. 네이버 로그인을 해주세요.",
    LOADING_MSG: "네이버 연결 정보를 불러오는 중입니다...",
  },
  KAKAO: {
    BTN: null,
    STORAGE_KEY: STORAGE_KEYS.KAKAO,
    SAVE_TYPE: MSGTYPE.KAKAO_SAVE,
    GET_TYPE: MSGTYPE.KAKAO_GET,
    READY_TYPE: MSGTYPE.KAKAO_READY,
    URL: "https://apps.kakao.com/connected/app/list?service_type=open",
    EMPTY_MSG: "데이터가 없습니다. 카카오 로그인 해주세요.",
    LOADING_MSG: "카카오 연결 정보를 불러오는 중입니다...",
  },
} as const;

export const SEARCH_CONFIG = {
  MIN_SEARCH_LENGTH: 2,
  MAX_RESULTS_PER_PLATFORM: 50,
  DEBOUNCE_DELAY: 300,
} as const;

export const CSS_CLASSES = {
  SEARCH: {
    CONTAINER: "search-container",
    INPUT: "search-input",
    BUTTON: "search-btn",
    RESULTS: "search-results",
    HIGHLIGHT: "search-highlight",
    NO_RESULTS: "no-results",
    PLATFORM_HEADER: "platform-header",
    CLICKABLE: "clickable",
  },
  LIST: {
    ITEM: "list",
    DEFAULT: "dft",
  },
} as const;

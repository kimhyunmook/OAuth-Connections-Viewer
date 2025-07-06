import { ServiceBackgroundConfig } from "../types/type";
import { MSGTYPE, STORAGE_KEYS } from "../constants";

export const SERVICES_BACKGROUND: Record<string, ServiceBackgroundConfig> = {
  google: {
    key: STORAGE_KEYS.GOOGLE,
    saveType: MSGTYPE.GOOGLE_SAVE,
    getType: MSGTYPE.GOOGLE_GET,
    readyType: MSGTYPE.GOOGLE_READY,
    latest: [],
  },
  naver: {
    key: STORAGE_KEYS.NAVER,
    saveType: MSGTYPE.NAVER_SAVE,
    getType: MSGTYPE.NAVER_GET,
    readyType: MSGTYPE.NAVER_READY,
    latest: [],
  },
  kakao: {
    key: STORAGE_KEYS.KAKAO,
    saveType: MSGTYPE.KAKAO_SAVE,
    getType: MSGTYPE.KAKAO_GET,
    readyType: MSGTYPE.KAKAO_READY,
    latest: [],
  },
};

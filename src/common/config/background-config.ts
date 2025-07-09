import { ServiceBackgroundConfig } from "../../types/type";
import { MSGTYPE, STORAGE_KEYS, PLATFORM_INFO } from "../constants";

export const SERVICES_BACKGROUND: Record<string, ServiceBackgroundConfig> = {
  google: {
    key: STORAGE_KEYS.GOOGLE,
    saveType: MSGTYPE.GOOGLE_SAVE,
    getType: MSGTYPE.GOOGLE_GET,
    readyType: MSGTYPE.GOOGLE_READY,
    latest: [],
    displayName: PLATFORM_INFO.GOOGLE.DISPLAY_NAME,
    iconPath: "./assets/google-icon.svg",
    backgroundColor: "#fff",
  },
  naver: {
    key: STORAGE_KEYS.NAVER,
    saveType: MSGTYPE.NAVER_SAVE,
    getType: MSGTYPE.NAVER_GET,
    readyType: MSGTYPE.NAVER_READY,
    latest: [],
    displayName: PLATFORM_INFO.NAVER.DISPLAY_NAME,
    iconPath: "./assets/naver-icon.svg",
    backgroundColor: "#03c75a",
  },
  kakao: {
    key: STORAGE_KEYS.KAKAO,
    saveType: MSGTYPE.KAKAO_SAVE,
    getType: MSGTYPE.KAKAO_GET,
    readyType: MSGTYPE.KAKAO_READY,
    latest: [],
    displayName: PLATFORM_INFO.KAKAO.DISPLAY_NAME,
    iconPath: "./assets/kakao-icon.svg",
    backgroundColor: "#fee500",
  },
};

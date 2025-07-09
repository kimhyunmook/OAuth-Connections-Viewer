import { OauthType } from "../../types/type";

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
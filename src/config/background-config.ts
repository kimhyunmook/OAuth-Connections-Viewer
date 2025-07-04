import { ServiceBackgroundConfig } from "../types/type";

export const SERVICES_BACKGROUND: Record<string, ServiceBackgroundConfig> = {
    google: {
        key: "connections",
        saveType: "GOOGLE_SAVE",
        getType: "GOOGLE_GET",
        readyType: "GOOGLE_READY",
        latest: [],
    },
    naver: {
        key: "naverConnections",
        saveType: "NAVER_SAVE",
        getType: "NAVER_GET",
        readyType: "NAVER_READY",
        latest: [],
    },
    kakao: {
        key: "kakaoConnections",
        saveType: "KAKAO_SAVE",
        getType: "KAKAO_GET",
        readyType: "KAKAO_READY",
        latest: [],
    },
};
import { AllConnections, PlatformType } from "../types/type";
import { STORAGE_KEYS } from "../constants";

/**
 * Chrome Storage에서 모든 연결 데이터 가져오기
 */
export async function getAllConnections(): Promise<AllConnections> {
    return new Promise((resolve) => {
        chrome.storage.local.get(
            [STORAGE_KEYS.GOOGLE, STORAGE_KEYS.NAVER, STORAGE_KEYS.KAKAO],
            (result) => {
                resolve({
                    google: result[STORAGE_KEYS.GOOGLE] || [],
                    naver: result[STORAGE_KEYS.NAVER] || [],
                    kakao: result[STORAGE_KEYS.KAKAO] || [],
                });
            }
        );
    });
}

/**
 * 특정 플랫폼의 연결 데이터 가져오기
 */
export async function getPlatformConnections(platform: PlatformType): Promise<any[]> {
    const storageKey = STORAGE_KEYS[platform.toUpperCase() as keyof typeof STORAGE_KEYS];

    return new Promise((resolve) => {
        chrome.storage.local.get([storageKey], (result) => {
            resolve(result[storageKey] || []);
        });
    });
}

/**
 * 스토리지 데이터 삭제
 */
export function clearStorage(): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.clear(() => {
            resolve();
        });
    });
} 
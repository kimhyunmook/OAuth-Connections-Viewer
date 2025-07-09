import { AllConnections, PlatformType, ConnectionEntity, ConnectionType } from "../../types/type";
import { STORAGE_KEYS } from "../../common/constants";

export class StorageService {
    private readonly TIMEOUT_MS = 10000; // 10초 타임아웃

    /**
     * Chrome Storage에서 모든 연결 데이터 가져오기
     */
    public async getAllConnections(): Promise<AllConnections> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Storage access timeout'));
            }, this.TIMEOUT_MS);

            chrome.storage.local.get(
                [STORAGE_KEYS.GOOGLE, STORAGE_KEYS.NAVER, STORAGE_KEYS.KAKAO],
                (result) => {
                    clearTimeout(timeout);

                    if (chrome.runtime.lastError) {
                        reject(new Error(`Storage error: ${chrome.runtime.lastError.message}`));
                        return;
                    }

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
     * 스토리지 데이터 삭제
     */
    public clearStorage(): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Storage clear timeout'));
            }, this.TIMEOUT_MS);

            chrome.storage.local.clear(() => {
                clearTimeout(timeout);

                if (chrome.runtime.lastError) {
                    reject(new Error(`Storage clear error: ${chrome.runtime.lastError.message}`));
                    return;
                }

                resolve();
            });
        });
    }

    /**
     * 특정 플랫폼의 연결 데이터 가져오기
     */
    public async getPlatformConnections(platform: PlatformType): Promise<ConnectionType[]> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(`Platform storage access timeout: ${platform}`));
            }, this.TIMEOUT_MS);

            const storageKey = STORAGE_KEYS[platform.toUpperCase() as keyof typeof STORAGE_KEYS];

            chrome.storage.local.get([storageKey], (result) => {
                clearTimeout(timeout);

                if (chrome.runtime.lastError) {
                    reject(new Error(`Platform storage error: ${chrome.runtime.lastError.message}`));
                    return;
                }

                resolve(result[storageKey] || []);
            });
        });
    }

    /**
     * 특정 플랫폼의 연결 데이터 저장
     */
    public async savePlatformConnections(platform: PlatformType, connections: any[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(`Platform storage save timeout: ${platform}`));
            }, this.TIMEOUT_MS);

            const storageKey = STORAGE_KEYS[platform.toUpperCase() as keyof typeof STORAGE_KEYS];
            const storageData: { [key: string]: any[] } = {};
            storageData[storageKey] = connections;

            chrome.storage.local.set(storageData, () => {
                clearTimeout(timeout);

                if (chrome.runtime.lastError) {
                    reject(new Error(`Platform storage save error: ${chrome.runtime.lastError.message}`));
                    return;
                }

                resolve();
            });
        });
    }

    /**
     * 모든 연결 데이터를 엔티티 형태로 가져오기 (플랫폼 정보 포함)
     */
    public async getAllConnectionEntities(): Promise<ConnectionEntity[]> {
        const allConnections = await this.getAllConnections();
        const entities: ConnectionEntity[] = [];

        // 각 플랫폼별로 엔티티 생성
        Object.entries(allConnections).forEach(([platform, connections]) => {
            const platformType = platform as PlatformType;
            const storageKey = STORAGE_KEYS[platform.toUpperCase() as keyof typeof STORAGE_KEYS];

            (connections as ConnectionType[]).forEach((connection: ConnectionType) => {
                if (connection.name) {
                    entities.push({
                        ...connection,
                        platform: platformType,
                        storageKey: storageKey
                    });
                }
            });
        });

        return entities;
    }

    /**
     * 특정 플랫폼의 연결 데이터를 엔티티 형태로 가져오기
     */
    public async getPlatformConnectionEntities(platform: PlatformType): Promise<ConnectionEntity[]> {
        const connections = await this.getPlatformConnections(platform);
        const storageKey = STORAGE_KEYS[platform.toUpperCase() as keyof typeof STORAGE_KEYS];

        return connections
            .filter((connection: ConnectionType) => connection.name)
            .map((connection: ConnectionType) => ({
                ...connection,
                platform: platform,
                storageKey: storageKey
            }));
    }
}


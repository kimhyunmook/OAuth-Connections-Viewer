import { StorageService } from "../services/storage-service";
import { AllConnections } from "../../types/type";

export class StorageController {
    private storageService: StorageService;

    constructor() {
        this.storageService = new StorageService();
    }

    /**
     * 모든 연결 데이터 가져오기
     */
    public async getAllConnections(): Promise<AllConnections> {
        return this.storageService.getAllConnections();
    }

    /**
     * 스토리지 데이터 삭제
     */
    public clearStorage(): Promise<void> {
        return this.storageService.clearStorage();
    }

    /**
     * StorageService 인스턴스 반환
     */
    public getStorageService(): StorageService {
        return this.storageService;
    }
}
// // 기존 함수들을 유지하여 호환성 보장
// export async function getAllConnections(): Promise<AllConnections> {
//     return storageController.getAllConnections();
// }

// export function clearStorage(): Promise<void> {
//     return storageController.clearStorage();
// } 

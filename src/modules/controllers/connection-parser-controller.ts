// 싱글톤 인스턴스 생성
// export const connectionParserService = new ConnectionParserService();

// // 기존 함수들을 유지하여 호환성 보장
// export function isLoginPage(): boolean {
//   return connectionParserService.isLoginPage();
// }

// export function parseConnection(
//   parseConnectionType: ParseConnectionType,
//   callback?: () => void,
//   retryCount: number = 0,
//   maxRetries: number = 1
// ) {
//   return connectionParserService.parseConnection(parseConnectionType, callback, retryCount, maxRetries);
// }

// export function sendMessageData(
//   type: OauthType,
//   dataFunction: () => any,
//   delay?: number,
//   retryCount: number = 0,
//   maxRetries: number = 1
// ) {
//   return connectionParserService.sendMessageData(type, dataFunction, delay, retryCount, maxRetries);
// }
import { ConnectionParserService } from "../services/connection-parser-service";
import { ParseConnectionType, OauthType } from "../../types/type";


export default class ConnectionParserController {

    private connectionParserService: ConnectionParserService

    constructor() {
        this.connectionParserService = new ConnectionParserService()
    }

    public isLoginPage(): boolean {
        return this.connectionParserService.isLoginPage();
    }

    public parseConnection(
        parseConnectionType: ParseConnectionType,
        callback?: () => void,
        retryCount: number = 0,
        maxRetries: number = 1
    ) {
        return this.connectionParserService.parseConnection(parseConnectionType, callback, retryCount, maxRetries);
    }

    public sendMessageData(
        type: OauthType,
        dataFunction: () => any,
        delay?: number,
        retryCount: number = 0,
        maxRetries: number = 1
    ) {
        return this.connectionParserService.sendMessageData(type, dataFunction, delay, retryCount, maxRetries);
    }
}
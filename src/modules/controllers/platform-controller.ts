import { PlatformParserService } from "../services/platform-parsers-service";

export default class PlatformParserController {
    private platformParserService: PlatformParserService

    constructor() {
        this.platformParserService = new PlatformParserService()
    }

    public parseGoogleConnections() {
        return this.platformParserService.parseGoogleConnections();
    }
    public parseNaverConnections() {
        return this.platformParserService.parseNaverConnections();
    }
    public parseKakaoConnections() {
        return this.platformParserService.parseKakaoConnections();
    }
}
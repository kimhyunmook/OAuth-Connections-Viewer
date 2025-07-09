import { parseConnection, isLoginPage } from "./connection-parser-service";
import { PlatformType, PlatformConfig } from "../../types/type";
import { PLATFORM_CONFIGS } from "../../common/config/platform-config";

export class PlatformParserService {
  private readonly MAX_RETRY_COUNT = 1;

  /**
   * 플랫폼별 연결 정보 파싱 (공통 로직)
   */
  private parsePlatformConnections(platform: PlatformType): any[] {
    const config = PLATFORM_CONFIGS[platform];

    // URL 검증
    if (!window.location.href.includes(config.url)) {
      return [];
    }

    // 로그인 페이지 검증
    if (isLoginPage()) {
      this.sendLoginRequiredMessage(config.service);
      return [];
    }

    // 파싱 실행 (재시도 로직 포함)
    return parseConnection(
      config.selectors,
      undefined,
      0,
      this.MAX_RETRY_COUNT
    );
  }

  /**
   * 로그인 필요 메시지 전송
   */
  private sendLoginRequiredMessage(service: string): void {
    chrome.runtime.sendMessage({
      type: "LOGIN_REQUIRED",
      service,
    });
  }

  /**
   * 플랫폼연결 정보 파싱
   */
  public parseGoogleConnections(): any[] {
    return this.parsePlatformConnections('google');
  }


  public parseNaverConnections(): any[] {
    return this.parsePlatformConnections('naver');
  }


  public parseKakaoConnections(): any[] {
    return this.parsePlatformConnections('kakao');
  }

  /**
   * 모든 플랫폼의 연결 정보 파싱
   */
  public parseAllPlatformConnections(): Record<PlatformType, any[]> {
    const results = {
      google: this.parseGoogleConnections(),
      naver: this.parseNaverConnections(),
      kakao: this.parseKakaoConnections(),
    };

    return results;
  }

  /**
   * 특정 플랫폼의 연결 정보 파싱
   */
  public parseConnectionsByPlatform(platform: PlatformType): any[] {
    return this.parsePlatformConnections(platform);
  }

  /**
   * 현재 페이지에서 지원하는 플랫폼 확인
   */
  public getSupportedPlatform(): PlatformType | null {
    for (const [platform, config] of Object.entries(PLATFORM_CONFIGS)) {
      if (window.location.href.includes(config.url)) {
        return platform as PlatformType;
      }
    }
    return null;
  }

  /**
   * 플랫폼 설정 가져오기
   */
  public getPlatformConfig(platform: PlatformType): PlatformConfig | null {
    return PLATFORM_CONFIGS[platform] || null;
  }
}

// 싱글톤 인스턴스 생성
export const platformParserService = new PlatformParserService();

// 기존 함수들을 유지하여 호환성 보장
export function parseGoogleConnections() {
  return platformParserService.parseGoogleConnections();
}

export function parseNaverConnections() {
  return platformParserService.parseNaverConnections();
}

export function parseKakaoConnections() {
  return platformParserService.parseKakaoConnections();
}



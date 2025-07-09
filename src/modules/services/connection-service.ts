import { ConnectionType } from "../../types/type";

export class ConnectionService {
    /**
     * Google 연결 정보 파싱
     */
    public parseGoogleConnections(): ConnectionType[] {
        const connections: ConnectionType[] = [];

        // Google 계정 설정 페이지에서 연결된 앱들 파싱
        const appElements = document.querySelectorAll('[data-testid="connected-app"]');

        appElements.forEach((element) => {
            const nameElement = element.querySelector('[data-testid="app-name"]');
            const iconElement = element.querySelector('img');

            if (nameElement && iconElement) {
                const name = nameElement.textContent?.trim() || '';
                const image = (iconElement as HTMLImageElement).src || '';

                if (name && image) {
                    connections.push({
                        name,
                        image
                    });
                }
            }
        });

        return connections;
    }

    /**
     * Naver 연결 정보 파싱
     */
    public parseNaverConnections(): ConnectionType[] {
        const connections: ConnectionType[] = [];

        // Naver 계정 설정 페이지에서 연결된 앱들 파싱
        const appElements = document.querySelectorAll('.app_item');

        appElements.forEach((element) => {
            const nameElement = element.querySelector('.app_name');
            const iconElement = element.querySelector('.app_icon img');

            if (nameElement && iconElement) {
                const name = nameElement.textContent?.trim() || '';
                const image = (iconElement as HTMLImageElement).src || '';

                if (name && image) {
                    connections.push({
                        name,
                        image
                    });
                }
            }
        });

        return connections;
    }

    /**
     * Kakao 연결 정보 파싱
     */
    public parseKakaoConnections(): ConnectionType[] {
        const connections: ConnectionType[] = [];

        // Kakao 계정 설정 페이지에서 연결된 앱들 파싱
        const appElements = document.querySelectorAll('.connected_app');

        appElements.forEach((element) => {
            const nameElement = element.querySelector('.app_title');
            const iconElement = element.querySelector('.app_icon img');

            if (nameElement && iconElement) {
                const name = nameElement.textContent?.trim() || '';
                const image = (iconElement as HTMLImageElement).src || '';

                if (name && image) {
                    connections.push({
                        name,
                        image
                    });
                }
            }
        });

        return connections;
    }

    /**
     * 현재 페이지의 플랫폼에 따라 적절한 파서 호출
     */
    public parseConnectionsByPlatform(): ConnectionType[] {
        const hostname = window.location.hostname;

        if (hostname.includes('google.com')) {
            return this.parseGoogleConnections();
        } else if (hostname.includes('naver.com')) {
            return this.parseNaverConnections();
        } else if (hostname.includes('kakao.com')) {
            return this.parseKakaoConnections();
        }

        return [];
    }
}

// 싱글톤 인스턴스 생성
export const connectionService = new ConnectionService(); 
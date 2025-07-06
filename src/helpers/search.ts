import { ConnectionType, SearchResult, AllConnections } from "../types/type";

// 모든 플랫폼의 연결 데이터를 가져오는 함수
export async function getAllConnections(): Promise<AllConnections> {
    return new Promise((resolve) => {
        chrome.storage.local.get(['connections', 'naverConnections', 'kakaoConnections'], (result) => {
            resolve({
                google: result.connections || [],
                naver: result.naverConnections || [],
                kakao: result.kakaoConnections || []
            });
        });
    });
}

// 검색 함수
export function searchConnections(
    connections: AllConnections,
    searchTerm: string
): SearchResult[] {
    const results: SearchResult[] = [];
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    if (!normalizedSearchTerm) {
        return [];
    }

    // 각 플랫폼별로 검색
    Object.entries(connections).forEach(([platform, platformConnections]) => {
        const filteredConnections = platformConnections.filter((connection: ConnectionType) => {
            if (!connection.name) return false;
            return connection.name.toLowerCase().includes(normalizedSearchTerm);
        });

        if (filteredConnections.length > 0) {
            results.push({
                connections: filteredConnections,
                platform: platform
            });
        }
    });

    return results;
}

// 검색 결과를 HTML로 렌더링하는 함수
export function renderSearchResults(
    results: SearchResult[],
    container: HTMLElement,
    searchTerm: string
): void {
    if (results.length === 0) {
        container.innerHTML = '<li class="list no-results">검색 결과가 없습니다. / No search results found.</li>';
        return;
    }

    let html = '';

    results.forEach(result => {
        const platformName = getPlatformDisplayName(result.platform);
        html += `<li class="list platform-header">${platformName}</li>`;

        result.connections.forEach(connection => {
            const highlightedName = highlightSearchTerm(connection.name || '', searchTerm);
            html += `
        <li class="list">
          ${connection.image ? `<img src="${connection.image}" alt="${connection.name}" />` : ''}
          <p>${highlightedName}</p>
        </li>
      `;
        });
    });

    container.innerHTML = html;
}

// 플랫폼 이름을 표시용으로 변환
function getPlatformDisplayName(platform: string): string {
    const platformNames: Record<string, string> = {
        google: 'Google',
        naver: 'Naver',
        kakao: 'Kakao'
    };
    return platformNames[platform] || platform;
}

// 검색어를 하이라이트하는 함수
function highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// 검색 결과를 플랫폼별로 그룹화하는 함수
export function groupResultsByPlatform(results: SearchResult[]): Record<string, ConnectionType[]> {
    const grouped: Record<string, ConnectionType[]> = {};

    results.forEach(result => {
        if (!grouped[result.platform]) {
            grouped[result.platform] = [];
        }
        grouped[result.platform].push(...result.connections);
    });

    return grouped;
} 
import { SearchResult, PlatformType, AllConnections } from "../types/type";
import { PLATFORM_INFO, UI_MESSAGES, CSS_CLASSES } from "../constants";

/**
 * 검색 결과 렌더링
 */
export function renderSearchResults(
    results: SearchResult[],
    container: HTMLElement,
    searchTerm: string
): void {
    if (results.length === 0) {
        container.innerHTML = `<li class="list no-results">${UI_MESSAGES.NO_RESULTS}</li>`;
        return;
    }

    // 플랫폼별로 그룹화
    const groupedResults = groupResultsByPlatform(results);

    let html = '';

    Object.entries(groupedResults).forEach(([platform, platformResults]) => {
        const platformInfo = PLATFORM_INFO[platform.toUpperCase() as keyof typeof PLATFORM_INFO];

        if (platformInfo && platformResults.length > 0) {
            // 플랫폼 헤더 (클릭 불가능)
            html += `
        <li class="list platform-header" data-platform="${platform}">
          <div style="color: ${platformInfo.COLOR}; font-weight: bold;">
            ${platformInfo.DISPLAY_NAME} (${platformResults.length})
          </div>
        </li>
      `;

            // 플랫폼 결과들 (하이라이트 제거)
            platformResults.forEach((result) => {
                html += `
          <li class="list">
            <img src="${result.image || ''}" alt="${result.name}">
            <span class="service-name">${result.name || 'Unknown'}</span>
          </li>
        `;
            });
        }
    });

    container.innerHTML = html;
}

/**
 * 플랫폼별 연결 렌더링
 */
export function renderPlatformConnections(
    allConnections: AllConnections,
    platform: PlatformType,
    container: HTMLElement
): void {
    const connections = allConnections[platform] || [];

    if (connections.length === 0) {
        const platformInfo = PLATFORM_INFO[platform.toUpperCase() as keyof typeof PLATFORM_INFO];
        container.innerHTML = `<li class="list no-results">${UI_MESSAGES.NO_CONNECTIONS(platformInfo?.DISPLAY_NAME || platform)}</li>`;
        return;
    }

    let html = '';
    connections.forEach((connection) => {
        html += `
      <li class="list">
        <img src="${connection.image || ''}" alt="${connection.name}">
        <span class="service-name">${connection.name || 'Unknown'}</span>
      </li>
    `;
    });

    container.innerHTML = html;
}

/**
 * 결과를 플랫폼별로 그룹화
 */
function groupResultsByPlatform(results: SearchResult[]): Record<string, SearchResult[]> {
    return results.reduce((groups, result) => {
        const platform = result.platform;
        if (!groups[platform]) {
            groups[platform] = [];
        }
        groups[platform].push(result);
        return groups;
    }, {} as Record<string, SearchResult[]>);
} 
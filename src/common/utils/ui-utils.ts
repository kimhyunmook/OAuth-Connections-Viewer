import { SearchResult } from "../../types/type";
import { PLATFORM_INFO, UI_MESSAGES } from "../constants";

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
            html += `
                <li class="list platform-header" data-platform="${platform}">
                    <p>
                        ${platformInfo.DISPLAY_NAME} (${platformResults.length})
                    </p>
                </li>
            `;

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
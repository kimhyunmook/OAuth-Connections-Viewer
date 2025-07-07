import { AllConnections, PlatformType, SearchResult } from "../types/type";
import { SEARCH_CONFIG } from "../constants";

/**
 * 검색어 유효성 검사
 */
export function isValidSearchTerm(searchTerm: string): boolean {
    return searchTerm.trim().length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH;
}

/**
 * 연결 데이터에서 검색 실행
 */
export function searchConnections(
    allConnections: AllConnections,
    searchTerm: string
): SearchResult[] {
    const results: SearchResult[] = [];
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    // 각 플랫폼별로 검색
    Object.entries(allConnections).forEach(([platform, connections]) => {
        const platformResults = connections
            .filter((connection: any) => {
                const name = connection.name?.toLowerCase() || '';
                return name.includes(normalizedSearchTerm);
            })
            .slice(0, SEARCH_CONFIG.MAX_RESULTS_PER_PLATFORM)
            .map((connection: any) => ({
                ...connection,
                platform: platform as PlatformType,
            }));

        if (platformResults.length > 0) {
            results.push(...platformResults);
        }
    });

    return results;
}

/**
 * 플랫폼별 연결 데이터 필터링
 */
export function filterConnectionsByPlatform(
    allConnections: AllConnections,
    platform: PlatformType
): any[] {
    return allConnections[platform] || [];
} 
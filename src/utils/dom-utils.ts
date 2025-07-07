/**
 * DOM 요소를 안전하게 가져오기
 */
export function getElementById<T extends HTMLElement>(id: string): T | null {
    return typeof document !== 'undefined' ? document.getElementById(id) as T : null;
}

/**
 * DOM 요소를 안전하게 쿼리하기
 */
export function querySelector<T extends Element>(selector: string): T | null {
    return typeof document !== 'undefined' ? document.querySelector(selector) as T : null;
}

/**
 * DOM 요소들을 안전하게 쿼리하기
 */
export function querySelectorAll<T extends Element>(selector: string): NodeListOf<T> | null {
    return typeof document !== 'undefined' ? document.querySelectorAll(selector) as NodeListOf<T> : null;
}

/**
 * 텍스트 하이라이트 처리
 */
export function highlightText(text: string, searchTerm: string): string {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

/**
 * 플랫폼 버튼 요소들 가져오기
 */
export function getPlatformButtons() {
    return {
        google: getElementById<HTMLButtonElement>('google-load'),
        naver: getElementById<HTMLButtonElement>('naver-load'),
        kakao: getElementById<HTMLButtonElement>('kakao-load'),
    };
} 
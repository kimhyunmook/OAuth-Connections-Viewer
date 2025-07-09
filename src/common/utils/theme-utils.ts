export type ThemeType = 'dark' | 'light' | 'system';

/**
 * 현재 테마 가져오기 (항상 시스템 테마 반환)
 */
export function getCurrentTheme(): ThemeType {
    return 'system';
}

/**
 * 테마 적용 (시스템 테마만 지원)
 */
export function applyTheme(theme: ThemeType): void {
    const body = document.body;

    // 기존 테마 속성 제거
    body.removeAttribute('data-theme');

    let actualTheme: 'dark' | 'light';

    if (theme === 'system') {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
        actualTheme = theme;
    }

    // 새 테마 속성 추가
    body.setAttribute('data-theme', actualTheme);
}

/**
 * 시스템 테마 변경 감지
 */
export function setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
        applyTheme('system');
    });
} 
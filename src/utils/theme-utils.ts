import { getElementById } from "./dom-utils";

export type ThemeType = 'dark' | 'light' | 'system';

/**
 * 현재 테마 가져오기
 */
export function getCurrentTheme(): ThemeType {
    return (localStorage.getItem('theme') as ThemeType) || 'system';
}

/**
 * 테마 설정
 */
export function setTheme(theme: ThemeType): void {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
}

/**
 * 테마 적용
 */
export function applyTheme(theme: ThemeType): void {
    const body = document.body;
    const themeToggle = getElementById<HTMLButtonElement>('theme-toggle');

    // 기존 테마 클래스 제거
    body.classList.remove('dark-theme', 'light-theme');

    let actualTheme: 'dark' | 'light';

    if (theme === 'system') {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
        actualTheme = theme;
    }

    // 새 테마 클래스 추가
    body.classList.add(`${actualTheme}-theme`);

    // 테마 토글 버튼 아이콘 업데이트
    if (themeToggle) {
        updateThemeToggleIcon(themeToggle, theme);
    }
}

/**
 * 테마 토글 아이콘 업데이트
 */
function updateThemeToggleIcon(button: HTMLButtonElement, theme: ThemeType): void {
    const iconMap = {
        dark: 'fa-sun',
        light: 'fa-moon',
        system: 'fa-desktop'
    };

    // 기존 아이콘 제거
    button.innerHTML = '';

    // 새 아이콘 추가
    const icon = document.createElement('i');
    icon.className = `fas ${iconMap[theme]}`;
    button.appendChild(icon);
}

/**
 * 다음 테마로 순환
 */
export function cycleTheme(): ThemeType {
    const themes: ThemeType[] = ['dark', 'light', 'system'];
    const currentTheme = getCurrentTheme();
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];

    setTheme(nextTheme);
    return nextTheme;
}

/**
 * 시스템 테마 변경 감지
 */
export function setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
        const currentTheme = getCurrentTheme();
        if (currentTheme === 'system') {
            applyTheme('system');
        }
    });
} 
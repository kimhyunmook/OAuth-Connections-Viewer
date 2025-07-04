export default function initTheme() {
    const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;
    const body = document.body;

    // 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // 시스템 다크모드 감지
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    }

    // 테마 토글 이벤트
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // 테마 아이콘 업데이트 함수
    function updateThemeIcon(theme: string) {
        if (theme === 'dark') {
            themeToggle.textContent = '☀️';
            themeToggle.title = '라이트 모드로 변경';
        } else {
            themeToggle.textContent = '🌙';
            themeToggle.title = '다크 모드로 변경';
        }
    }

    // 시스템 테마 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

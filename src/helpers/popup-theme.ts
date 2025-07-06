export default function initTheme() {
    const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;
    const body = document.body;

    // 테마 버튼이 없으면 함수 종료
    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
    }

    // 크롬 설정에서 테마 정보 가져오기
    function getChromeTheme(): 'light' | 'dark' {
        try {
            // 크롬의 시스템 테마 감지
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return isDarkMode ? 'dark' : 'light';
        } catch (error) {
            console.log('Chrome theme detection failed, using system preference');
            // 기본 시스템 테마 감지
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
    }

    // 테마 적용 함수
    function applyTheme(theme: 'light' | 'dark' | 'system') {
        let actualTheme: 'light' | 'dark';

        if (theme === 'system') {
            actualTheme = getChromeTheme();
        } else {
            actualTheme = theme;
        }

        body.setAttribute('data-theme', actualTheme);
        updateThemeIcon(actualTheme);
        return actualTheme;
    }

    // 테마 아이콘 업데이트 함수
    function updateThemeIcon(theme: string) {
        const iconElement = themeToggle.querySelector('i');
        if (iconElement) {
            if (theme === 'dark') {
                iconElement.className = 'fas fa-sun';
                themeToggle.title = '라이트 모드로 변경 / Switch to Light Mode';
            } else {
                iconElement.className = 'fas fa-moon';
                themeToggle.title = '다크 모드로 변경 / Switch to Dark Mode';
            }
        }
    }

    // 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;

    if (savedTheme) {
        // 사용자가 직접 설정한 테마가 있으면 그것을 사용
        applyTheme(savedTheme);
    } else {
        // 저장된 테마가 없으면 크롬 설정에 따라 자동 설정
        const chromeTheme = getChromeTheme();
        applyTheme(chromeTheme);
        // 시스템 테마로 설정했음을 저장
        localStorage.setItem('theme', 'system');
    }

    // 테마 토글 이벤트
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        let newTheme: 'light' | 'dark' | 'system';

        if (currentTheme === 'dark') {
            newTheme = 'light';
        } else if (currentTheme === 'light') {
            // 라이트 모드에서 클릭하면 시스템 테마로 변경
            newTheme = 'system';
        } else {
            // 시스템 테마에서 클릭하면 다크 모드로 변경
            newTheme = 'dark';
        }

        const actualTheme = applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        // 시스템 테마로 설정된 경우 실제 테마도 함께 저장
        if (newTheme === 'system') {
            localStorage.setItem('actual-theme', actualTheme);
        }
    });

    // 시스템 테마 변경 감지 (크롬 설정 변경 시)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;

        // 시스템 테마로 설정되어 있거나 저장된 테마가 없는 경우에만 자동 변경
        if (savedTheme === 'system' || !savedTheme) {
            const newTheme = e.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);

            // 시스템 테마로 설정되어 있으면 실제 테마도 업데이트
            if (savedTheme === 'system') {
                localStorage.setItem('actual-theme', newTheme);
            }
        }
    });

    // 크롬 확장 프로그램이 시작될 때 테마 동기화
    function syncThemeWithChrome() {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;

        if (savedTheme === 'system' || !savedTheme) {
            const chromeTheme = getChromeTheme();
            const currentTheme = body.getAttribute('data-theme');

            if (currentTheme !== chromeTheme) {
                body.setAttribute('data-theme', chromeTheme);
                updateThemeIcon(chromeTheme);

                if (savedTheme === 'system') {
                    localStorage.setItem('actual-theme', chromeTheme);
                }
            }
        }
    }

    // 초기 동기화
    syncThemeWithChrome();

    // 주기적으로 테마 동기화 (크롬 설정 변경 감지)
    setInterval(syncThemeWithChrome, 5000); // 5초마다 체크
}

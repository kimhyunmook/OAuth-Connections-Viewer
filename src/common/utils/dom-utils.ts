import { SERVICES_BACKGROUND } from "../config/background-config";

interface CreateElementProps {
    element: string
    className?: string
    id?: string
}

export function createElement({
    element,
    className,
    id
}: CreateElementProps) {
    const el = document.createElement(element)
    el.className = className ? className : ''
    el.id = id ? id : ''
    return el
}

export function getElementById<T extends HTMLElement>(id: string): T | null {
    return typeof document !== 'undefined' ? document.getElementById(id) as T : null;
}

export function getPlatformButtons() {
    const container = getElementById<HTMLElement>('platform-buttons');
    if (!container) {
        console.error('Platform buttons container not found');
        return {};
    }

    const buttons: Record<string, HTMLAnchorElement> = {};

    // SERVICES_BACKGROUND를 기반으로 동적 생성
    Object.entries(SERVICES_BACKGROUND).forEach(([platform, config]) => {
        const button = document.createElement('a');
        button.id = `${platform}-load`;
        button.href = '#';
        button.className = 'platform-button';
        button.style.backgroundColor = config.backgroundColor;

        const img = document.createElement('img');
        img.src = config.iconPath;
        img.alt = `${config.displayName}-oauth`;

        button.appendChild(img);
        container.appendChild(button);

        buttons[platform] = button;
    });

    return buttons;
}


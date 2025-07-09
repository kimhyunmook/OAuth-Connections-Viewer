import { ServiceBackgroundConfig, MsgType } from "../../types/type";

export class BackgroundService {
    private readonly TIMEOUT_MS = 10000; // 10초 타임아웃

    public handleSave(
        service: ServiceBackgroundConfig,
        msg: MsgType,
        sender: chrome.runtime.MessageSender
    ) {
        try {
            if (msg.payload && msg.payload.length > 0) {
                service.latest = msg.payload;

                // Storage 저장에 에러 처리 추가
                chrome.storage.local.set({ [service.key]: service.latest }, () => {
                    if (chrome.runtime.lastError) {
                        console.error(`Storage save error for ${service.key}:`, chrome.runtime.lastError.message);
                    }
                });
            }

            if (sender.tab && sender.tab.id) {
                // READY 메시지 전송
                chrome.runtime.sendMessage({
                    type: service.readyType,
                    tabId: sender.tab.id,
                }, () => {
                    if (chrome.runtime.lastError) {
                        // console.error('Failed to send ready message:', chrome.runtime.lastError.message);
                        return
                    }
                });

                // 탭 닫기
                this.closeTab(sender.tab.id);
                return true
            }
        } catch (error) {
            console.error('Error in handleSave:', error);
        }
    }

    public handleGet(
        service: ServiceBackgroundConfig,
        sendResponse: (res: any) => void
    ) {
        const timeout = setTimeout(() => {
            console.error(`Storage get timeout for ${service.key}`);
            sendResponse({ connections: [], error: 'timeout' });
        }, this.TIMEOUT_MS);

        chrome.storage.local.get(service.key).then((store) => {
            clearTimeout(timeout);

            if (chrome.runtime.lastError) {
                console.error(`Storage get error for ${service.key}:`, chrome.runtime.lastError);
                sendResponse({ connections: [], error: chrome.runtime.lastError.message });
                return;
            }

            sendResponse({ connections: store[service.key] || [] });
        }).catch((error) => {
            clearTimeout(timeout);
            console.error(`Storage get promise error for ${service.key}:`, error);
            sendResponse({ connections: [], error: error.message });
        });
    }

    public closeTab(tabId?: number) {
        if (tabId) {
            try {
                chrome.tabs && chrome.tabs.remove && chrome.tabs.remove(tabId, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Failed to close tab:', chrome.runtime.lastError.message);
                    }
                });
            } catch (error) {
                console.error('Error closing tab:', error);
            }
        }
    }
}


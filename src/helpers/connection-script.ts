import { OauthType, ParseConnectionType } from "../types/type";

export function isLogin(): boolean {
  if (window.location.href.includes('login')) {
    return true
  }
  return false
}

export function parseConnection(
  { parentDom, listDom, imageDom, nameDom }: ParseConnectionType,
  cb?: () => void
) {
  try {
    const parentEl = document.querySelector(parentDom);
    if (!parentEl) {
      return [];
    }

    const items = Array.from(parentEl.querySelectorAll(listDom)).map((list) => {
      const image = (list.querySelector(imageDom) as HTMLImageElement)?.src;
      const name = list.querySelector(nameDom)?.textContent || undefined;
      return { image, name };
    });

    if (cb) cb();
    return items;
  } catch (error) {
    console.warn(`Failed to parse connections for ${parentDom}:`, error);
    return [];
  }
}

export function sendMessageData(
  type: OauthType,
  dataFnc: () => any,
  time?: number
) {
  setTimeout(
    () => {
      try {
        const data = dataFnc();
        if (data && data.length > 0) {
          chrome.runtime.sendMessage({
            type,
            payload: data,
          });
        }
      } catch (error) {
        console.warn(`Failed to send message for ${type}:`, error);
      }
    },
    time ? time : 1000
  );
}

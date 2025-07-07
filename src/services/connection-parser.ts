import { OauthType, ParseConnectionType } from "../types/type";

export function isLoginPage(): boolean {
  return window.location.href.includes("login");
}

/**
 * 연결 정보 파싱 (재시도 로직 포함)
 */
export function parseConnection(
  { parentDom, listDom, imageDom, nameDom }: ParseConnectionType,
  callback?: () => void,
  retryCount: number = 0,
  maxRetries: number = 1
) {
  try {
    const parentElement = document.querySelector(parentDom);
    if (!parentElement) {
      // 최대 재시도 횟수에 도달하지 않았다면 5초 후 재시도
      if (retryCount < maxRetries) {
        console.log(
          `Parent element not found for ${parentDom}, retrying in 5 seconds... (attempt ${
            retryCount + 1
          }/${maxRetries + 1})`
        );
        setTimeout(() => {
          parseConnection(
            { parentDom, listDom, imageDom, nameDom },
            callback,
            retryCount + 1,
            maxRetries
          );
        }, 5000);
        return [];
      } else {
        console.warn(
          `Failed to find parent element after ${
            maxRetries + 1
          } attempts: ${parentDom}`
        );
        return [];
      }
    }

    const items = Array.from(parentElement.querySelectorAll(listDom)).map(
      (list) => {
        const image = (list.querySelector(imageDom) as HTMLImageElement)?.src;
        const name = list.querySelector(nameDom)?.textContent || undefined;
        return { image, name };
      }
    );

    if (callback) callback();
    return items;
  } catch (error) {
    console.warn(`Failed to parse connections for ${parentDom}:`, error);
    return [];
  }
}

/**
 * 메시지 데이터 전송 (재시도 로직 포함)
 */
export function sendMessageData(
  type: OauthType,
  dataFunction: () => any,
  delay?: number,
  retryCount: number = 0,
  maxRetries: number = 1
) {
  setTimeout(
    () => {
      try {
        const data = dataFunction();
        if (data && data.length > 0) {
          chrome.runtime.sendMessage({
            type,
            payload: data,
          });
        } else {
          // 데이터가 없고 재시도 횟수가 남아있다면 5초 후 재시도
          if (retryCount < maxRetries) {
            console.log(
              `No data found for ${type}, retrying in 5 seconds... (attempt ${
                retryCount + 1
              }/${maxRetries + 1})`
            );
            sendMessageData(
              type,
              dataFunction,
              5000,
              retryCount + 1,
              maxRetries
            );
          } else {
            console.warn(
              `No data found after ${maxRetries + 1} attempts for ${type}`
            );
          }
        }
      } catch (error) {
        console.warn(`Failed to send message for ${type}:`, error);
      }
    },
    delay ? delay : 1000
  );
}

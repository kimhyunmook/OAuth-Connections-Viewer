export type OauthType =
  | "GOOGLE_GET"
  | "GOOGLE_SAVE"
  | "GOOGLE_READY"
  | "NAVER_GET"
  | "NAVER_SAVE"
  | "NAVER_READY"
  | "KAKAO_GET"
  | "KAKAO_SAVE"
  | "KAKAO_READY"
  | "LOGIN_REQUIRED";

export interface MsgType {
  type: OauthType;
  payload: ConnectionType[];
}

export type ConnectionType = {
  image?: string;
  name?: string;
};

export interface ParseConnectionType {
  parentDom: string;
  listDom: string;
  imageDom: string;
  nameDom: string;
}

export interface ServiceBackgroundConfig {
  key: string;
  saveType: string;
  getType: string;
  readyType: string;
  loginRequiredType: string;
  latest: ConnectionType[];
}

export interface ServiceConfigItem {
  btn: HTMLButtonElement;
  storageKey: string;
  saveType: OauthType;
  getType: OauthType;
  readyType: string;
  url: string;
  emptyMsg: string;
  loadingMsg: string;
}

export interface ServiceConfig {
  google: ServiceConfigItem;
  naver: ServiceConfigItem;
  kakao: ServiceConfigItem;
}

// ===== 검색 관련 타입들 =====

// 플랫폼 타입
export type PlatformType = "google" | "naver" | "kakao";

// 검색 결과 타입
export interface SearchResult extends ConnectionType {
  platform: PlatformType;
}

// 모든 플랫폼 연결 데이터 타입
export interface AllConnections {
  google: ConnectionType[];
  naver: ConnectionType[];
  kakao: ConnectionType[];
}

// 검색 상태 타입
export type SearchViewType = "search" | "platform";

// 검색 설정 타입
export interface SearchConfig {
  minSearchLength: number;
  debounceDelay: number;
  maxResults: number;
}

// 플랫폼 정보 타입
export interface PlatformInfo {
  name: string;
  displayName: string;
  storageKey: string;
  color: string;
}

// 검색 이벤트 콜백 타입
export type PlatformClickCallback = (platform: PlatformType) => void;
export type SearchCallback = (results: SearchResult[]) => void;

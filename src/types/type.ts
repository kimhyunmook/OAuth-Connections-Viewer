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
  latest: ConnectionType[];
  displayName: string;
  iconPath: string;
  backgroundColor: string;
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



export interface SearchElements {
  searchInput: HTMLInputElement | null;
  searchBtn: HTMLButtonElement | null;
  listUL: HTMLUListElement | null;
}


export interface SearchState {
  isSearching: boolean;
  currentView: SearchViewType;
}


export interface TabMessage {
  type: string;
  tabId?: number;
  service?: string;
}

export interface ConnectionResponse {
  connections: ConnectionType[];
  error?: string;
}


// 플랫폼별 파싱 설정
export interface PlatformConfig {
  url: string;
  service: string;
  selectors: {
    parentDom: string;
    listDom: string;
    imageDom: string;
    nameDom: string;
  };
}
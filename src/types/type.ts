export type OauthType =
  | "GOOGLE_GET"
  | "GOOGLE_SAVE"
  | "NAVER_GET"
  | "NAVER_SAVE"
  | "KAKAO_GET"
  | "KAKAO_SAVE";

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

// 검색 관련 타입들
export interface SearchResult {
  connections: ConnectionType[];
  platform: string;
}

export interface AllConnections {
  google: ConnectionType[];
  naver: ConnectionType[];
  kakao: ConnectionType[];
}

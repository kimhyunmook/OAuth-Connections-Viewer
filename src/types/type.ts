export type OauthType =
  | "GOOGLE_GET"
  | "GOOGLE_SAVE"
  | "NAVER_GET"
  | "NAVER_SAVE"
  | "KAKAO_GET"
  | "KAKAO_SAVE";

export interface MsgType {
  type: OauthType;
  payload: any[];
}

export type ConnectionType = {
  image?: string;
  name?: string;
};

export interface ParseConnectionType {
  parentDom: string
  listDom: string
  imageDom: string
  nameDom: string
}

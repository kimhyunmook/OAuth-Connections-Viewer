export type OauthType = "GOOGLE_GET" | "GOOGLE_SAVE";

export interface MsgType {
  type: OauthType;
  payload: any[];
}

export type ConnectionType = {
  image?: string;
  name?: string;
};

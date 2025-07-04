export interface MsgType {
  type: "SAVE_CONNECTIONS" | "GET_CONNECTIONS";
  payload: any[];
}

export type Connection = {
  image?: string;
  name?: string;
};

import { AdodbContractTsQueryMsgBuilder } from "./AdodbContractTs.message-builder";

export namespace ADODB {
  export const getCodeId = AdodbContractTsQueryMsgBuilder.codeId;
  export type GetCodeIdResponse = number;
}

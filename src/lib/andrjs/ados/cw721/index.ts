import { Cw721ContractTsQueryMsgBuilder } from "./Cw721ContractTs.message-builder";
import {
  CollectionInfo,
  MinterResponse,
  NftInfoResponse,
  TokensResponse,
} from "./Cw721ContractTs.types";

export namespace CW721 {
  export interface GetAllTokensLimit {
    limit: number;
  }

  export function getAllTokensLimit(
    value?: GetAllTokensLimit,
  ): GetAllTokensLimit {
    return {
      limit: value?.limit ?? 25,
    };
  }

  export const getAllTokenIdMsg = (limit: GetAllTokensLimit) => {
    limit = getAllTokensLimit(limit);
    return {
      all_tokens: {
        limit: limit.limit,
      },
    };
  };

  export type GetAllTokenIdResponse = TokensResponse;

  export const getTokenInfoMsg = Cw721ContractTsQueryMsgBuilder.nftInfo;

  export type GetTokenInfoResponse = NftInfoResponse;

  export const getContractInfoMsg = Cw721ContractTsQueryMsgBuilder.contractInfo;

  export type GetContractInfoResponse = CollectionInfo;

  export const getMinterMsg = Cw721ContractTsQueryMsgBuilder.minter;

  export type GetMinterResponse = MinterResponse;
}

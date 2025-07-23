import { Cw20ContractTsQueryMsgBuilder } from "./Cw20ContractTs.message-builder";
import {
  AllAccountsResponse,
  BalanceResponse,
  MarketingInfoResponse,
  TokenInfoResponse,
} from "./Cw20ContractTs.types";

export namespace CW20 {
  export const getTokenInfo = Cw20ContractTsQueryMsgBuilder.tokenInfo;
  export type GetTokenInfoResponse = TokenInfoResponse;

  export const getAllAccounts = Cw20ContractTsQueryMsgBuilder.allAccounts;
  export type GetAllAccountsResponse = AllAccountsResponse;

  export const getBalance = Cw20ContractTsQueryMsgBuilder.balance;
  export type GetBalanceResponse = BalanceResponse;

  export const getMarketingInfo = Cw20ContractTsQueryMsgBuilder.marketingInfo;
  export type GetMarketingInfoResponse = MarketingInfoResponse;
}

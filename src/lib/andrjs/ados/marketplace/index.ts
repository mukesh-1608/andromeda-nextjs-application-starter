import { MarketplaceContractTsExecuteMsgBuilder, MarketplaceContractTsQueryMsgBuilder } from "./MarketplaceContractTs.message-builder";
import {
  SaleStateResponse,
  Status,
  SaleIdsResponse,
  SaleInfo,
  PermissionAction,
  AuthorizedAddressesResponse,
} from "./MarketplaceContractTs.types";

export namespace MARKETPLACE {
  export type StatusType = Status;

  export const latestSaleStateMsg =
    MarketplaceContractTsQueryMsgBuilder.latestSaleState;
  export type LatestSaleStateResponse = SaleStateResponse;

  export const saleStateMsg = MarketplaceContractTsQueryMsgBuilder.saleState;

  export const saleIdsMsg = MarketplaceContractTsQueryMsgBuilder.saleIds;
  export type SaleIdsResponseType = SaleIdsResponse;

  export const saleInfosForAddressMsg =
    MarketplaceContractTsQueryMsgBuilder.saleInfosForAddress;

  export type SaleInfoType = SaleInfo;

  export type PermissionActionType = PermissionAction;

  export const authorizedAddressesMsg =
    MarketplaceContractTsQueryMsgBuilder.authorizedAddresses;

  export type AuthorizedAddressesResponseType = AuthorizedAddressesResponse;

  // This line was added to fix the error
  export const buyMsg = MarketplaceContractTsExecuteMsgBuilder.buy;
}

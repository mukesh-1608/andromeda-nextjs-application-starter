import {
  AuctionContractTsExecuteMsgBuilder,
  AuctionContractTsQueryMsgBuilder,
} from "./AuctionContractTs.message-builder";
import { AuctionStateResponse, BidsResponse } from "./AuctionContractTs.types";

export namespace AUCTION {
  export const getLatestSaleState =
    AuctionContractTsQueryMsgBuilder.latestAuctionState;

  export type GetLatestSaleStateResponse = AuctionStateResponse;

  export interface GetBidsPagination {
    start_after?: number;
    limit: number;
  }

  export function createGetBidsPagination(
    partial?: Partial<GetBidsPagination>,
  ): GetBidsPagination {
    return {
      start_after: partial?.start_after,
      limit: partial?.limit ?? 25,
    };
  }

  export const getBids = (auctionId: string, pagination: GetBidsPagination) => {
    return AuctionContractTsQueryMsgBuilder.bids({
      auctionId,
      limit: pagination.limit,
      startAfter: pagination.start_after,
    });
  };

  export type GetBidsResponse = BidsResponse;

  export const placeBidMsg = AuctionContractTsExecuteMsgBuilder.placeBid;

  export const buyNowMsg = AuctionContractTsExecuteMsgBuilder.buyNow;

  export const claimMsg = AuctionContractTsExecuteMsgBuilder.claim;

  export const cancelAuctionMsg =
    AuctionContractTsExecuteMsgBuilder.cancelAuction;

  export const updateAuctionMsg =
    AuctionContractTsExecuteMsgBuilder.updateAuction;
}

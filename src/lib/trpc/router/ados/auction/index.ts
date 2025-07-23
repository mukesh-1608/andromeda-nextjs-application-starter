import { AUCTION } from "@/lib/andrjs/ados/auction";
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import z from "zod";
import { queryAuctionLatestSaleState, queryBids } from "./query";

export const auctionRouter = createTRPCRouter({
  getLatestAuctionState: withContractAddress
    .input(z.object({ tokenAddress: z.string(), tokenId: z.string() }))
    .query<AUCTION.GetLatestSaleStateResponse>(async ({ input, ctx }) => {
      const { address: resolvedTokenAddress } = await ctx.resolvePath(
        input.tokenAddress,
        ctx.chainList,
        input["chain-identifier"],
      );
      const saleState = await queryAuctionLatestSaleState(
        await ctx.getRpcClient(ctx.chainConfig),
        ctx.resolvedContractAddress,
        resolvedTokenAddress,
        input.tokenId,
      );
      return saleState;
    }),

  getBids: withContractAddress
    .input(
      z.object({
        auctionId: z.string(),
        pagination: z.custom<AUCTION.GetBidsPagination>().optional(),
      }),
    )
    .query<AUCTION.GetBidsResponse>(async ({ input, ctx }) => {
      const bids = await queryBids(
        await ctx.getRpcClient(ctx.chainConfig),
        ctx.resolvedContractAddress,
        input.auctionId,
        input.pagination,
      );
      return bids;
    }),
});

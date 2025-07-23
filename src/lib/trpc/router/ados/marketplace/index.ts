import { MARKETPLACE } from "@/lib/andrjs/ados/marketplace";
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import z from "zod";
import { queryMarketplaceLatestSaleState } from "./query";

export const marketplaceRouter = createTRPCRouter({
  getLatestSaleState: withContractAddress
    .input(z.object({ tokenAddress: z.string(), tokenId: z.string() }))
    .query<MARKETPLACE.LatestSaleStateResponse>(async ({ ctx, input }) => {
      const rpcClient = await ctx.getRpcClient(ctx.chainConfig);
      const { address: resolvedTokenAddress } = await ctx.resolvePath(
        input.tokenAddress,
        ctx.chainList,
        input["chain-identifier"],
      );
      const latestSaleState = await queryMarketplaceLatestSaleState(
        rpcClient,
        ctx.resolvedContractAddress,
        resolvedTokenAddress,
        input.tokenId,
      );
      return latestSaleState;
    }),
});

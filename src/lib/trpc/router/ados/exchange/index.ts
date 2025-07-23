import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import z from "zod";
import { EXCHANGE } from "@/lib/andrjs/ados/exchange";
import { querySaleAssets, querySaleInfo } from "./query";

export const exchangeRouter = createTRPCRouter({
  getSaleInfo: withContractAddress
    .input(z.object({ denom: z.string() }))
    .query<EXCHANGE.GetSaleResponse["sale"]>(async ({ ctx, input }) => {
      const saleInfo = await querySaleInfo(
        await ctx.getRpcClient(ctx.chainConfig.chainId),
        ctx.resolvedContractAddress,
        input.denom,
      );
      return saleInfo.sale;
    }),
  getSaleAssets: withContractAddress
    .input(
      z.object({
        limit: z.number().optional(),
        startAfter: z.string().optional(),
      }),
    )
    .query<EXCHANGE.GetSaleAssetsResponse>(async ({ ctx, input }) => {
      const saleAssets = await querySaleAssets(
        await ctx.getRpcClient(ctx.chainConfig.chainId),
        ctx.resolvedContractAddress,
        input.limit,
        input.startAfter,
      );
      return saleAssets;
    }),
});

import { CROWDFUND } from "@/lib/andrjs/ados/crowdfund";
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { createTRPCRouter, publicProcedure } from "@/lib/trpc/trpc";
import { z } from "zod";
import { queryCampaignSummary, queryTiers } from "./query";

export const crowdfundRouter = createTRPCRouter({
  getCampaignSummary: withContractAddress
    .input(z.object({}))
    .query<CROWDFUND.CampaignSummaryResponse>(async ({ ctx }) => {
      const rpcClient = await ctx.getRpcClient(ctx.chainConfig.chainId);
      const campaignSummary = await queryCampaignSummary(
        rpcClient,
        ctx.resolvedContractAddress,
      );
      return campaignSummary;
    }),

  getTiers: withContractAddress
    .input(z.object({ limit: z.custom<CROWDFUND.TiersLimit>().optional() }))
    .query<CROWDFUND.TiersResponse>(async ({ input, ctx }) => {
      const rpcClient = await ctx.getRpcClient(ctx.chainConfig.chainId);
      const tiers = await queryTiers(
        rpcClient,
        ctx.resolvedContractAddress,
        input.limit,
      );
      return tiers;
    }),
});

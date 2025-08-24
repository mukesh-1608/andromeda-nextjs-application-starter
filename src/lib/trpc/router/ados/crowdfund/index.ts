import { z } from "zod";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { getCampaignSummary } from "./query";

export const crowdfundRouter = createTRPCRouter({
  getCampaignSummary: withContractAddress
    .input(z.object({})) // This line is essential and was missing in the previous instruction.
    .query(async ({ ctx }) => {
      const rpcClient = await ctx.getRpcClient(ctx.chainConfig.chainId);
      return getCampaignSummary(rpcClient, ctx.resolvedContractAddress);
    }),
});
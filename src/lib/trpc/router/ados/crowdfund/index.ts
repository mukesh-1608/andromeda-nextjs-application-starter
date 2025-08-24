import { createTRPCRouter } from "@/lib/trpc/trpc";
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { getCampaignSummary } from "./query";

export const crowdfundRouter = createTRPCRouter({
  /**
   * This procedure now correctly uses the withContractAddress middleware
   * without the conflicting .input() call, allowing it to receive the
   * contract-address and chain-identifier from the client.
   */
  getCampaignSummary: withContractAddress.query(async ({ ctx }) => {
    const rpcClient = await ctx.getRpcClient(ctx.chainConfig.chainId);
    return getCampaignSummary(rpcClient, ctx.resolvedContractAddress);
  }),
});
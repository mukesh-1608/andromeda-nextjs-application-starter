import { createTRPCRouter as router } from "@/lib/trpc/trpc";
import { adoProcedure } from "@/lib/trpc/procedures";
import { getCampaignSummary } from "./query";

export const crowdfundRouter = router({
  getCampaignSummary: adoProcedure.query(async ({ ctx }: { ctx: any }) => {
    return getCampaignSummary(ctx.client, ctx.contractAddress);
  }),
});

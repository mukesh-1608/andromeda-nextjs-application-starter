import z from "zod";
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import {
  getMarketingInfo,
  queryBalance,
  queryCw20AllAccounts,
  queryCw20TokenInfo,
} from "./query";
import { CW20 } from "@/lib/andrjs/ados/cw20";

export const cw20Router = createTRPCRouter({
  getTokenInfo: withContractAddress
    .input(z.object({}))
    .query<CW20.GetTokenInfoResponse>(async ({ ctx }) => {
      const totalSupply = await queryCw20TokenInfo(
        ctx.chainConfig.lcdUrl,
        ctx.resolvedContractAddress,
      );
      return totalSupply;
    }),

  getAllAccounts: withContractAddress
    .input(z.object({ limit: z.number().optional() }))
    .query<CW20.GetAllAccountsResponse>(async ({ input, ctx }) => {
      const allAccounts = await queryCw20AllAccounts(
        ctx.chainConfig.lcdUrl,
        ctx.resolvedContractAddress,
        input.limit,
      );
      return allAccounts;
    }),

  getBalance: withContractAddress
    .input(z.object({ address: z.string() }))
    .query<CW20.GetBalanceResponse>(async ({ ctx, input }) => {
      const balance = await queryBalance(
        ctx.chainConfig.lcdUrl,
        ctx.resolvedContractAddress,
        input.address,
      );
      return balance;
    }),

  getMarketingInfo: withContractAddress
    .input(z.object({}))
    .query<CW20.GetMarketingInfoResponse>(async ({ ctx }) => {
      const marketingInfo = await getMarketingInfo(
        ctx.chainConfig.lcdUrl,
        ctx.resolvedContractAddress,
      );
      return marketingInfo;
    }),
});

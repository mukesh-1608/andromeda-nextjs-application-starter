import { z } from "zod";

import { APP_CONTRACT } from "@/lib/andrjs/ados/app-contract";
import { queryAppGetAddressesWithNames, queryAppGetComponents } from "./query";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";

export const appContractRouter = createTRPCRouter({
  getComponents: withContractAddress
    .input(z.object({}))
    .query<APP_CONTRACT.GetComponentsResponse>(async ({ ctx, input }) => {
      const components = await queryAppGetComponents(
        await ctx.getRpcClient(ctx.chainConfig),
        ctx.resolvedContractAddress,
      );
      return components;
    }),

  getAddressesWithNames: withContractAddress
    .input(z.object({}))
    .query<APP_CONTRACT.GetAddressesWithNamesResponse>(
      async ({ ctx, input }) => {
        const addresses = await queryAppGetAddressesWithNames(
          await ctx.getRpcClient(ctx.chainConfig),
          ctx.resolvedContractAddress,
        );
        return addresses;
      },
    ),
});

import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import z from "zod";
import { queryAdoType } from "./query";
import { BASE_ADO } from "@/lib/andrjs/ados/base-ado";

export const baseAdoRouter = createTRPCRouter({
  getAdoType: withContractAddress
    .input(z.object({}))
    .query<BASE_ADO.TypeResponse>(async ({ ctx, input }) => {
      const adoType = await queryAdoType(
        await ctx.getRpcClient(ctx.chainConfig.chainId),
        ctx.resolvedContractAddress,
      );
      return adoType;
    }),
});

import { PRIMITIVE } from "@/lib/andrjs/ados/primitive";
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import z from "zod";
import { queryAllKeys, queryValue } from "./query";

export const primitiveRouter = createTRPCRouter({
  getAllKeys: withContractAddress
    .input(z.object({}))
    .query<PRIMITIVE.GetAllKeysResponse>(async ({ ctx }) => {
      const allKeys = await queryAllKeys(
        ctx.chainConfig.lcdUrl,
        ctx.resolvedContractAddress,
      );
      return allKeys;
    }),

  getValues: withContractAddress
    .input(z.object({ keys: z.array(z.string()) }))
    .query<PRIMITIVE.GetValueResponseType[]>(async ({ ctx, input }) => {
      const values = await Promise.all(
        input.keys.map(async (key) => {
          const value = await queryValue(
            ctx.chainConfig.lcdUrl,
            ctx.resolvedContractAddress,
            key,
          );
          return value;
        }),
      );
      return values;
    }),

  getValue: withContractAddress
    .input(z.object({ key: z.string() }))
    .query<PRIMITIVE.GetValueResponseType>(async ({ ctx, input }) => {
      const value = await queryValue(
        ctx.chainConfig.lcdUrl,
        ctx.resolvedContractAddress,
        input.key,
      );
      return value;
    }),
});

import { z } from "zod";

import { VFS } from "@/lib/andrjs/ados/vfs";
import { withVfsResolver } from "./withVfsResolver";

/**
 * Middleware to add chain config to the context.
 * Adds a required chainId to the input and adds the chain config to the context.
 */
export const withContractAddress = withVfsResolver
  .input(
    z.object({
      "contract-address": z.union([VFS.PATH_SCHEMA, z.string()]),
      "chain-identifier": z.string().optional(),
    }),
  )
  .use(async ({ ctx, next, input }) => {
    const { address, chainConfig } = await ctx.resolvePath(
      input["contract-address"],
      ctx.chainList,
      input["chain-identifier"],
    );
    return next({
      ctx: { ...ctx, resolvedContractAddress: address, chainConfig },
    });
  });

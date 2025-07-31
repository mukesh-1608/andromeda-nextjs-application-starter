import { z } from "zod";

import { RpcClient } from "@/lib/andrjs/rpc-client/client";
import { withRpcClient } from "./withRpcClient";

const cachedRpcClients: {
  [url: string]: Promise<RpcClient>;
} = {};

/**
 * Middleware to add chain config to the context.
 * Adds a required chainId to the input and adds the chain config to the context.
 */
export const withChainConfig = withRpcClient
  .input(
    z.object({
      "chain-identifier": z.string(),
    }),
  )
  .use(async ({ ctx, next, input }) => {
    const chainConfig = ctx.chainList.find(
      (c) =>
        c.chainId === input["chain-identifier"] ||
        c.name === input["chain-identifier"],
    );
    if (!chainConfig) {
      throw new Error(
        `Chain config not found for ${input["chain-identifier"]}`,
      );
    }
    return next({ ctx: { ...ctx, chainConfig } });
  });

import { IChainConfig } from "../router/chain/types";
import { t } from "../trpc";
import { RpcClient } from "@/lib/andrjs/rpc-client/client";

const cachedRpcClients: {
  [url: string]: Promise<RpcClient>;
} = {};

/**
 * Middleware to add rpc client to the context.
 * Adds a required chainId to the input and adds the chain config to the context.
 */
export const withRpcClient = t.procedure.use(async ({ ctx, next }) => {
  const getRpcClient = async (chainConfig: string | IChainConfig) => {
    if (typeof chainConfig === "string") {
      const _chainConfig = ctx.chainList.find(
        (c) => c.chainId === chainConfig || c.name === chainConfig,
      );
      if (!_chainConfig) {
        throw new Error(`Chain config not found for ${chainConfig}`);
      }
      chainConfig = _chainConfig;
    }
    // Cache rpc client and try to reuse it
    let rpcClientPromise = cachedRpcClients[chainConfig.chainUrl];
    if (!rpcClientPromise) {
      rpcClientPromise = RpcClient.connect({
        url: chainConfig.chainUrl,
        batch: 10,
        batchInterval: 500,
      });
      cachedRpcClients[chainConfig.chainUrl] = rpcClientPromise;
    }
    const rpcClient = await rpcClientPromise;
    return rpcClient;
  };
  return next({ ctx: { ...ctx, getRpcClient } });
});

import { MARKETPLACE } from "@/lib/andrjs/ados/marketplace";
import { RpcClient } from "@/lib/andrjs/rpc-client";
import cachified, { CacheEntry } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, CacheEntry>({
  max: 5,
});

export async function queryMarketplaceLatestSaleState(
  rpcClient: RpcClient,
  contractAddress: string,
  tokenAddress: string,
  tokenId: string,
) {
  return cachified({
    key: [
      "query",
      "marketplace",
      "getLatestSaleState",
      contractAddress,
      tokenAddress,
      tokenId,
    ].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const latestSaleState =
        await rpcClient.queryContractSmart<MARKETPLACE.LatestSaleStateResponse>(
          contractAddress,
          MARKETPLACE.latestSaleStateMsg({
            tokenAddress: tokenAddress,
            tokenId: tokenId,
          }),
        );
      return latestSaleState;
    },
  });
}

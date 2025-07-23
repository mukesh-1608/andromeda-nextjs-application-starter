import { EXCHANGE } from "@/lib/andrjs/ados/exchange";
import { RpcClient } from "@/lib/andrjs/rpc-client";
import cachified, { CacheEntry } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, CacheEntry>({
  max: 5,
});

export async function querySaleInfo(
  rpcClient: RpcClient,
  contractAddress: string,
  denom: string,
) {
  return cachified({
    key: ["query", "exchange", "getSaleInfo", contractAddress, denom].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const saleInfo =
        await rpcClient.queryContractSmart<EXCHANGE.GetSaleResponse>(
          contractAddress,
          EXCHANGE.getSaleInfo({ asset: denom }),
        );
      console.log("SALE INFO", saleInfo, contractAddress, denom);
      return saleInfo;
    },
  });
}

export async function querySaleAssets(
  rpcClient: RpcClient,
  contractAddress: string,
  limit?: number,
  startAfter?: string,
) {
  return cachified({
    key: [
      "query",
      "exchange",
      "getSaleAssets",
      contractAddress,
      limit,
      startAfter,
    ].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const saleAssets =
        await rpcClient.queryContractSmart<EXCHANGE.GetSaleAssetsResponse>(
          contractAddress,
          EXCHANGE.getSaleAssets({ limit, startAfter }),
        );
      return saleAssets;
    },
  });
}

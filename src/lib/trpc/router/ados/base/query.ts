import { BASE_ADO } from "@/lib/andrjs/ados/base-ado";
import { RpcClient } from "@/lib/andrjs/rpc-client";
import cachified, { CacheEntry } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, CacheEntry>({
  max: 5,
});

export async function queryAdoType(
  rpcClient: RpcClient,
  contractAddress: string,
) {
  return cachified({
    key: ["query", "ado", "type", contractAddress].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const adoType = await rpcClient.queryContractSmart<BASE_ADO.TypeResponse>(
        contractAddress,
        BASE_ADO.type(),
      );
      return adoType;
    },
  });
}

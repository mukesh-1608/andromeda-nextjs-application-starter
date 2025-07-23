import { LcdClient } from "@/lib/andrjs/lcd-client/client";
import { PRIMITIVE } from "@/lib/andrjs/ados/primitive";
import cachified, { CacheEntry } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, CacheEntry>({
  max: 5,
});

export async function queryAllKeys(lcdUrl: string, primitiveAddress: string) {
  return cachified({
    key: ["query", "primitive", "getAllKeys", primitiveAddress].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const lcdClient = new LcdClient(lcdUrl);
      const allKeys =
        await lcdClient.queryContractSmart<PRIMITIVE.GetAllKeysResponse>(
          primitiveAddress,
          PRIMITIVE.getAllKeys(),
        );
      return allKeys;
    },
  });
}

export async function queryValue(
  lcdUrl: string,
  primitiveAddress: string,
  key: string,
) {
  return cachified({
    key: [
      "query",
      "primitive",
      "getValue",
      primitiveAddress,
      key ?? "default",
    ].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const lcdClient = new LcdClient(lcdUrl);
      const value =
        await lcdClient.queryContractSmart<PRIMITIVE.GetValueResponseType>(
          primitiveAddress,
          PRIMITIVE.getValue({ key }),
        );
      return value;
    },
  });
}

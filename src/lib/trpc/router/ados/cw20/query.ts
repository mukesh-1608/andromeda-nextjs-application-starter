import { CW20 } from "@/lib/andrjs/ados/cw20";
import { LcdClient } from "@/lib/andrjs/lcd-client/client";
import cachified, { CacheEntry } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, CacheEntry>({
  max: 5,
});

export async function queryCw20TokenInfo(
  lcdUrl: string,
  sharesAddress: string,
) {
  return cachified({
    key: ["query", "cw20", "getTotalSupply", sharesAddress].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const lcdClient = new LcdClient(lcdUrl);
      const allTokenIds =
        await lcdClient.queryContractSmart<CW20.GetTokenInfoResponse>(
          sharesAddress,
          CW20.getTokenInfo(),
        );
      return allTokenIds;
    },
  });
}

export async function queryCw20AllAccounts(
  lcdUrl: string,
  sharesAddress: string,
  limit?: number,
) {
  return cachified({
    key: ["query", "cw20", "getAllAccounts", sharesAddress, limit].join("-"),
    cache,
    ttl: 1000 * 60 * 5, //5 minutes
    getFreshValue: async () => {
      const lcdClient = new LcdClient(lcdUrl);
      const allAccounts =
        await lcdClient.queryContractSmart<CW20.GetAllAccountsResponse>(
          sharesAddress,
          CW20.getAllAccounts({ limit: limit ?? 25 }),
        );
      return allAccounts;
    },
  });
}

export async function queryBalance(
  lcdUrl: string,
  sharesAddress: string,
  address: string,
) {
  return cachified({
    key: ["query", "cw20", "getBalance", sharesAddress, address].join("-"),
    cache,
    ttl: 1000 * 60 * 5, //5 minutes
    getFreshValue: async () => {
      const lcdClient = new LcdClient(lcdUrl);
      const balance =
        await lcdClient.queryContractSmart<CW20.GetBalanceResponse>(
          sharesAddress,
          CW20.getBalance({ address }),
        );
      return balance;
    },
  });
}

export const getMarketingInfo = async (
  lcdUrl: string,
  sharesAddress: string,
) => {
  return cachified({
    key: ["query", "cw20", "getMarketingInfo", sharesAddress].join("-"),
    cache,
    ttl: 1000 * 60 * 5, //5 minutes
    getFreshValue: async () => {
      const lcdClient = new LcdClient(lcdUrl);
      const marketingInfo =
        await lcdClient.queryContractSmart<CW20.GetMarketingInfoResponse>(
          sharesAddress,
          CW20.getMarketingInfo(),
        );
      return marketingInfo;
    },
  });
};

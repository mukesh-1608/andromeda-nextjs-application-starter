import cachified, { CacheEntry } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";
import { RpcClient } from "@/lib/andrjs/rpc-client";
import { CROWDFUND } from "@/lib/andrjs/ados/crowdfund";

const cache = new LRUCache<string, CacheEntry>({
  max: 5,
});

export async function queryCampaignSummary(
  rpcClient: RpcClient,
  crowdfundAddress: string,
) {
  return cachified({
    key: ["query", "crowdfund", "campaignSummary", crowdfundAddress].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const campaignSummary =
        await rpcClient.queryContractSmart<CROWDFUND.CampaignSummaryResponse>(
          crowdfundAddress,
          CROWDFUND.getCampaignSummaryMsg(),
        );
      return campaignSummary;
    },
  });
}

export async function queryTiers(
  rpcClient: RpcClient,
  crowdfundAddress: string,
  limit?: CROWDFUND.TiersLimit,
) {
  limit = CROWDFUND.getTiersLimit(limit);
  return cachified({
    key: ["query", "crowdfund", "tiers", crowdfundAddress, limit].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const tiers = await rpcClient.queryContractSmart<CROWDFUND.TiersResponse>(
        crowdfundAddress,
        CROWDFUND.getTiersMsg(limit),
      );
      return tiers;
    },
  });
}

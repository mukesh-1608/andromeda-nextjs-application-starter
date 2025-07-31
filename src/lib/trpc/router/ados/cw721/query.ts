import { CW721 } from "@/lib/andrjs/ados/cw721";
import { LcdClient } from "@/lib/andrjs/lcd-client/client";
import cachified, { CacheEntry } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";
import { UriDataType } from "./types";
import { RpcClient } from "@/lib/andrjs/rpc-client";

const cache = new LRUCache<string, CacheEntry>({
  max: 5,
});

export async function queryCw721AllTokenIds(
  rpcClient: RpcClient,
  vehicleAddress: string,
  limit?: CW721.GetAllTokensLimit,
) {
  limit = CW721.getAllTokensLimit(limit);
  return cachified({
    key: ["query", "cw721", "getAllTokenIds", vehicleAddress, limit.limit].join(
      "-",
    ),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const allTokenIds =
        await rpcClient.queryContractSmart<CW721.GetAllTokenIdResponse>(
          vehicleAddress,
          CW721.getAllTokenIdMsg(limit),
        );
      return allTokenIds;
    },
  });
}

export async function queryCw721TokenInfo(
  rpcClient: RpcClient,
  contractAddress: string,
  token_id: string,
) {
  return cachified({
    key: ["query", "cw721", "getTokenInfo", contractAddress, token_id].join(
      "-",
    ),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const tokenInfo =
        await rpcClient.queryContractSmart<CW721.GetTokenInfoResponse>(
          contractAddress,
          CW721.getTokenInfoMsg({ tokenId: token_id }),
        );
      return tokenInfo;
    },
  });
}

export async function fetchCw721TokenDetails(token_uri: string) {
  return cachified({
    key: ["query", "cw721", "getAllTokenDetails", token_uri].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const response = await fetch(token_uri);
      return response.json().then((res) => {
        return res as UriDataType;
      });
    },
  });
}

export async function queryCw721ContractInfo(
  rpcClient: RpcClient,
  contractAddress: string,
) {
  return cachified({
    key: ["query", "cw721", "getContractInfo", contractAddress].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const contractInfo =
        await rpcClient.queryContractSmart<CW721.GetContractInfoResponse>(
          contractAddress,
          CW721.getContractInfoMsg(),
        );
      return contractInfo;
    },
  });
}

export async function queryCw721Minter(
  rpcClient: RpcClient,
  contractAddress: string,
) {
  return cachified({
    key: ["query", "cw721", "getMinter", contractAddress].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const minter =
        await rpcClient.queryContractSmart<CW721.GetMinterResponse>(
          contractAddress,
          CW721.getMinterMsg(),
        );
      return minter;
    },
  });
}

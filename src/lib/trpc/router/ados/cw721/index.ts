import { createTRPCRouter, publicProcedure } from "@/lib/trpc/trpc";
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { CW721 } from "@/lib/andrjs/ados/cw721";
import z from "zod";
import {
  fetchCw721TokenDetails,
  queryCw721AllTokenIds,
  queryCw721ContractInfo,
  queryCw721Minter,
  queryCw721TokenInfo,
} from "./query";
import { UriDataType } from "./types";

export const cw721Router = createTRPCRouter({
  getAllTokenId: withContractAddress
    .input(z.object({ limit: z.custom<CW721.GetAllTokensLimit>().optional() }))
    .query<CW721.GetAllTokenIdResponse>(async ({ input, ctx }) => {
      const rpcClient = await ctx.getRpcClient(ctx.chainConfig.chainId);
      const tokenIds = await queryCw721AllTokenIds(
        rpcClient,
        ctx.resolvedContractAddress,
        input.limit,
      );
      return tokenIds;
    }),

  getTokenInfo: withContractAddress
    .input(z.object({ tokenId: z.string() }))
    .query<CW721.GetTokenInfoResponse>(async ({ ctx, input }) => {
      const rpcClient = await ctx.getRpcClient(ctx.chainConfig.chainId);
      const tokenInfo = await queryCw721TokenInfo(
        rpcClient,
        ctx.resolvedContractAddress,
        input.tokenId,
      );
      return tokenInfo;
    }),

  fetchTokenData: publicProcedure
    .input(z.object({ token_uri: z.string() }))
    .query<UriDataType>(async ({ input }) => {
      const tokenDetails = await fetchCw721TokenDetails(input.token_uri);
      return tokenDetails;
    }),

  getContractInfo: withContractAddress.query<CW721.GetContractInfoResponse>(
    async ({ ctx }) => {
      const rpcClient = await ctx.getRpcClient(ctx.chainConfig.chainId);
      const contractInfo = await queryCw721ContractInfo(
        rpcClient,
        ctx.resolvedContractAddress,
      );
      return contractInfo;
    },
  ),

  getMinter: withContractAddress.query<CW721.GetMinterResponse>(
    async ({ ctx }) => {
      const rpcClient = await ctx.getRpcClient(ctx.chainConfig.chainId);
      const minter = await queryCw721Minter(
        rpcClient,
        ctx.resolvedContractAddress,
      );
      return minter;
    },
  ),
});

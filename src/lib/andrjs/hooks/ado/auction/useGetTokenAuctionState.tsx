import { trpcReactClient } from "@/lib/trpc/client";

export function useGetTokenAuctionState(
  tokenAddress: string,
  auctionAddress: string,
  tokenId: string,
) {
  const { isLoading, error, data } =
    trpcReactClient.ado.auction.getLatestAuctionState.useQuery({
      "contract-address": auctionAddress,
      tokenAddress: tokenAddress,
      tokenId: tokenId,
    });

  return {
    loading: isLoading,
    error,
    data: data,
  };
}

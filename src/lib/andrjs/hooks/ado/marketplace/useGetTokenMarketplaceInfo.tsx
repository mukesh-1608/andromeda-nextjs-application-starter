import { trpcReactClient } from "@/lib/trpc/client";

export function useGetTokenMarketplaceInfo(
  adoAddress: string,
  tokenAddress: string,
  tokenId: string,
) {
  const { data, isLoading, error } =
    trpcReactClient.ado.marketplace.getLatestSaleState.useQuery({
      "contract-address": adoAddress,
      tokenAddress,
      tokenId,
    });

  return {
    loading: isLoading,
    error,
    data: data,
  };
}

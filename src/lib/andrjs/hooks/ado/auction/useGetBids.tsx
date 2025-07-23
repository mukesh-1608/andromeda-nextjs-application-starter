import { trpcReactClient } from "@/lib/trpc/client";

export function useGetBids(auctionAddress: string, auctionId: number) {
  const { error, data, isLoading } =
    trpcReactClient.ado.auction.getBids.useQuery(
      {
        "contract-address": auctionAddress,
        auctionId: auctionId.toString(),
      },
      {
        refetchInterval: 1000,
      },
    );

  return {
    loading: isLoading,
    error,
    data: data?.bids,
  };
}

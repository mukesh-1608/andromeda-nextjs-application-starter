import { trpcReactClient } from "@/lib/trpc/client";

export function useGetSaleAssets(address: string) {
  const { data, isLoading, error } =
    trpcReactClient.ado.exchange.getSaleAssets.useQuery({
      "contract-address": address,
      limit: 100,
      startAfter: undefined,
    });
  // Converting assets to any and then to array to get proper typing at the end. It should be removed once type has been fixed in the library

  return {
    loading: isLoading,
    error,
    data: data,
  };
}

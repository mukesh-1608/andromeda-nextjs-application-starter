import { trpcReactClient } from "@/lib/trpc/client";

export default function useGetTokens(address: string) {
  const { data, isLoading, error } =
    trpcReactClient.ado.cw721.getAllTokenId.useQuery({
      "contract-address": address,
      limit: {
        limit: 100,
      },
    });

  // Converting assets to any and then to array to get proper typing at the end. It should be removed once type has been fixed in the library

  return {
    loading: isLoading,
    error,
    data: data?.tokens,
  };
}

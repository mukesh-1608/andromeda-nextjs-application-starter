import { trpcReactClient } from "@/lib/trpc/client";

export default function useGetCw20Balance(
  contractAddress: string,
  accountAddress: string,
) {
  const { data, isLoading, error } =
    trpcReactClient.ado.cw20.getBalance.useQuery({
      "contract-address": contractAddress,
      address: accountAddress,
    });

  // Converting assets to any and then to array to get proper typing at the end. It should be removed once type has been fixed in the library

  return {
    loading: isLoading,
    error,
    data: data,
  };
}

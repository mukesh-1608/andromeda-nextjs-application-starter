import { trpcReactClient } from "@/lib/trpc/client";

// Use to get all keys stored in primitive
export const useGetAllKeys = (chain: string, primitiveAddress: string) => {
  const {
    data: allKeys,
    isLoading,
    isError,
  } = trpcReactClient.ado.primitive.getAllKeys.useQuery(
    {
      "chain-identifier": chain,
      "contract-address": primitiveAddress,
    },
    { enabled: !!chain && !!primitiveAddress },
  );

  return { allKeys, isLoading, isError };
};

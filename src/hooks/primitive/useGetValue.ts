import { trpcReactClient } from "@/lib/trpc/client";

// Use to get value for a given key
export const useGetValues = (
  chain: string,
  primitiveAddress: string,
  keys: string[],
) => {
  const {
    data: value,
    isLoading,
    isError,
  } = trpcReactClient.ado.primitive.getValues.useQuery(
    {
      "chain-identifier": chain,
      "contract-address": primitiveAddress,
      keys: keys,
    },
    { enabled: !!chain && !!primitiveAddress && !!keys },
  );
  return { value, isLoading, isError };
};

export const useGetValue = (
  chain: string,
  primitiveAddress: string,
  key: string,
) => {
  const {
    data: value,
    isLoading,
    isError,
  } = trpcReactClient.ado.primitive.getValue.useQuery(
    {
      "chain-identifier": chain,
      "contract-address": primitiveAddress,
      key: key,
    },
    { enabled: !!chain && !!primitiveAddress && !!key },
  );
  return { value, isLoading, isError };
};

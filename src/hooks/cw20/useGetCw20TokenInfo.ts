import { trpcReactClient } from "@/lib/trpc/client";

// Use to get information about CW20, mainly total supply
export const useGetCW20TotalSupply = (chain: string, cw20_address: string) => {
  const {
    data: totalSupply,
    isLoading,
    isError,
  } = trpcReactClient.ado.cw20.getTokenInfo.useQuery(
    {
      "chain-identifier": chain,
      "contract-address": cw20_address,
    },
    { enabled: !!chain && !!cw20_address },
  );

  return { totalSupply, isLoading, isError };
};

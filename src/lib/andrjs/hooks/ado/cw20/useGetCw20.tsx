import { trpcReactClient } from "@/lib/trpc/client";

export default function useGetCW20(address: string) {
  const { data, isLoading, error } =
    trpcReactClient.ado.cw20.getTokenInfo.useQuery({
      "contract-address": address,
    });

  return {
    loading: isLoading,
    error,
    data: data,
  };
}

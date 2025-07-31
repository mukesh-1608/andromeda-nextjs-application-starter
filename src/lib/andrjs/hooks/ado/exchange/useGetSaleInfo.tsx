import { trpcReactClient } from "@/lib/trpc/client";

export function useGetSaleInfo(address: string, denom: string) {
  const { data, isLoading, error } =
    trpcReactClient.ado.exchange.getSaleInfo.useQuery({
      "contract-address": address,
      denom: denom.toLocaleLowerCase(),
    });

  return {
    isLoading,
    error,
    data: data,
  };
}

import { trpcReactClient } from "@/lib/trpc/client";

export default function useGetCW721(address: string) {
  const { data, isLoading, error } =
    trpcReactClient.ado.cw721.getContractInfo.useQuery({
      "contract-address": address,
    });

  const { data: minter } = trpcReactClient.ado.cw721.getMinter.useQuery({
    "contract-address": address,
  });

  // Converting assets to any and then to array to get proper typing at the end. It should be removed once type has been fixed in the library

  return {
    loading: isLoading,
    error,
    data: { ...data, minter: minter?.minter },
  };
}

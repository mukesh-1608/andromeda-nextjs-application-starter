import { CW721 } from "@/lib/andrjs/ados/cw721";
import { trpcReactClient } from "@/lib/trpc/client";

// Use to get list of all token id's
export const useGetAllTokenId = (
  chain: string,
  vehicleAddress: string,
  limit?: CW721.GetAllTokensLimit,
) => {
  const {
    data: allTokenId,
    isLoading,
    isError,
  } = trpcReactClient.ado.cw721.getAllTokenId.useQuery(
    {
      "chain-identifier": chain,
      "contract-address": vehicleAddress,
      limit,
    },
    { enabled: !!chain && !!vehicleAddress },
  );

  return { allTokenId, isLoading, isError };
};

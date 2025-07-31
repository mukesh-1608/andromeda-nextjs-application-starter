import { trpcReactClient } from "@/lib/trpc/client";

// Use to get sale information on the exchange
export const useGetSaleInfo = (
  chain: string,
  exchangeAddress: string,
  denom: string,
) => {
  const {
    data: saleInfo,
    isLoading,
    isError,
  } = trpcReactClient.ado.exchange.getSaleInfo.useQuery(
    {
      "chain-identifier": chain,
      "contract-address": exchangeAddress,
      denom: denom,
    },
    { enabled: !!chain && !!exchangeAddress && !!denom },
  );

  return { saleInfo, isLoading, isError };
};

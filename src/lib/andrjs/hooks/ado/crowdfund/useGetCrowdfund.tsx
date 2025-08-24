import { trpcReactClient } from "@/lib/trpc/client";
import { useAndromedaStore } from "@/zustand/andromeda";

export function useGetCrowdfund(adoAddress: string) {
  const { connectedChain } = useAndromedaStore();
  const { data, isLoading, error } =
    trpcReactClient.ado.crowdfund.getCampaignSummary.useQuery(
      {
        "chain-identifier": connectedChain ?? "",
        "contract-address": adoAddress,
      },
      {
        enabled: !!connectedChain,
      },
    );

  return {
    loading: isLoading,
    error,
    data: data,
  };
}
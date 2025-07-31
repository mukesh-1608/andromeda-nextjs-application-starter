import { trpcReactClient } from "@/lib/trpc/client";

export function useGetCrowdfund(adoAddress: string) {
  const { data, isLoading, error } =
    trpcReactClient.ado.crowdfund.getCampaignSummary.useQuery({
      "contract-address": adoAddress,
    });
  console.log(data);
  return {
    loading: isLoading,
    error,
    data: data,
  };
}

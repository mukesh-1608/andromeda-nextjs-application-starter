import { trpcReactClient } from "@/lib/trpc/client";

export default function useGetToken(contractAddress: string, tokenId: string) {
  const { data, isLoading, error } =
    trpcReactClient.ado.cw721.getTokenInfo.useQuery({
      "contract-address": contractAddress,
      tokenId: tokenId,
    });

  const { data: metadata } = trpcReactClient.ado.cw721.fetchTokenData.useQuery(
    {
      token_uri: data?.token_uri ?? "",
    },
    {
      enabled: !!data?.token_uri,
    },
  );
  return {
    loading: isLoading,
    error,
    data: data ? { ...data, metadata } : undefined,
  };
}

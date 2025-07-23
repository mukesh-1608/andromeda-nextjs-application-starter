import { trpcReactClient } from "@/lib/trpc/client";

// Use to fetch the token data
export const useFetchTokenData = (token_uri: string) => {
  const {
    data: tokenData,
    isLoading,
    isError,
  } = trpcReactClient.ado.cw721.fetchTokenData.useQuery(
    {
      token_uri: token_uri,
    },
    { enabled: !!token_uri },
  );

  return { tokenData, isLoading, isError };
};

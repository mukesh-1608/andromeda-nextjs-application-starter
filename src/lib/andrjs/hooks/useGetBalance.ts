import { coin, Coin } from "@cosmjs/proto-signing";
import { useEffect, useState } from "react";
import useAndromedaClient from "./useAndromedaClient";
import { useQuery } from "@tanstack/react-query";

/**
 * Queries the balance for a given address/denom asyncrhonously. If no address is provided the current Andromeda Client signer address is used.
 * @param denom
 * @param address
 * @returns
 */
export default function useGetBalance(denom: string, address?: string) {
  const client = useAndromedaClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["balance", denom, address],
    queryFn: async () => {
      if (!client) return;
      return await client.queryClient!.getBalance(address!, denom);
    },
    enabled: !!client && !!address,
  });
  return {
    balance: data ?? coin(0, denom),
    isLoading,
    error,
  };
}

import { RpcClient } from "@/lib/andrjs/rpc-client";

/**
 * Gets the campaign summary/state for a given crowdfund contract
 * @param rpcClient
 * @param contractAddress
 * @returns
 */
export async function getCampaignSummary(
  rpcClient: RpcClient,
  contractAddress: string,
) {
  // Manually create the correct query message, bypassing any broken helpers.
  const msg = { campaign_summary: {} };
  return rpcClient.queryContractSmart(contractAddress, msg);
}
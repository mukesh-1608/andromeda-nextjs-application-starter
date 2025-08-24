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
  // This is the correct query message for the crowdfund contract.
  const msg = { campaign_summary: {} };
  return rpcClient.queryContractSmart(contractAddress, msg);
}
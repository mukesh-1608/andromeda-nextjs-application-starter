import { RpcClient } from "@/lib/andrjs/rpc-client";
import { CROWDFUND } from "@/lib/andrjs/ados/crowdfund";

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
  const msg = CROWDFUND.getCampaignSummaryMsg();
  return rpcClient.queryContractSmart(contractAddress, msg);
}
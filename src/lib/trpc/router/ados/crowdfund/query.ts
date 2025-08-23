import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

/**
 * Gets the campaign summary/state for a given crowdfund contract
 * @param client
 * @param contractAddress
 * @returns
 */
export async function getCampaignSummary(
  client: CosmWasmClient,
  contractAddress: string,
) {
  // This has been fixed to manually create the correct query message,
  // bypassing the broken helper file in the starter project.
  const msg = { state: {} };
  return client.queryContractSmart(contractAddress, msg);
}

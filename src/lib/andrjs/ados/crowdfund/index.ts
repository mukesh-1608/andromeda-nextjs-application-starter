import { OrderBy } from "../types";
import { CrowdfundContractTsQueryMsgBuilder } from "./CrowdfundContractTs.message-builder";
import {
  CampaignSummaryResponse as CampaignSummaryResponseType,
  TiersResponse as TiersResponseType,
} from "./CrowdfundContractTs.types";

export namespace CROWDFUND {
  export interface TiersLimit {
    limit?: number;
    orderBy?: OrderBy;
    startAfter?: number;
  }

  export const getTiersLimit = (limit?: TiersLimit) => {
    return {
      limit: limit?.limit ?? 10,
      order_by: limit?.orderBy ?? "asc",
      start_after: limit?.startAfter ?? 0,
    };
  };

  export const getCampaignSummaryMsg =
    CrowdfundContractTsQueryMsgBuilder.campaignSummary;
  export type CampaignSummaryResponse = CampaignSummaryResponseType;

  export const getTiersMsg = CrowdfundContractTsQueryMsgBuilder.tiers;
  export type TiersResponse = TiersResponseType;
}

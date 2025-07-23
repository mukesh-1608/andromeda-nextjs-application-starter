import { ExchangeContractTsQueryMsgBuilder } from "./ExchangeContractTs.message-builder";
import {
  Asset,
  SaleAssetsResponse,
  SaleResponse,
} from "./ExchangeContractTs.types";

export namespace EXCHANGE {
  export const getDenomTypeFromString = (denom: string) => {
    if (denom.startsWith("native:")) {
      return {
        native_token: denom.replace("native:", ""),
      } as Asset;
    } else if (denom.startsWith("cw20:")) {
      return {
        cw20_token: denom.replace("cw20:", ""),
      } as Asset;
    }
    throw new Error("Invalid Type");
  };

  export const getSaleInfo = ExchangeContractTsQueryMsgBuilder.sale;
  export type GetSaleResponse = SaleResponse;

  export const getSaleAssets = ExchangeContractTsQueryMsgBuilder.saleAssets;
  export type GetSaleAssetsResponse = SaleAssetsResponse;

  interface PurchaseMsg {
    recipient: string;
  }

  export const purchaseMsg = (data: PurchaseMsg) => {
    return {
      purchase: {
        recipient: data.recipient,
      },
    };
  };
}

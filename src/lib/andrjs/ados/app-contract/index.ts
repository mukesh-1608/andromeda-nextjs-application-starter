import { AppContractContractTsQueryMsgBuilder } from "./AppContractContractTs.message-builder";
import {
  GetComponentsResponse as GetComponentsResponseType,
  GetAddressesWithNamesResponse as GetAddressesWithNamesResponseType,
} from "./AppContractContractTs.types";

export namespace APP_CONTRACT {
  export const getComponentsMsg =
    AppContractContractTsQueryMsgBuilder.getComponents;

  export type GetComponentsResponse = GetComponentsResponseType;

  export const getAddressesWithNamesMsg =
    AppContractContractTsQueryMsgBuilder.getAddressesWithNames;

  export type GetAddressesWithNamesResponse = GetAddressesWithNamesResponseType;
}

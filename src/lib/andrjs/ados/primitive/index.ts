import { PrimitiveContractTsQueryMsgBuilder } from "./PrimitiveContractTs.message-builder";
import { GetValueResponse, Primitive } from "./PrimitiveContractTs.types";

export namespace PRIMITIVE {
  export const isDecimal = (value: Primitive) => {
    return "decimal" in value;
  };

  export const isUint = (value: Primitive) => {
    return "uint128" in value;
  };

  export const isString = (value: Primitive) => {
    return "string" in value;
  };

  export const isBool = (value: Primitive) => {
    return "bool" in value;
  };

  export const isBinary = (value: Primitive) => {
    return "binary" in value;
  };

  export const isCoin = (value: Primitive) => {
    return "coin" in value;
  };

  export const isAddr = (value: Primitive) => {
    return "addr" in value;
  };

  export const getAllKeys = PrimitiveContractTsQueryMsgBuilder.allKeys;

  export type GetAllKeysResponse = string[];

  export const getValue = PrimitiveContractTsQueryMsgBuilder.getValue;

  export type GetValueResponseType = GetValueResponse;
}

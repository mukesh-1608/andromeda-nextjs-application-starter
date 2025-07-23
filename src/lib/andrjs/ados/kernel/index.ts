import { KernelContractTsQueryMsgBuilder } from "./KernelContractTs.message-builder";

export namespace KERNEL {
  export enum KernelKey {
    VFS = "vfs",
    ECONOMICS = "economics",
    ADODB = "adodb",
    IBC_REGISTRY = "ibc-registry",
  }

  export const keyAddressMsg = (key: KernelKey) => {
    return KernelContractTsQueryMsgBuilder.keyAddress({ key });
  };

  export type KeyAddressResponse = string;
}

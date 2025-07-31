import { AndrAddress, Milliseconds } from "@andromedaprotocol/andromeda.js";
import { Addr } from "@andromedaprotocol/andromeda.js/dist/api/codegen/AdodbContractTs.types";
import { Decimal, Expiry, Recipient } from "./types";
import { Coin } from "@cosmjs/amino";

export namespace BASE_ADO {
  export function owner() {
    return {
      owner: {},
    };
  }

  export interface OwnerResponse {
    owner: string;
  }

  export function ownershipRequest() {
    return {
      ownership_request: {},
    };
  }

  export interface OwnershipRequestResponse {
    expiration?: Milliseconds | null;
    potential_owner?: Addr | null;
  }

  export function type() {
    return {
      type: {},
    };
  }

  export interface TypeResponse {
    ado_type: string;
  }

  export function kernelAddress() {
    return {
      kernel_address: {},
    };
  }

  export interface KernelAddressResponse {
    kernel_address: Addr;
  }

  export function appContract() {
    return {
      app_contract: {},
    };
  }

  export interface AppContractResponse {
    app_contract: Addr;
  }

  export function originalPublisher() {
    return {
      original_publisher: {},
    };
  }

  export interface PublisherResponse {
    original_publisher: string;
  }

  export function blockHeightUponCreation() {
    return {
      block_height_upon_creation: {},
    };
  }

  export interface BlockHeightResponse {
    block_height: number;
  }

  export function version() {
    return {
      version: {},
    };
  }

  export interface VersionResponse {
    version: string;
  }

  export function aDOBaseVersion() {
    return {
      a_d_o_base_version: {},
    };
  }

  export interface ADOBaseVersionResponse {
    version: string;
  }

  export interface PermissionsQuery {
    actor: string;
    limit: number;
    start_after: string;
  }

  export function permissions(data: PermissionsQuery) {
    return {
      permissions: {
        actor: data.actor,
        limit: data.limit,
        start_after: data.start_after,
      },
    };
  }

  export type Permission =
    | {
        local: LocalPermission;
      }
    | {
        contract: AndrAddress;
      };
  export type LocalPermission =
    | {
        blacklisted: {
          expiration?: Expiry | null;
          start?: Expiry | null;
        };
      }
    | {
        limited: {
          expiration?: Expiry | null;
          start?: Expiry | null;
          uses: number;
        };
      }
    | {
        whitelisted: {
          expiration?: Expiry | null;
          start?: Expiry | null;
        };
      };

  export interface PermissionInfo {
    action: string;
    actor: string;
    permission: Permission;
  }

  export interface ArrayOfPermissionInfo {
    permissions: PermissionInfo[];
  }

  export function permissionedActions() {
    return {
      permissioned_actions: {},
    };
  }

  export interface ArrayOfString {
    actions: string[];
  }

  export type Rate =
    | {
        local: LocalRate;
      }
    | {
        contract: AndrAddress;
      };

  export interface LocalRate {
    description?: string | null;
    rate_type: LocalRateType;
    recipient: Recipient;
    value: LocalRateValue;
  }
  export interface PercentRate {
    percent: Decimal;
  }
  export type LocalRateType = "additive" | "deductive";
  export type LocalRateValue =
    | {
        percent: PercentRate;
      }
    | {
        flat: Coin;
      };

  export const ratesMsg = (action: string) => {
    return {
      rates: {
        action: action,
      },
    };
  };

  export type RateResponse = Rate | null;

  export const allRatesMsg = () => {
    return {
      all_rates: {},
    };
  };

  export interface AllRatesResponse {
    all_rates: [string, Rate][];
  }
}

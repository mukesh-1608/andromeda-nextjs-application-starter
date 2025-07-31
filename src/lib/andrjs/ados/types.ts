import { AndrAddress, Milliseconds } from "@andromedaprotocol/andromeda.js";

export type Uint128 = string;

export type Expiry =
  | {
      from_now: Milliseconds;
    }
  | {
      at_time: Milliseconds;
    };

export type Asset =
  | {
      cw20_token: AndrAddress;
    }
  | {
      native_token: string;
    };

export type Binary = string;

export interface Recipient {
  address: AndrAddress;
  ibc_recovery_address?: AndrAddress | null;
  msg?: Binary | null;
}

export type OrderBy = "asc" | "desc";

export type Decimal = string;

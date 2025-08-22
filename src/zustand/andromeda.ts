"use client";
import { HttpBatchClient } from "@/lib/andrjs/rpc-client";
import { trpcStandaloneClient } from "@/lib/trpc/client";
import createClient, {
  ChainClient,
} from "@andromedaprotocol/andromeda.js/dist/clients";
import { GasPrice } from "@cosmjs/stargate/build/fee";
import type { AccountData, Keplr } from "@keplr-wallet/types";
import { create } from "zustand";

export enum KeplrConnectionStatus {
  Ok,
  NotInstalled,
  Connecting,
}

export interface IAndromedaStore {
  client?: ChainClient;
  connectedChain?: string;
  isConnected: boolean;
  keplr: Keplr | undefined;
  keplrStatus: KeplrConnectionStatus;
  accounts: Readonly<AccountData[]>;
  autoconnect: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

export const useAndromedaStore = create<IAndromedaStore>((set, get) => ({
  client: undefined,
  connectedChain: process.env.NEXT_PUBLIC_CHAIN_IDENTIFIER,
  isConnected: false,
  keplr: undefined,
  accounts: [],
  keplrStatus: KeplrConnectionStatus.NotInstalled,
  autoconnect: false,
  isLoading: false,
  isInitialized: false,
}));

export const resetAndromedaStore = () => {
  useAndromedaStore.setState({
    client: undefined,
    isConnected: false,
    connectedChain: undefined,
    accounts: [],
    autoconnect: false,
    isLoading: false,
  });
};

export const KEPLR_AUTOCONNECT_KEY = "keplr_autoconnect";

export const connectAndromedaClient = async (chainIdentifier: string) => {
  try {
    window.addEventListener("keplr_keystorechange", keplrKeystoreChange);

    const state = useAndromedaStore.getState();
    if (state.isLoading) return;
    useAndromedaStore.setState({ isLoading: true });
    const config = await trpcStandaloneClient.chainConfig.byIdentifier.query({
      "chain-identifier": chainIdentifier,
    });
    const keplr = state.keplr;
    if (!keplr) throw new Error("Keplr not instantiated yet");

    keplr.defaultOptions = {
      sign: {
        preferNoSetFee: true,
      },
    };
    try {
      await keplr.enable(config.chainId);
    } catch (err) {
      console.warn("Failed to enable chain, suggesting it to Keplr...", err);
      const keplrConfig =
        await trpcStandaloneClient.chainConfig.keplrConfig.query({
          chainId: config.chainId,
        });
      await keplr.experimentalSuggestChain(keplrConfig);
    }

    const signer = await keplr.getOfflineSignerAuto(config.chainId);
    const accounts = await signer.getAccounts();

    const client = createClient(config.addressPrefix);
    const batchClient = new HttpBatchClient(config.chainUrl, {
      batchSizeLimit: 10,
      dispatchInterval: 500,
    });
    await client.connect(batchClient, signer as any, {
      gasPrice: GasPrice.fromString(config.defaultFee),
    });
    localStorage.setItem(KEPLR_AUTOCONNECT_KEY, keplr?.mode ?? "extension");

    useAndromedaStore.setState({
      connectedChain: chainIdentifier,
      accounts,
      isConnected: true,
      keplr: keplr,
      keplrStatus: KeplrConnectionStatus.Ok,
      autoconnect: true,
      isLoading: false,
      client: client,
    });
  } catch (err) {
    console.error("Failed to connect Andromeda client:", err);
    useAndromedaStore.setState({ isLoading: false, autoconnect: false });
    throw err;
  } finally {
    useAndromedaStore.setState({ isInitialized: true });
  }
};

export const disconnectAndromedaClient = () => {
  window.removeEventListener("keplr_keystorechange", keplrKeystoreChange);
  localStorage.removeItem(KEPLR_AUTOCONNECT_KEY);
  resetAndromedaStore();
};

const keplrKeystoreChange = async () => {
  const state = useAndromedaStore.getState();
  if (state.autoconnect && state.connectedChain) {
    await connectAndromedaClient(state.connectedChain);
  }
};

export function initiateKeplr() {
  if (window.keplr) {
    useAndromedaStore.setState({
      keplrStatus: KeplrConnectionStatus.Ok,
      keplr: window.keplr,
    });
    return;
  }
  if (document.readyState === "complete") {
    useAndromedaStore.setState({
      keplrStatus: KeplrConnectionStatus.NotInstalled,
      keplr: undefined,
    });
    return;
  }
  useAndromedaStore.setState({ keplrStatus: KeplrConnectionStatus.Connecting });
  const documentStateChange = (event: Event) => {
    if (event.target && (event.target as Document).readyState === "complete") {
      if (window.keplr) {
        useAndromedaStore.setState({
          keplrStatus: KeplrConnectionStatus.Ok,
          keplr: window.keplr,
        });
      } else {
        useAndromedaStore.setState({
          keplrStatus: KeplrConnectionStatus.NotInstalled,
          keplr: undefined,
        });
      }
      document.removeEventListener("readystatechange", documentStateChange);
    }
  };
  document.addEventListener("readystatechange", documentStateChange);
}

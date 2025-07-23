"use client";

import GridBackground from "@/components/GridBackground";
import { useChainConfig } from "@/lib/andrjs/hooks/useChainConfig";
import { useAndromedaStore } from "@/zustand/andromeda";
import React from "react";
import { ConnectWallet } from "../wallet";
import Image from "next/image";

interface Props {}

const LandingPage: React.FC<Props> = (props) => {
  const { data, isLoading } = useChainConfig(
    process.env.NEXT_PUBLIC_CHAIN_IDENTIFIER || "",
  );
  return (
    <GridBackground>
      <div className="flex flex-col min-h-screen items-center justify-center gap-4">
        <Image
          src="/logo.png"
          className="w-30"
          alt="logo"
          width={100}
          height={100}
        />
        <p className="text-4xl font-bold">Andromeda Nextjs Starter Template</p>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <p>
            Click the button to connect to <b>{data?.displayName}</b>.
          </p>
        )}
        <p className="font-light">
          Learn more about Andromeda&nbsp;
          <a
            className="text-blue-500 underline"
            href="https://docs.andromedaprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
        </p>
        <ConnectWallet />
      </div>
    </GridBackground>
  );
};

export default LandingPage;

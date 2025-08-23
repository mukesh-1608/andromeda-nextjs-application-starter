'use client';

import { ConnectWallet } from "@/modules/wallet";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="LiveStocX Logo" width={32} height={32} />
          <span className="text-white text-xl font-bold">LiveStocX</span>
        </Link>
        <ConnectWallet />
      </nav>
    </header>
  );
};

export default Header;

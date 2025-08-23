import React, { ReactNode } from "react";
import "@/styles/globals.css";
import Providers from "./providers";
import { Metadata } from "next";
import PoweredByLogo from "@/modules/ui/PoweredByLogo";
import Header from "@/components/Header"; // Import the new Header

export const metadata: Metadata = {
  title: {
    default: "Andromeda Nextjs Starter",
    template: "%s | App Name",
  },
};

interface Props {
  children?: ReactNode;
}

const RootLayout = async (props: Props) => {
  const { children } = props;

  return (
    <html lang="en">
      <body className="dark bg-black">
        <Providers>
          <Header /> {/* Add the Header here */}
          <main className="pt-20"> {/* Add padding to main content to avoid overlap */}
            {children}
          </main>
          <PoweredByLogo />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;

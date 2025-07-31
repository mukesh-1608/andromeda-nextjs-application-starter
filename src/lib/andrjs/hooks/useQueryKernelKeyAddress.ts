import { KERNEL } from "@/lib/andrjs/ados/kernel";
import { trpcReactClient } from "@/lib/trpc/client";
import { useAndromedaStore } from "@/zustand/andromeda";

export const useQueryKernelKeyAddress = (key: KERNEL.KernelKey) => {
  const connectedChain = useAndromedaStore((state) => state.connectedChain);
  const result = trpcReactClient.os.kernel.keyAddress.useQuery(
    { key, "chain-identifier": connectedChain || "" },
    { enabled: !!connectedChain },
  );
  return result;
};

import { QueryClient } from "@tanstack/react-query";
import {
  createTRPCProxyClient,
  httpBatchLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from ".";
import superjson from "superjson";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpcReactClient = createTRPCReact<AppRouter>();

// Correctly configure the standalone client with the transformer inside the link
export const trpcStandaloneClient = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    httpBatchLink({
      url: getBaseUrl() + "/api/trpc",
      transformer: superjson, // Transformer goes here
    }),
  ],
});

// Correctly configure the main client with the transformer inside the link
export const createTRPCClient = () =>
  trpcReactClient.createClient({
    links: [
      loggerLink({
        enabled: (op) =>
          process.env.NODE_ENV === "development" ||
          (op.direction === "down" && op.result instanceof Error),
      }),
      httpBatchLink({
        url: getBaseUrl() + `/api/trpc`,
        transformer: superjson, // Transformer goes here
      }),
    ],
  });

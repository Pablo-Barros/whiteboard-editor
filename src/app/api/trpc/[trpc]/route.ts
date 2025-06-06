import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req: req as unknown as Request,
    createContext: () => createTRPCContext({ req }),
    onError: ({ error, path }: { error: Error; path?: string }) => {
      console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
    },
  });

export { handler as GET, handler as POST };

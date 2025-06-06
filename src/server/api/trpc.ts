import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import { prisma } from "../db";

type CreateContextOptions = {
  // Add any context properties here (e.g., authentication)
  req?: Request | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    prisma,
    ...opts,
  };
};

export const createTRPCContext = (opts: { req: Request } | { req: null }) => {
  return createInnerTRPCContext({
    req: opts.req,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

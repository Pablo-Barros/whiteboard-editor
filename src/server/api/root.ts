import { createTRPCRouter } from "./trpc";
import { whiteboardRouter } from "./routers/whiteboard";

export const appRouter = createTRPCRouter({
  whiteboard: whiteboardRouter,
});

export type AppRouter = typeof appRouter;

type RouterInput = {
  [K in keyof AppRouter]: AppRouter[K] extends { _def: { procedures: infer P } }
    ? {
        [K2 in keyof P]: P[K2] extends { _def: { _input: infer I } } ? I : never;
      }
    : never;
};

type RouterOutput = {
  [K in keyof AppRouter]: AppRouter[K] extends { _def: { procedures: infer P } }
    ? {
        [K2 in keyof P]: P[K2] extends { _def: { _output: infer O } } ? O : never;
      }
    : never;
};

export type RouterInputs = {
  [K in keyof RouterInput]: RouterInput[K];
};

export type RouterOutputs = {
  [K in keyof RouterOutput]: RouterOutput[K];
};

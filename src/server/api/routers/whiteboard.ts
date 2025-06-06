import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

// Define the shape of the whiteboard content
type WhiteboardContent = {
  shapes: Record<string, unknown>;
  bindings: Record<string, unknown>;
  assets: Record<string, unknown>;
};

type WhiteboardData = {
  id: string;
  content: WhiteboardContent | string; // Can be either parsed or stringified
  createdAt: Date;
  updatedAt: Date;
};

export const whiteboardRouter = createTRPCRouter({
  // Get whiteboard by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }): Promise<WhiteboardData | null> => {
      const whiteboard = await ctx.prisma.whiteboard.findUnique({
        where: { id: input.id },
      });

      if (!whiteboard) {
        return null;
      }

      // Parse the content if it's a string, otherwise use as is
      const content = typeof whiteboard.content === 'string'
        ? JSON.parse(whiteboard.content)
        : whiteboard.content;

      return {
        id: whiteboard.id,
        content,
        createdAt: whiteboard.createdAt,
        updatedAt: whiteboard.updatedAt,
      };
    }),

  // Create a new whiteboard
  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.record(z.unknown()).or(z.string()),
      })
    )
    .mutation(async ({ ctx, input }): Promise<WhiteboardData> => {
      const content = typeof input.content === 'string' 
        ? input.content 
        : JSON.stringify(input.content);
        
      const whiteboard = await ctx.prisma.whiteboard.create({
        data: {
          id: input.id,
          content,
        },
      });

      return {
        ...whiteboard,
        content: JSON.parse(whiteboard.content) as WhiteboardContent,
      };
    }),

  // Update an existing whiteboard
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.record(z.unknown()).or(z.string()),
      })
    )
    .mutation(async ({ ctx, input }): Promise<WhiteboardData> => {
      const content = typeof input.content === 'string'
        ? input.content
        : JSON.stringify(input.content);
        
      const whiteboard = await ctx.prisma.whiteboard.upsert({
        where: { id: input.id },
        update: { 
          content,
          updatedAt: new Date(),
        },
        create: {
          id: input.id,
          content,
        },
      });

      return {
        ...whiteboard,
        content: JSON.parse(whiteboard.content) as WhiteboardContent,
      };
    }),
});

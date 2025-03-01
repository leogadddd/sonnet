import { DataModel } from "../../convex/_generated/dataModel";
import { clsx, type ClassValue } from "clsx"
import { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface GetUserArgs {
  ctx: GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>;
  args?: any;
}

export async function getUser({ ctx, args }: GetUserArgs) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }

  const userId = identity.subject;

  return userId;
}

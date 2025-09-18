import { logger } from "@/library/logger";

interface WithErrorOptions {
  cid: string;
  context: string;
}

export async function withError<T>(
  fn: () => Promise<T>,
  opts: WithErrorOptions
): Promise<T | null> {
  try {
    return await fn();
  } catch (err: any) {
    logger.error(`${opts.context}.failed`, {
      cid: opts.cid,
      err: err?.message || "unknown error",
    });
    return null;
  }
}

import { logEnvWarnings } from "./src/lib/env";
import { logger } from "./src/lib/logger";

export function register() {
  logger.ok("application starting", {
    version: process.env.APP_VERSION || "0.1.0",
    node: process.version,
    env: process.env.NODE_ENV,
  });
  logEnvWarnings();
}

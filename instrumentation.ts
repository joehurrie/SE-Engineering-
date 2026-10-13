import { validateServerEnvironment } from "./lib/env";

export function register(): void {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    validateServerEnvironment();
  }
}
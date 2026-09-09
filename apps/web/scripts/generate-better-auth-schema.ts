/**
 * Generate Better Auth Prisma schema from `src/lib/auth.cli.ts`.
 *
 * Compare output against packages/database/src/prisma/contract.prisma before migrating.
 *
 * Requires: Node.js 22.12+ (Better Auth CLI). Prefer `bun run auth:schema`.
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "bun";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(webRoot, "src/lib/auth.cli.ts");
const outputPath = resolve(
  webRoot,
  "../../packages/database/tmp/better-auth.generated.prisma",
);

mkdirSync(dirname(outputPath), { recursive: true });

const proc = spawn(
  [
    "bun",
    "x",
    "auth@1.7.3",
    "generate",
    "--config",
    configPath,
    "--output",
    outputPath,
    "--yes",
  ],
  {
    cwd: webRoot,
    env: {
      ...process.env,
      // Avoid loading real secrets; CLI only needs schema-shaped config.
      NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    },
    stderr: "inherit",
    stdout: "inherit",
  },
);

const exitCode = await proc.exited;
if (exitCode !== 0) {
  throw new Error(`auth generate failed with exit code ${exitCode}`);
}

console.log(`
Wrote: ${outputPath}

Next:
1. Diff against packages/database/src/prisma/contract.prisma (User/Session/Account/Verification/Organization/Member/Invitation)
2. If auth.ts schema-affecting options changed, update src/lib/auth.cli.ts too
3. Apply real migrations via prisma-cli — do not commit generated file unless you want it as a reference artifact
`);

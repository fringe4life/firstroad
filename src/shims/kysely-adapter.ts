"use client";

const unsupportedAdapter = () => {
  throw new Error("Kysely adapter is disabled in this build.");
};

const createKyselyAdapter = () => unsupportedAdapter();
const getKyselyDatabaseType = () => "unsupported";
const shim = {};

export {
  createKyselyAdapter,
  getKyselyDatabaseType,
  unsupportedAdapter as kyselyAdapter,
};
export default shim;

// webpack: (config, { dev }) => {
//   // Only apply custom webpack config for production builds
//   // This allows Turbopack to be used in development
//   if (dev) {
//     return config;
//   }

//   // Shim kysely adapter to prevent node:sqlite import errors during build
//   // Required because better-auth bundles kysely as a hard dependency even when using /minimal
//   config.resolve ??= {};
//   config.resolve.alias ??= {};
//   const kyselyShimPath = path.resolve(
//     __dirname,
//     "src/shims/kysely-adapter.ts",
//   );
//   config.resolve.alias["node:sqlite"] = false;
//   config.resolve.alias["@better-auth/kysely-adapter"] = kyselyShimPath;
//   config.resolve.alias["better-auth/dist/db/adapter-kysely.mjs"] =
//     kyselyShimPath;
//   config.resolve.alias["better-auth/dist/adapters/kysely-adapter/index.mjs"] =
//     kyselyShimPath;
//   return config;
// },

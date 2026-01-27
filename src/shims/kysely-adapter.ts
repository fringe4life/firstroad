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

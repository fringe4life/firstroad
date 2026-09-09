#!/usr/bin/env -S node
import { Migration, MigrationCLI } from "@prisma/orm-postgres/migration";
import type { Contract as Start } from "../../snapshots/6dd62789a101cc6d5909fc000b905befd3d6522e2096449e0866f81ff18dbe0e/contract";
import startContract from "../../snapshots/6dd62789a101cc6d5909fc000b905befd3d6522e2096449e0866f81ff18dbe0e/contract.json" with {
  type: "json",
};
import type { Contract as End } from "../../snapshots/25ca8e31a86efb2e9f400bb46263b6da292cccd48703fee63b598bd08ba477c6/contract";
import endContract from "../../snapshots/25ca8e31a86efb2e9f400bb46263b6da292cccd48703fee63b598bd08ba477c6/contract.json" with {
  type: "json",
};

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropConstraint({
        constraint: "account_issuer_accountId_uidx",
        schema: "public",
        table: "account",
      }),
      this.dropColumn({ column: "issuer", schema: "public", table: "account" }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);

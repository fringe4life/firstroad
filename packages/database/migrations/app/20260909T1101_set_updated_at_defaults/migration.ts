#!/usr/bin/env -S node
import { Migration, MigrationCLI } from "@prisma/orm-postgres/migration";
import type { Contract as End } from "../../snapshots/6dd62789a101cc6d5909fc000b905befd3d6522e2096449e0866f81ff18dbe0e/contract";
import endContract from "../../snapshots/6dd62789a101cc6d5909fc000b905befd3d6522e2096449e0866f81ff18dbe0e/contract.json" with {
  type: "json",
};
import type { Contract as Start } from "../../snapshots/27b2e2866907dfd6e0ca7a20d941b80d319f842a8a8fae9d8d85ffd980dde8de/contract";
import startContract from "../../snapshots/27b2e2866907dfd6e0ca7a20d941b80d319f842a8a8fae9d8d85ffd980dde8de/contract.json" with {
  type: "json",
};

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.setDefault({
        column: "updatedAt",
        defaultSql: "DEFAULT (now())",
        schema: "public",
        table: "account",
      }),
      this.setDefault({
        column: "updatedAt",
        defaultSql: "DEFAULT (now())",
        schema: "public",
        table: "comment",
      }),
      this.setDefault({
        column: "updatedAt",
        defaultSql: "DEFAULT (now())",
        schema: "public",
        table: "session",
      }),
      this.setDefault({
        column: "updatedAt",
        defaultSql: "DEFAULT (now())",
        schema: "public",
        table: "ticket",
      }),
      this.setDefault({
        column: "updatedAt",
        defaultSql: "DEFAULT (now())",
        schema: "public",
        table: "user",
      }),
      this.setDefault({
        column: "updatedAt",
        defaultSql: "DEFAULT (now())",
        schema: "public",
        table: "verification",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);

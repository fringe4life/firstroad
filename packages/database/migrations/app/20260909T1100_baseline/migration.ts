#!/usr/bin/env -S node
import {
  checkExpression,
  col,
  fn,
  lit,
  Migration,
  MigrationCLI,
  primaryKey,
} from "@prisma/orm-postgres/migration";
import type { Contract as End } from "../../snapshots/27b2e2866907dfd6e0ca7a20d941b80d319f842a8a8fae9d8d85ffd980dde8de/contract";
import endContract from "../../snapshots/27b2e2866907dfd6e0ca7a20d941b80d319f842a8a8fae9d8d85ffd980dde8de/contract.json" with {
  type: "json",
};

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: "public" }),
      this.createTable({
        columns: [
          col("accessToken", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("accessTokenExpiresAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
          }),
          col("accountId", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("createdAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            default: fn("now()"),
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("idToken", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("issuer", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("password", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("providerId", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("refreshToken", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("refreshTokenExpiresAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
          }),
          col("scope", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("updatedAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            notNull: true,
          }),
          col("userId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
        ],
        constraints: [primaryKey(["id"])],
        schema: "public",
        table: "account",
      }),
      this.createTable({
        columns: [
          col("content", "character varying(1024)", {
            codecRef: {
              codecId: "sql/varchar@1",
              typeParams: { length: 1024 },
            },
            notNull: true,
          }),
          col("createdAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            default: fn("now()"),
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("ticketId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("updatedAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            notNull: true,
          }),
          col("userId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
        ],
        constraints: [primaryKey(["id"])],
        schema: "public",
        table: "comment",
      }),
      this.createTable({
        columns: [
          col("commentId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("contentType", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("name", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
        ],
        constraints: [primaryKey(["id"])],
        schema: "public",
        table: "comment_attachment",
      }),
      this.createTable({
        columns: [
          col("createdAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            default: fn("now()"),
            notNull: true,
          }),
          col("email", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("expiresAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("inviterId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("organizationId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("role", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("status", "text", {
            codecRef: { codecId: "pg/text@1" },
            default: lit("pending"),
            notNull: true,
          }),
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "invitation_role_check_7f9f6ca4",
            "\"role\" IN ('owner', 'admin', 'member')",
          ),
        ],
        schema: "public",
        table: "invitation",
      }),
      this.createTable({
        columns: [
          col("createdAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            default: fn("now()"),
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("organizationId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("role", "text", {
            codecRef: { codecId: "pg/text@1" },
            default: lit("member"),
            notNull: true,
          }),
          col("userId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "member_role_check_7f9f6ca4",
            "\"role\" IN ('owner', 'admin', 'member')",
          ),
        ],
        schema: "public",
        table: "member",
      }),
      this.createTable({
        columns: [
          col("canCreate", "bool", {
            codecRef: { codecId: "pg/bool@1" },
            default: lit(true),
            notNull: true,
          }),
          col("canDelete", "bool", {
            codecRef: { codecId: "pg/bool@1" },
            default: lit(true),
            notNull: true,
          }),
          col("canUpdate", "bool", {
            codecRef: { codecId: "pg/bool@1" },
            default: lit(true),
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("memberId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("resourceType", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "member_permission_resourceType_check_1a9bee1a",
            "\"resourceType\" IN ('TICKET', 'COMMENT')",
          ),
        ],
        schema: "public",
        table: "member_permission",
      }),
      this.createTable({
        columns: [
          col("createdAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            default: fn("now()"),
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("logo", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("metadata", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("name", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("slug", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
        ],
        constraints: [primaryKey(["id"])],
        schema: "public",
        table: "organization",
      }),
      this.createTable({
        columns: [
          col("activeOrganizationId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
          }),
          col("createdAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            default: fn("now()"),
            notNull: true,
          }),
          col("expiresAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("ipAddress", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("token", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("updatedAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            notNull: true,
          }),
          col("userAgent", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("userId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
        ],
        constraints: [primaryKey(["id"])],
        schema: "public",
        table: "session",
      }),
      this.createTable({
        columns: [
          col("bounty", "int4", {
            codecRef: { codecId: "pg/int4@1" },
            notNull: true,
          }),
          col("createdAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            default: fn("now()"),
            notNull: true,
          }),
          col("deadline", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            notNull: true,
          }),
          col("description", "text", {
            codecRef: { codecId: "pg/text@1" },
            default: lit("No description provided"),
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("organizationId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("slug", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("status", "text", {
            codecRef: { codecId: "pg/text@1" },
            default: lit("OPEN"),
            notNull: true,
          }),
          col("title", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("updatedAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            notNull: true,
          }),
          col("userId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "ticket_status_check_21bcd8dd",
            "\"status\" IN ('OPEN', 'IN_PROGRESS', 'DONE')",
          ),
        ],
        schema: "public",
        table: "ticket",
      }),
      this.createTable({
        columns: [
          col("contentType", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("name", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("ticketId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
        ],
        constraints: [primaryKey(["id"])],
        schema: "public",
        table: "ticket_attachment",
      }),
      this.createTable({
        columns: [
          col("fromId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("toId", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
        ],
        constraints: [primaryKey(["fromId", "toId"])],
        schema: "public",
        table: "ticket_reference",
      }),
      this.createTable({
        columns: [
          col("createdAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            default: fn("now()"),
            notNull: true,
          }),
          col("email", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("emailVerified", "bool", {
            codecRef: { codecId: "pg/bool@1" },
            default: lit(false),
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("image", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("name", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("updatedAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            notNull: true,
          }),
        ],
        constraints: [primaryKey(["id"])],
        schema: "public",
        table: "user",
      }),
      this.createTable({
        columns: [
          col("createdAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            default: fn("now()"),
            notNull: true,
          }),
          col("expiresAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            notNull: true,
          }),
          col("id", "uuid", {
            codecRef: { codecId: "pg/uuid@1" },
            notNull: true,
          }),
          col("identifier", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
          col("updatedAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz@1" },
            notNull: true,
          }),
          col("value", "text", {
            codecRef: { codecId: "pg/text@1" },
            notNull: true,
          }),
        ],
        constraints: [primaryKey(["id"])],
        schema: "public",
        table: "verification",
      }),
      this.addUnique({
        columns: ["issuer", "accountId"],
        constraint: "account_issuer_accountId_uidx",
        schema: "public",
        table: "account",
      }),
      this.addUnique({
        columns: ["memberId", "resourceType"],
        constraint: "member_permission_memberId_resourceType_key",
        schema: "public",
        table: "member_permission",
      }),
      this.addUnique({
        columns: ["slug"],
        constraint: "organization_slug_key",
        schema: "public",
        table: "organization",
      }),
      this.addUnique({
        columns: ["token"],
        constraint: "session_token_key",
        schema: "public",
        table: "session",
      }),
      this.addUnique({
        columns: ["title"],
        constraint: "ticket_title_key",
        schema: "public",
        table: "ticket",
      }),
      this.addUnique({
        columns: ["slug"],
        constraint: "ticket_slug_key",
        schema: "public",
        table: "ticket",
      }),
      this.addUnique({
        columns: ["email"],
        constraint: "user_email_key",
        schema: "public",
        table: "user",
      }),
      this.createIndex({
        columns: ["userId"],
        index: "account_userId_idx_a489d58a",
        schema: "public",
        table: "account",
      }),
      this.createIndex({
        columns: ["id", "createdAt"],
        index: "comment_id_createdAt_4fe8cc1c",
        schema: "public",
        table: "comment",
      }),
      this.createIndex({
        columns: ["ticketId"],
        index: "comment_ticketId_idx_2fe526c3",
        schema: "public",
        table: "comment",
      }),
      this.createIndex({
        columns: ["userId"],
        index: "comment_userId_idx_a489d58a",
        schema: "public",
        table: "comment",
      }),
      this.createIndex({
        columns: ["commentId"],
        index: "comment_attachment_commentId_idx_b5a4f615",
        schema: "public",
        table: "comment_attachment",
      }),
      this.createIndex({
        columns: ["email"],
        index: "invitation_email_idx_46df9cad",
        schema: "public",
        table: "invitation",
      }),
      this.createIndex({
        columns: ["inviterId"],
        index: "invitation_inviterId_idx_c2d8c6d6",
        schema: "public",
        table: "invitation",
      }),
      this.createIndex({
        columns: ["organizationId", "createdAt"],
        extras: { where: "(status = 'pending')" },
        index: "invitation_org_pending_fb3a33bc",
        schema: "public",
        table: "invitation",
      }),
      this.createIndex({
        columns: ["organizationId"],
        index: "invitation_organizationId_idx_2e17ef41",
        schema: "public",
        table: "invitation",
      }),
      this.createIndex({
        columns: ["organizationId"],
        index: "member_organizationId_idx_2e17ef41",
        schema: "public",
        table: "member",
      }),
      this.createIndex({
        columns: ["userId"],
        index: "member_userId_idx_a489d58a",
        schema: "public",
        table: "member",
      }),
      this.createIndex({
        columns: ["memberId"],
        index: "member_permission_memberId_idx_76b3c263",
        schema: "public",
        table: "member_permission",
      }),
      this.createIndex({
        columns: ["userId"],
        index: "session_userId_idx_a489d58a",
        schema: "public",
        table: "session",
      }),
      this.createIndex({
        columns: ["organizationId"],
        index: "ticket_organizationId_idx_2e17ef41",
        schema: "public",
        table: "ticket",
      }),
      this.createIndex({
        columns: ["userId"],
        index: "ticket_userId_idx_a489d58a",
        schema: "public",
        table: "ticket",
      }),
      this.createIndex({
        columns: ["ticketId"],
        index: "ticket_attachment_ticketId_idx_2fe526c3",
        schema: "public",
        table: "ticket_attachment",
      }),
      this.createIndex({
        columns: ["fromId"],
        index: "ticket_reference_fromId_idx_932a1cba",
        schema: "public",
        table: "ticket_reference",
      }),
      this.createIndex({
        columns: ["toId"],
        index: "ticket_reference_toId_idx_7522c47c",
        schema: "public",
        table: "ticket_reference",
      }),
      this.createIndex({
        columns: ["identifier"],
        index: "verification_identifier_idx_79a0dbb3",
        schema: "public",
        table: "verification",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["userId"],
          name: "account_userId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "user" },
        },
        schema: "public",
        table: "account",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["ticketId"],
          name: "comment_ticketId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "ticket" },
        },
        schema: "public",
        table: "comment",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["userId"],
          name: "comment_userId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "user" },
        },
        schema: "public",
        table: "comment",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["commentId"],
          name: "comment_attachment_commentId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "comment" },
        },
        schema: "public",
        table: "comment_attachment",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["organizationId"],
          name: "invitation_organizationId_fkey",
          onDelete: "cascade",
          references: {
            columns: ["id"],
            schema: "public",
            table: "organization",
          },
        },
        schema: "public",
        table: "invitation",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["inviterId"],
          name: "invitation_inviterId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "user" },
        },
        schema: "public",
        table: "invitation",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["organizationId"],
          name: "member_organizationId_fkey",
          onDelete: "cascade",
          references: {
            columns: ["id"],
            schema: "public",
            table: "organization",
          },
        },
        schema: "public",
        table: "member",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["userId"],
          name: "member_userId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "user" },
        },
        schema: "public",
        table: "member",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["memberId"],
          name: "member_permission_memberId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "member" },
        },
        schema: "public",
        table: "member_permission",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["userId"],
          name: "session_userId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "user" },
        },
        schema: "public",
        table: "session",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["userId"],
          name: "ticket_userId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "user" },
        },
        schema: "public",
        table: "ticket",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["organizationId"],
          name: "ticket_organizationId_fkey",
          onDelete: "cascade",
          references: {
            columns: ["id"],
            schema: "public",
            table: "organization",
          },
        },
        schema: "public",
        table: "ticket",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["ticketId"],
          name: "ticket_attachment_ticketId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "ticket" },
        },
        schema: "public",
        table: "ticket_attachment",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["fromId"],
          name: "ticket_reference_fromId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "ticket" },
        },
        schema: "public",
        table: "ticket_reference",
      }),
      this.addForeignKey({
        foreignKey: {
          columns: ["toId"],
          name: "ticket_reference_toId_fkey",
          onDelete: "cascade",
          references: { columns: ["id"], schema: "public", table: "ticket" },
        },
        schema: "public",
        table: "ticket_reference",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);

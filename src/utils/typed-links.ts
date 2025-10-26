import type { Route } from "next";
import {
  type CreateSerializerOptions,
  createSerializer,
  type ParserMap,
  parseAsStringLiteral,
} from "nuqs/server";

/**
 * Creates type-safe links that combine Next.js Route types with nuqs search parameter type safety.
 * This ensures that navigation links are fully typed and validated at compile time.
 */
export function createTypedLink<Parsers extends ParserMap>(
  route: Route,
  parsers: Parsers,
  options: CreateSerializerOptions<Parsers> = {},
) {
  const serialize = createSerializer<Parsers, Route, Route>(parsers, options);
  return serialize.bind(null, route);
}

/**
 * Type-safe link creator specifically for ticket scope navigation.
 * Provides compile-time safety for scope parameter values.
 */
export const createTicketScopeLink = (route: Route) =>
  createTypedLink(route, {
    scope: parseAsStringLiteral(["all", "mine"]).withDefault("mine"),
  });

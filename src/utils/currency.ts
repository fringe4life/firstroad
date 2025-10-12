import { MyBig } from "@/lib/big";

const CENTS_PER_DOLLAR = 100;
const DECIMAL_PLACES = 2;

export const toCent = (amount: number) =>
  MyBig(amount).mul(CENTS_PER_DOLLAR).round(DECIMAL_PLACES).toNumber();

export const fromCent = (amount: number) =>
  MyBig(amount).div(CENTS_PER_DOLLAR).round(DECIMAL_PLACES).toNumber();

export const toCurrencyFromCent = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(fromCent(amount));

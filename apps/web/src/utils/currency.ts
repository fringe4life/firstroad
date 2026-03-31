import { MyBig } from "@/lib/big";

const CENTS_PER_DOLLAR = 100;
const DECIMAL_PLACES = 2;

const FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
export const toCent = (amount: number) =>
  MyBig(amount).mul(CENTS_PER_DOLLAR).round(DECIMAL_PLACES).toNumber();

export const fromCent = (amount: number) =>
  MyBig(amount).div(CENTS_PER_DOLLAR).round(DECIMAL_PLACES).toNumber();

export const toCurrencyFromCent = (amount: number) =>
  FORMATTER.format(fromCent(amount));

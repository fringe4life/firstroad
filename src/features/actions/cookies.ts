"use server";

import { cookies } from "next/headers";

export const setCookieByKey = async (key: string, value: string) => {
  (await cookies()).set(key, value);
};

export const getCookieByKey = async (key: string) => {
  const cookie = (await cookies()).get(key);

  if (!cookie) return null;

  return cookie.value;
};

export const deleteCookieByKey = async (key: string) => {
  (await cookies()).delete(key);
};

export const consumeCookieByKey = async (key: string) => {
  const message = await getCookieByKey(key);

  await deleteCookieByKey(key);

  return message;
};

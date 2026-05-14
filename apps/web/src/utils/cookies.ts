"use server";
import { cookies } from "next/headers";

type Key = "toast" | (string & {});

export const setCookieByKey = async (key: Key, value: string) =>
  (await cookies()).set(key, value);

const getCookieByKey = async (key: Key) => {
  const cookie = (await cookies()).get(key);

  if (!cookie) {
    return null;
  }

  return cookie.value;
};

const deleteCookieByKey = async (key: Key) => (await cookies()).delete(key);

export const consumeCookieByKey = async (key: Key) => {
  const message = await getCookieByKey(key);

  await deleteCookieByKey(key);

  return message;
};

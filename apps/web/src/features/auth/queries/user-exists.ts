"use server";

import { orm } from "@firstroad/db";

const userExists = async (email: string): Promise<boolean> => {
  const user = await orm.User.where({ email }).select("email").first();
  return user !== null;
};

export { userExists };

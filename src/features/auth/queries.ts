// "use server";

import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE } from "./constants";
import { createSessionClient } from "@/lib/appwrite";

export const getCurrent = async () => {
  try {
    const { account } = await createSessionClient();

    const user = await account.get();
    // console.log("user", user);

    return user;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

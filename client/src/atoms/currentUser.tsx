import { atom } from "recoil";
import { User } from "../types/User";

export const currentUserState = atom<User | undefined>({
  key: "currentUser",
  default: undefined,
})
import axios from "axios";
import { ApiStatusCode } from "../types/ApiStatusCode";
import { User } from "../types/User";

type UserLoginResponse = {
  code: ApiStatusCode;
  msg: string;
  token?: string;
};

type UserResponse = {
  code: ApiStatusCode;
  msg: string;
  data?: User;
};

export const fetchUser = async () => {
  try {
    const res = await axios.get<UserResponse>("/user");
    return res.data;
  } catch (e) {
    return { code: 99, msg: "Internal Server Error", data: null };
  }
};

type UpdateUserProps = {
  username?: string;
  email?: string;
  watchRepository?: string;
};

export const updateUser = async ({
  username,
  email,
  watchRepository,
}: UpdateUserProps) => {
  try {
    const res = await axios.patch<UserResponse>("/user", {
      username: username,
      email: email,
      watchRepository: watchRepository,
    });
    return res.data;
  } catch (e) {
    return { code: 99, msg: "Internal Server Error", data: null };
  }
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const res = await axios.post<UserLoginResponse>("/user/create", {
      username: username,
      email: email,
      password: password,
    });
    return res.data;
  } catch (e) {
    return { code: 99, msg: "Internal Server Error", token: null };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post<UserLoginResponse>("/user/login", {
      email: email,
      password: password,
    });
    return res.data;
  } catch (e) {
    return { code: 99, msg: "Internal Server Error", token: null };
  }
};

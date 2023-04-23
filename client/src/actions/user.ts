import axios from "axios";
import { ApiStatusCode } from "../types/ApiStatusCode";

type UserResponse = {
  code: ApiStatusCode;
  msg: string;
  token?: string;
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const res = await axios.post<UserResponse>(
      "http://localhost:3000/user/create",
      {
        username: username,
        email: email,
        password: password,
      }
    );
    return res.data;
  } catch (e) {
    return { code: 500, msg: "Internal Server Error" };
  }
};

export const login = async (username: string, password: string) => {
  axios.post("/user/login"),
    {
      username: username,
      password: password,
    };
};

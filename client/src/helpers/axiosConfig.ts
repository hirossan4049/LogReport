import axios from "axios";
import { Cookies } from "react-cookie";

export const axiosConfigure = () => {
  const cookies = new Cookies();
  axios.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = "Bearer " + cookies.get("token");
      config.headers["Cache-Controll"] = "no-cache";
      return config;
    },
    (error) => {
      console.log(error);
    }
  );
};

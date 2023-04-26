import axios from "axios";
import { Cookies } from "react-cookie";

axios.interceptors.request.use(
  (config) => {
    console.log(config, config.url)
    config.baseURL = import.meta.env.VITE_API_BASE_URL;
    config.headers["Authorization"] = "Bearer " + new Cookies().get("token");
    config.headers["Cache-Controll"] = "no-cache";
    return config;
  },
  (error) => {
    console.log(error);
  }
);
import { VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Header } from "./components/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import "./helpers/axiosConfig";
import { Profile } from "./pages/Profile";
import { useRecoilState } from "recoil";
import { currentUserState } from "./atoms/currentUser";
import { fetchUser } from "./actions/user";
import { useCookies } from "react-cookie";

export const App: React.FC = () => {
  const location = useLocation();
  const [, setCurrentUser] = useRecoilState(currentUserState);
  const [cookies, _] = useCookies(["token"]);

  const configure = async () => {
    if (cookies.token) {
      const res = await fetchUser();
      setCurrentUser(res.data || undefined);
    }
  };

  useEffect(() => {
    configure();
  }, [cookies.token]);

  return (
    <VStack bg={"gray.50"} h={"100vh"}>
      {/* FIXME: location */}
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Header />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </VStack>
  );
};

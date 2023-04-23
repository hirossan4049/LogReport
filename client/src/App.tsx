import { VStack } from "@chakra-ui/react";
import React from "react";
import { Header } from "./components/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <VStack>
      {/* FIXME: location */}
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Header />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </VStack>
  );
};

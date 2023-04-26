import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { RecoilRoot } from "recoil";

const rootElement = document.getElementById("root")!;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <CookiesProvider>
      <BrowserRouter>
        <ChakraProvider>
          <RecoilRoot>
            <App />
          </RecoilRoot>
        </ChakraProvider>
      </BrowserRouter>
    </CookiesProvider>
  </React.StrictMode>
);

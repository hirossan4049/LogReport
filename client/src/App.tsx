import { VStack, Text } from "@chakra-ui/react";
import React from "react";
import { Header } from "./components/Header";

export const App: React.FC = () => {
  return (
    <VStack>
      <Header />
      <Text>hello chakaraui</Text>
    </VStack>
  );
};

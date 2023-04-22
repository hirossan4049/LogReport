import { HStack, Text, Button, Divider, VStack } from "@chakra-ui/react";

export const Header = () => {
  return (
    <VStack w={"full"}>
      <HStack w={"full"} p={2} px={8}>
        <Text w="full">LogReport</Text>
        <Button>ログイン</Button>
      </HStack>
      <Divider />
    </VStack>
  );
};

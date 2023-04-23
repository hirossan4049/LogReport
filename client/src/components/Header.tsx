import { HStack, Text, Button, Divider, VStack, Link } from "@chakra-ui/react";

export const Header = () => {
  return (
    <VStack w={"full"}>
      <HStack w={"full"} p={2} px={8}>
        <Text w="full">LogReport</Text>
        <Link href="/login">
          <Button>ログイン</Button>
        </Link>

        <Link href="/register">
          <Button>新規登録</Button>
        </Link>
      </HStack>
      <Divider />
    </VStack>
  );
};

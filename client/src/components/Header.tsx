import {
  HStack,
  Text,
  Button,
  Divider,
  VStack,
  Link,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
} from "@chakra-ui/react";
import { useCookies } from "react-cookie";

export const Header = () => {
  const [cookies, _, removeCookie] = useCookies(["token"]);

  const handleLogout = () => {
    removeCookie("token");
  };

  return (
    <VStack w={"full"} spacing={0}>
      <HStack w={"full"} p={2} h={14}>
        <Text w="full" px={8}>LogReport</Text>
        {cookies.token ? (
          <Menu>
            <MenuButton>
              <Avatar name={"user name"} h={12} w={12} />
            </MenuButton>
            <MenuList>
              <MenuItem>プロフィール</MenuItem>
              <MenuItem>設定</MenuItem>
              <MenuDivider />
              <MenuItem color={"red"} onClick={handleLogout}>ログアウト</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <>
            <Link href="/login">
              <Button>ログイン</Button>
            </Link>

            <Link href="/register">
              <Button>新規登録</Button>
            </Link>
          </>
        )}
      </HStack>
      <Divider />
    </VStack>
  );
};

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
import { User } from "../types/User";
import { useEffect, useState } from "react";
import { fetchUser } from "../actions/user";

export const Header = () => {
  const [cookies, _, removeCookie] = useCookies(["token"]);

  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined)

  const configure = async () => {
    if (cookies.token) {
      const res = await fetchUser()
      setCurrentUser(res.data || undefined)
    }
  }

  useEffect(() => {
    configure()
  }, [cookies.token])

  const handleLogout = () => {
    removeCookie("token");
  };

  return (
    <VStack w={"full"} spacing={0} bg={"white"}>
      <HStack w={"full"} p={2} h={14}>
        <Link w="full" px={8} href={"/"} _hover={{ textDecoration: "none" }}>
          <Text>LogReport</Text>
        </Link>
        {cookies.token ? (
          <Menu>
            <MenuButton>
              <Avatar name={currentUser?.name || "unknown"} h={10} w={10} />
            </MenuButton>
            <MenuList>
              <Link href="/login" _hover={{ textDecoration: "none" }}>
                <MenuItem>プロフィール</MenuItem>
              </Link>
              <Link href="/settings" _hover={{ textDecoration: "none" }}>
                <MenuItem>設定</MenuItem>
              </Link>
              <MenuDivider />
              <MenuItem color={"red"} onClick={handleLogout}>
                ログアウト
              </MenuItem>
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

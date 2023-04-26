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
  Spacer,
} from "@chakra-ui/react";
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { currentUserState } from "../atoms/currentUser";

export const Header = () => {
  const [cookies, _, removeCookie] = useCookies(["token"]);
  const [currentUser,] = useRecoilState(currentUserState)

  const handleLogout = () => {
    removeCookie("token");
  };

  return (
    <VStack w={"full"} spacing={0} bg={"white"} position={"fixed"} top={0} zIndex={9999}>
      <HStack w={"full"} p={2} h={14}>
        <Link px={8} href={"/"} _hover={{ textDecoration: "none" }}>
          <Text fontWeight={"bold"}>LogReport</Text>
        </Link>
        <Spacer />
        {cookies.token ? (
          <Menu>
            <MenuButton>
              <Avatar name={currentUser?.name || "unknown"} h={10} w={10} />
            </MenuButton>
            <MenuList>
              <Link href="/profile" _hover={{ textDecoration: "none" }}>
                <MenuItem px={4} py={0}>
                  <Avatar
                    name={currentUser?.name || "unknown"}
                    h={10}
                    w={10}
                    mr={2}
                  />
                  <VStack spacing={0}>
                    <Text w={"full"} fontWeight={"bold"}>
                      {currentUser?.name}
                    </Text>
                    <Text w={"full"} fontSize={12}>
                      @{currentUser?.name}
                    </Text>
                  </VStack>
                </MenuItem>
              </Link>
              <MenuDivider />
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

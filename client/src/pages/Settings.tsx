import {
  VStack,
  Text,
  HStack,
  Input,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { User } from "../types/User";
import { fetchUser } from "../actions/user";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Settings = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const isFirst = searchParams.has("first")
  const [cookies, _] = useCookies(["token"]);
  const [repository, setRepository] = useState("");
  const navigate = useNavigate();

  // FIXME: recoil
  const [, setCurrentUser] = useState<User | undefined>(undefined);

  const configure = async () => {
    if (cookies.token) {
      const res = await fetchUser();
      setCurrentUser(res.data || undefined);
      setRepository(res.data?.watchRepository || "");
    }
  };

  useEffect(() => {
    configure();
  }, [cookies.token]);

  const handleSave = () => {
    navigate("/")
  }

  if (!cookies.token) {
    navigate("/login");
  }

  return (
    <VStack>
      <VStack bg={"white"} w={"700px"} margin={"10"} p={8} rounded={"md"}>
        <Text fontWeight={"bold"} mb={6}>
          {isFirst ? "はじめよう" : "設定"}
        </Text>
        <HStack w={"full"}>
          <VStack w={"800px"} spacing={0}>
            <Text w={"full"} fontSize={"15"}>
              リポジトリ名(hirossan4049/LogReport)
            </Text>
            <Text w={"full"} fontSize={"10"} color={"gray"}>
              現状publicリポジトリのみです
            </Text>
          </VStack>
          <Input
            value={repository}
            onChange={(e) => setRepository(e.target.value)}
          />
        </HStack>

        <HStack pt={16} spacing={16}>
          {!isFirst && (
            <Button bg={"clear"} w={32}>
              キャンセル
            </Button>
          )}
          <Button w={32} onClick={handleSave}>{isFirst ? "完了！" : "保存"}</Button>
        </HStack>
      </VStack>
      <Text fontSize={"10"} color={"gray"}>
        LogReport @2023
      </Text>
    </VStack>
  );
};

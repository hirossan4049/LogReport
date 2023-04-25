import {
  VStack,
  Text,
  HStack,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { User } from "../types/User";
import { fetchUser, updateUser } from "../actions/user";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ApiStatusCode } from "../types/ApiStatusCode";
import { useReward } from "react-rewards";
import { axiosConfigure } from "../helpers/axiosConfig";

export const Settings = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const isFirst = searchParams.has("first");
  const [cookies, _] = useCookies(["token"]);
  const [repository, setRepository] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { reward, isAnimating } = useReward("rewardId", "confetti");

  // FIXME: recoil
  const [, setCurrentUser] = useState<User | undefined>(undefined);

  const configure = async () => {
    if (cookies.token) {
      axiosConfigure()
      const res = await fetchUser();
      setCurrentUser(res.data || undefined);
      setRepository(res.data?.watchRepository || "");
    }
  };

  useEffect(() => {
    configure();
  }, [cookies.token]);

  const handleSave = async () => {
    const result = await updateUser({ watchRepository: repository });

    switch (result.code) {
      case ApiStatusCode.Success:
        if (isFirst) {
          reward();
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        toast({
          title: "登録成功",
          status: "success",
        });
        navigate("/");
        break;
      default:
        toast({
          title: "登録に失敗しました",
          status: "error",
        });
        break;
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

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
            <Button bg={"clear"} w={32} onClick={handleCancel}>
              キャンセル
            </Button>
          )}
          <Button w={32} onClick={handleSave} isDisabled={isAnimating}>
            {isFirst ? "完了！" : "保存"}
            <span id={"rewardId"} />
          </Button>
        </HStack>
      </VStack>
      <Text fontSize={"10"} color={"gray"}>
        LogReport @2023
      </Text>
    </VStack>
  );
};

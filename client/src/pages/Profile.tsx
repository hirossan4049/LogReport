import {
  VStack,
  Text,
  HStack,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { updateUser } from "../actions/user";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ApiStatusCode } from "../types/ApiStatusCode";
import { useRecoilState } from "recoil";
import { currentUserState } from "../atoms/currentUser";
import { useEffect, useState } from "react";

export const Profile = () => {
  const [cookies, _] = useCookies(["token"]);
  const navigate = useNavigate();
  const toast = useToast();

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [newUser, setNewUser] = useState(currentUser);
  // const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    setNewUser(currentUser);
  }, [currentUser]);

  const handleSave = async () => {
    const result = await updateUser({
      username: newUser?.name,
      email: newUser?.email,
    });
    switch (result.code) {
      case ApiStatusCode.Success:
        setCurrentUser(result.data ?? undefined);
        toast({
          title: "更新完了",
          status: "success",
        });
        navigate("/");
        break;
      default:
        toast({
          title: "更新に失敗しました",
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
      <VStack
        bg={"white"}
        w={"700px"}
        margin={"10"}
        p={8}
        px={16}
        rounded={"md"}
      >
        <Text fontWeight={"bold"} mb={6}>
          {"プロフィール"}
        </Text>
        <HStack w={"full"}>
          <Text w={"500px"} fontSize={"15"}>
            名前
          </Text>
          <Input
            value={newUser?.name}
            onChange={(e) =>
              setNewUser(newUser && { ...newUser, name: e.target.value })
            }
          />
        </HStack>

        <HStack w={"full"}>
          <Text w={"500px"} fontSize={"15"}>
            メールアドレス
          </Text>
          <Input
            value={newUser?.email}
            // onChange={(e) =>
            //   setCurrentUser(
            //     currentUser && { ...currentUser, email: e.target.value }
            //   )
            // }
            isDisabled={true}
          />
        </HStack>

        <HStack pt={16} spacing={16}>
          <Button bg={"clear"} w={32} onClick={handleCancel}>
            キャンセル
          </Button>

          <Button w={32} onClick={handleSave}>
            保存
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

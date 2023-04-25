import {
  VStack,
  Text,
  Center,
  Input,
  Button,
  Link,
  Spacer,
  CloseButton,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { register } from "../actions/user";
import { ApiStatusCode } from "../types/ApiStatusCode";
import { useCookies } from "react-cookie";
import { axiosConfigure } from "../helpers/axiosConfig";

export const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [, setCookie, _] = useCookies(["token"]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [enableRegister, setEnableRegister] = useState(false);

  const handlePasswordShow = () => setPasswordShow(!passwordShow);

  useEffect(() => {
    axiosConfigure()
  }, [])

  useEffect(() => {
    // TODO: email check
    if (username && email && password) {
      setEnableRegister(true);
    }
  }, [username, email, password]);

  const handleRegister = async () => {
    const result = await register(username, email, password);

    switch (result.code) {
      case ApiStatusCode.Success:
        if (result.token) {
          setCookie("token", result.token);
          toast({
            title: "登録成功",
            status: "success",
          });
          navigate("/settings?first");
        } else {
          toast({
            title: "登録に失敗しました",
            status: "error",
          });
        }
        break;
      case ApiStatusCode.FillAllFields:
        toast({
          title: "登録に失敗しました",
          description: "フィールド全て埋めてください",
          status: "error",
        });
        break;
      case ApiStatusCode.EmailAlreadyRegistered:
        toast({
          title: "登録に失敗しました",
          description: "すでに登録されたメールアドレスです",
          status: "error",
        });
        break;
      default:
        toast({
          title: "登録に失敗しました",
          status: "error",
        });
        break;
    }
  };

  return (
    <Center bg={"gray.100"} w={"full"} h={"100vh"}>
      <VStack
        bg={"white"}
        w={"500px"}
        maxW={"90%"}
        h={"500px"}
        rounded={"md"}
        p={8}
        spacing={"16px"}
      >
        <CloseButton
          ml={"auto"}
          textAlign={"right"}
          my={"-2"}
          onClick={() => navigate("/")}
        />

        <Text fontWeight={"bold"} textAlign={"center"} fontSize={"lg"}>
          LogReport
          <br />
          新規登録
        </Text>
        <Spacer />
        <Input
          placeholder="メールアドレス"
          onChange={(v) => setEmail(v.target.value)}
        />
        <Input
          placeholder="表示名"
          onChange={(v) => setUsername(v.target.value)}
        />

        <InputGroup size={"md"}>
          <Input
            placeholder="パスワード"
            type={passwordShow ? "text" : "password"}
            onChange={(v) => setPassword(v.target.value)}
          />
          <InputRightElement>
            <IconButton
              icon={passwordShow ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              aria-label={""}
              onClick={handlePasswordShow}
              bg={"clear"}
            />
          </InputRightElement>
        </InputGroup>

        <Spacer />
        <Button
          w={"full"}
          onClick={handleRegister}
          isDisabled={!enableRegister}
        >
          新規登録
        </Button>
        <Link href={"/login"}>ログインはこちら</Link>
      </VStack>
    </Center>
  );
};

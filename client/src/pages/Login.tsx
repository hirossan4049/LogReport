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
import { ApiStatusCode } from "../types/ApiStatusCode";
import { login } from "../actions/user";
import { useCookies } from "react-cookie";

export const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [cookies, setCookie] = useCookies(["token"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [enableLogin, setEnableLogin] = useState(false);

  useEffect(() => {
    if (cookies.token) navigate("/");
  }, []);

  useEffect(() => {
    // TODO: check
    if (email && password) {
      setEnableLogin(true);
    }
  }, [email, password]);

  const handlePasswordShow = () => setPasswordShow(!passwordShow);

  const handleLogin = async () => {
    const result = await login(email, password);

    switch (result.code) {
      case ApiStatusCode.Success:
        if (result.token) {
          setCookie("token", result.token);
          toast({
            title: "ログインに成功しました",
            status: "success",
          });
          navigate("/");
        } else {
          toast({
            title: "ログインに失敗しました",
            status: "error",
          });
        }
        break;
      case ApiStatusCode.FillAllFields:
        toast({
          title: "ログインに失敗しました",
          description: "フィールド全て埋めてください",
          status: "error",
        });
        break;
      case ApiStatusCode.InvalidAccount:
        toast({
          title: "ログインに失敗しました",
          description: "メールアドレス、またはパスワードが違います",
          status: "error",
        });
        break;
      default:
        toast({
          title: "ログインに失敗しました",
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
        h={"400px"}
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
          ログイン
        </Text>
        <Spacer />
        <Input
          placeholder="メールアドレス"
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputGroup size={"md"}>
          <Input
            placeholder="パスワード"
            type={passwordShow ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
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
        <Button w={"full"} isDisabled={!enableLogin} onClick={handleLogin}>
          ログイン
        </Button>
        <Link href={"/register"}>新規登録はこちら</Link>
      </VStack>
    </Center>
  );
};

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
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export const Login = () => {
  const navigate = useNavigate();
  const [passwordShow, setPasswordShow] = useState(false);

  const handlePasswordShow = () => setPasswordShow(!passwordShow);

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
        <Input placeholder="メールアドレス" />

        <InputGroup size={"md"}>
          <Input
            placeholder="パスワード"
            type={passwordShow ? "text" : "password"}
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
        <Button w={"full"}>ログイン</Button>
        <Link href={"/register"}>新規登録はこちら</Link>
      </VStack>
    </Center>
  );
};

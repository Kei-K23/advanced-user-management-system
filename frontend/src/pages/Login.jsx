import {
  Button,
  Container,
  Field,
  Flex,
  Heading,
  Image,
  Input,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/auth";
import { toaster } from "../components/ui/toaster";

export default function Login() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const { mutate, isLoading } = useMutation({
    mutationFn: login,
    onSuccess: ({ data, message }) => {
      authLogin(data.token);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toaster.create({ title: message, type: "success" });
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <Flex gap="4" height={"vh"}>
      <Container
        width={"full"}
        centerContent
        justifyContent={"center"}
        height={"full"}
      >
        <Image src="/login_banner.svg" alt="banner image" width={"full"} />
      </Container>
      <Container
        bg={"whiteAlpha.100"}
        width={"full"}
        centerContent
        justifyContent={"center"}
        height={"full"}
      >
        <Heading size={"2xl"} color={"teal.500"} fontWeight={"bold"}>
          Hello Again
        </Heading>
        <Text>Login in to your account to continue</Text>
        <form onSubmit={handleSubmit} style={{ width: "70%", marginTop: 20 }}>
          <Field.Root required disabled={isLoading} width={"full"}>
            <Field.Label>
              Email <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="me@example.com"
            />
          </Field.Root>
          <Field.Root required disabled={isLoading} marginTop={2}>
            <Field.Label>
              Password <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="******"
            />
          </Field.Root>
          <Button
            type="submit"
            disabled={isLoading}
            marginTop={2}
            width={"full"}
          >
            {isLoading ? "Logging" : "Login"}
          </Button>
        </form>
        <ChakraLink asChild marginTop={4} _disabled={isLoading}>
          <Link to={"/register"}>Don't have an account? Register here</Link>
        </ChakraLink>
      </Container>
    </Flex>
  );
}

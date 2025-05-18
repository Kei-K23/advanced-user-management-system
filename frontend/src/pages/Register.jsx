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
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth";
import { toaster } from "../components/ui/toaster";

export default function Register() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: ({ message }) => {
      toaster.create({ title: message, type: "success" });
      navigate("/login");
    },
    onError: (data) => {
      toaster.create({ title: data.response.data.message, type: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ username, displayName, email, password });
  };

  return (
    <Flex gap="4" height={"vh"}>
      <Container
        width={"full"}
        centerContent
        justifyContent={"center"}
        height={"full"}
      >
        <Image src="/register_banner.svg" alt="banner image" width={"full"} />
      </Container>
      <Container
        bg={"whiteAlpha.100"}
        width={"full"}
        centerContent
        justifyContent={"center"}
        height={"full"}
      >
        <Heading size={"2xl"} color={"teal.500"} fontWeight={"bold"}>
          Create an account
        </Heading>
        <Text maxW={"450px"} textAlign={"center"}>
          Create and account to utilize the power of advanced user management
          system
        </Text>
        <form onSubmit={handleSubmit} style={{ width: "70%", marginTop: 20 }}>
          <Field.Root required disabled={isPending} width={"full"}>
            <Field.Label>
              Username <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john-doe"
            />
          </Field.Root>
          <Field.Root
            required
            disabled={isPending}
            width={"full"}
            marginTop={2}
          >
            <Field.Label>
              Display Name <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
            />
          </Field.Root>
          <Field.Root
            required
            disabled={isPending}
            width={"full"}
            marginTop={2}
          >
            <Field.Label>
              Email <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="me@example.com"
            />
          </Field.Root>
          <Field.Root required disabled={isPending} marginTop={2}>
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
            disabled={isPending}
            marginTop={2}
            width={"full"}
          >
            {isPending ? "Registering..." : "Register"}
          </Button>
        </form>
        <ChakraLink asChild marginTop={4} _disabled={isPending}>
          <Link to={"/login"}>Already have an account? Login here</Link>
        </ChakraLink>
      </Container>
    </Flex>
  );
}

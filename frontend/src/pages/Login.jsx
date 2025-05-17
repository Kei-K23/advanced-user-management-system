import { Button, Field, Heading, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
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
    <div>
      <Heading size={"2xl"}>Hello Again</Heading>
      <form onSubmit={handleSubmit}>
        <Field.Root required disabled={isLoading}>
          <Field.Label>
            Email <Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="me@example.com"
          />
        </Field.Root>
        <Field.Root required disabled={isLoading}>
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
        <Button type="submit" disabled={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
}

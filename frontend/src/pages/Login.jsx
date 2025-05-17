import { Button, Field, Heading, Input } from "@chakra-ui/react";

export default function Login() {
  return (
    <div>
      <Heading size={"2xl"}>Hello Again</Heading>
      <form>
        <Field.Root required>
          <Field.Label>
            Email <Field.RequiredIndicator />
          </Field.Label>
          <Input placeholder="me@example.com" />
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Password <Field.RequiredIndicator />
          </Field.Label>
          <Input type="password" placeholder="******" />
        </Field.Root>
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}

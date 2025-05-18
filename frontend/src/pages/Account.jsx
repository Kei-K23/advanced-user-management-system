import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updateCurrentUser } from "../api/auth";
import { toaster } from "../components/ui/toaster";
import { useAuth } from "../providers/AuthProvider";

const Account = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState(user?.email);
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [username, setUsername] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [location, setLocation] = useState(user?.address?.location);
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode);
  const [phone, setPhone] = useState(user?.address?.phone);

  const { mutate, isPending } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toaster.create({ title: message, type: "success" });
    },
    onError: (data) => {
      toaster.create({ title: data.response.data.message, type: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({
      email,
      displayName,
      username,
      bio,
      address: { location, postalCode, phone },
    });
  };

  return (
    <Box maxW="600px" mx="auto" mt={10} p={6} boxShadow="lg" borderRadius="lg">
      <Heading mb={6} textAlign="center">
        Edit Profile
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
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
          <Field.Root required disabled={isPending} width={"full"}>
            <Field.Label>
              Email <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="me@example.com"
            />
          </Field.Root>
          <Field.Root required disabled={isPending} width={"full"}>
            <Field.Label>
              Display Name <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
            />
          </Field.Root>
          <Field.Root disabled={isPending} width={"full"}>
            <Field.Label>Bio</Field.Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Your Bio"
            />
          </Field.Root>
          <Field.Root disabled={isPending} width={"full"}>
            <Field.Label>Address - Location</Field.Label>
            <Textarea
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
            />
          </Field.Root>
          <Field.Root disabled={isPending} width={"full"}>
            <Field.Label>Address - Postal Code</Field.Label>
            <Input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Enter your postal code"
            />
          </Field.Root>
          <Field.Root disabled={isPending} width={"full"}>
            <Field.Label>Address - Phone</Field.Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </Field.Root>

          <Button type="submit" disabled={isPending} width={"full"}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Account;

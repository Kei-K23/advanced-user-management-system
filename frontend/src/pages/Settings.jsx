import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "../providers/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { deleteCurrentUser } from "../api/auth";
import { toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router";

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { mutate: deleteCurrentUserMutation, isPending } = useMutation({
    mutationFn: deleteCurrentUser,
    onSuccess: ({ message }) => {
      toaster.create({ title: message, type: "success" });
      logout();
      navigate("/login");
    },
    onError: (data) => {
      toaster.create({ title: data.response.data.message, type: "error" });
    },
  });

  return (
    <Box
      maxW="7xl"
      mx="auto"
      p={6}
      display={"flex"}
      height={"full"}
      flexDir={"column"}
    >
      <div>
        <Heading size="lg" mb={6}>
          Danger Zone
        </Heading>
        <Container
          borderWidth={"thin"}
          borderColor={"red.500"}
          w={"full"}
          h={"fit-content"}
          py={5}
          display={"flex"}
          justifyContent={"space-between"}
          alignContent={"center"}
        >
          <div>
            <Text fontWeight={"bold"}>Delete the account</Text>
            <Text>
              Once you delete the account, there is no going back. Please be
              certain.
            </Text>
          </div>
          <Button
            variant={"outline"}
            colorPalette={"red"}
            onClick={deleteCurrentUserMutation}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </Container>
      </div>
    </Box>
  );
}

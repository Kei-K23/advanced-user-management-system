import { useQuery } from "@tanstack/react-query";
import { getCurrentUserSessions } from "../api/auth";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";

export default function Logs() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["auth", "me", "sessions"],
    queryFn: getCurrentUserSessions,
    retry: false,
  });

  if (isLoading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box
      maxW="7xl"
      mx="auto"
      p={6}
      display={"flex"}
      height={"full"}
      flexDir={"column"}
    >
      <Heading size="lg" mb={6}>
        Your Login Session Logs
      </Heading>

      <Flex p={0} flex={1} overflow={"scroll"} w={"full"} maxH={"75vh"}>
        {sessions?.length === 0 ? (
          <Text>No session data available.</Text>
        ) : (
          <SimpleGrid w={"full"} columns={{ base: 1, md: 1, lg: 1 }} spaceY={4}>
            {sessions?.map((session) => (
              <Card.Root key={session._id} boxShadow="md" borderRadius="xl">
                <Card.Body>
                  <Stack
                    spacing={1}
                    display={"flex"}
                    flexDir={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Text fontSize="xl" fontWeight="bold">
                      Login Device:
                      {session.deviceInfo.device || "Unknown Device"}
                    </Text>
                    <Tag.Root
                      size={"lg"}
                      colorPalette={session.active ? "green" : "red"}
                      w="fit-content"
                    >
                      <Tag.Label>
                        {session.active ? "Active" : "Inactive"}
                      </Tag.Label>
                    </Tag.Root>
                  </Stack>
                  <Stack spacing={2}>
                    <Text>
                      <strong>Browser:</strong>{" "}
                      {session.deviceInfo.browser || "N/A"}
                    </Text>
                    <Text>
                      <strong>OS:</strong> {session.deviceInfo.os || "N/A"}
                    </Text>
                    <Text>
                      <strong>IP:</strong> {session.deviceInfo.ip || "N/A"}
                    </Text>
                    <Text>
                      <strong>Started:</strong>{" "}
                      {dayjs(session.createdAt).format("YYYY-MM-DD HH:mm")}
                    </Text>
                    <Text>
                      <strong>Expires:</strong>{" "}
                      {dayjs(session.expiresAt).format("YYYY-MM-DD HH:mm")}
                    </Text>
                  </Stack>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        )}
      </Flex>
    </Box>
  );
}

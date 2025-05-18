import { Box, Flex, Heading } from "@chakra-ui/react";
import UsersTable from "../components/UsersTable";

export default function Users() {
  return (
    <Box
      maxW="7xl"
      mx="auto"
      p={6}
      display={"flex"}
      height={"full"}
      flexDir={"column"}
    >
      <Flex alignContent={"center"} justifyContent={"space-between"}>
        <Heading size="lg" mb={6}>
          Users
        </Heading>
      </Flex>

      <UsersTable />
    </Box>
  );
}

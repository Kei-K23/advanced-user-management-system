import {
  Container,
  Flex,
  Link as ChakraLink,
  Separator,
  Icon,
} from "@chakra-ui/react";
import { Link } from "react-router";
import { MdOutlineGroups3 } from "react-icons/md";

export default function DashboardLayout() {
  return (
    <Flex height={"vh"}>
      {/* Sidebar */}
      <Container
        width={"1/5"}
        height={"full"}
        bg={"whiteAlpha.100"}
        borderRightColor={"whiteAlpha.200"}
        borderRightWidth={"thin"}
      >
        <ChakraLink asChild marginTop={4}>
          <Link to={"/"}>
            <Icon size="lg" color="teal.500">
              <MdOutlineGroups3 />
            </Icon>
            <span>AUMS</span>
          </Link>
        </ChakraLink>
        <Separator my={"5"} size={"sm"} />
      </Container>
      <Flex
        width={"full"}
        height={"full"}
        p={0}
        justifyContent={"center"}
        alignItems={"center"}
        flexDir={"column"}
      >
        {/* Navbar */}
        <Container
          bg={"whiteAlpha.100"}
          width={"full"}
          borderBottomWidth={"thin"}
          borderBottomColor={"whiteAlpha.200"}
          h={"1/12"}
        ></Container>
        <Container width={"full"} flex={1}></Container>
      </Flex>
    </Flex>
  );
}

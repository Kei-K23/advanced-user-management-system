import {
  Container,
  Flex,
  Link as ChakraLink,
  Separator,
  Icon,
  Button,
} from "@chakra-ui/react";
import { Link, Outlet, useLocation } from "react-router";
import {
  MdDashboard,
  MdOutlineGroups2,
  MdOutlineGroups3,
  MdSettings,
} from "react-icons/md";

const NAV_LINKS = [
  {
    name: "Dashboard",
    icon: MdDashboard,
    link: "/",
  },
  {
    name: "Users",
    icon: MdOutlineGroups2,
    link: "/users",
  },
];

export default function DashboardLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Flex height={"vh"}>
      {/* Sidebar */}
      <Flex
        width={"1/5"}
        height={"full"}
        bg={"whiteAlpha.100"}
        borderRightColor={"whiteAlpha.200"}
        borderRightWidth={"thin"}
        px={3}
        justifyContent={"center"}
        alignItems={"center"}
        flexDir={"column"}
      >
        <Container w={"full"} p={0}>
          <ChakraLink asChild marginTop={4} ml={5} w={"full"}>
            <Link to={"/"}>
              <Icon size="lg" color="teal.500">
                <MdOutlineGroups3 />
              </Icon>
              <span>AUMS</span>
            </Link>
          </ChakraLink>
          <Separator my={"2"} size={"sm"} />
        </Container>

        <Flex flexDir={"column"} gap={2} flex={1} w={"full"} p={0}>
          {NAV_LINKS.map((nav) => (
            <Link
              key={nav.name}
              to={nav.link}
              style={{
                width: "100%",
              }}
            >
              <Button
                role="group"
                variant={pathname === nav.link ? "solid" : "subtle"}
                justifyContent={"start"}
                w={"full"}
              >
                <Icon
                  _groupHover={{
                    color: "teal.500",
                  }}
                >
                  <nav.icon />
                </Icon>
                {nav.name}
              </Button>
            </Link>
          ))}
        </Flex>
        <Container p={0} mb={4}>
          <Separator my={"2"} size={"sm"} />
          <Link
            to={"/settings"}
            style={{
              width: "100%",
            }}
          >
            <Button
              variant={pathname === "/settings" ? "solid" : "subtle"}
              justifyContent={"start"}
              w={"full"}
            >
              <Icon>
                <MdSettings />
              </Icon>
              Settings
            </Button>
          </Link>
        </Container>
      </Flex>
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
          h={"14"}
        ></Container>
        <Container width={"full"} flex={1}>
          <Outlet />
        </Container>
      </Flex>
    </Flex>
  );
}

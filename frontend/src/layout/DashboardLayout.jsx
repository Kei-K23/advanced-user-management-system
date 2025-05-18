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
import UserButton from "../components/auth/UserButton";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuLogs } from "react-icons/lu";
import { useAuth } from "../providers/AuthProvider";

const NAV_LINKS = [
  {
    name: "Dashboard",
    icon: MdDashboard,
    link: "/",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "Account",
    icon: FaRegCircleUser,
    link: "/account",
    roles: ["MEMBER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "Users",
    icon: MdOutlineGroups2,
    link: "/users",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "Logs",
    icon: LuLogs,
    link: "/logs",
    roles: ["MEMBER", "ADMIN", "SUPER_ADMIN"],
  },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Flex height={"vh"}>
      {/* Sidebar */}
      <Flex
        width={"1/5"}
        bg={"whiteAlpha.100"}
        borderRightColor={"whiteAlpha.200"}
        borderRightWidth={"thin"}
        px={3}
        height={"full"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDir={"column"}
      >
        <Container w={"full"} p={0}>
          <ChakraLink asChild marginTop={4} ml={5} w={"full"}>
            <Link to={user?.role === "MEMBER" ? "/account" : "/"}>
              <Icon size="lg" color="teal.500">
                <MdOutlineGroups3 />
              </Icon>
              <span>AUMS</span>
            </Link>
          </ChakraLink>
          <Separator my={"2"} size={"sm"} />
        </Container>

        <Flex flexDir={"column"} gap={2} flex={1} w={"full"} p={0}>
          {NAV_LINKS.filter((nav) => nav.roles.includes(user?.role)).map(
            (nav) => (
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
            )
          )}
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
        <Flex
          bg={"whiteAlpha.100"}
          width={"full"}
          borderBottomWidth={"thin"}
          borderBottomColor={"whiteAlpha.200"}
          justifyContent={"end"}
          alignItems={"center"}
          px={8}
          h={"14"}
        >
          <UserButton />
        </Flex>
        <Container width={"full"} flex={1}>
          <Outlet />
        </Container>
      </Flex>
    </Flex>
  );
}

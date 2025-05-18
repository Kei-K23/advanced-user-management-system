import { Avatar, Icon, Menu, Portal, Status } from "@chakra-ui/react";
import { useAuth } from "../../providers/AuthProvider";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineLogout } from "react-icons/md";
import { Link } from "react-router";

export default function UserButton() {
  const { user, logout } = useAuth();

  return (
    <Menu.Root positioning={{ placement: "bottom" }}>
      <Menu.Trigger position={"relative"}>
        <Status.Root
          colorPalette={user?.isOnline ? "green" : "yellow"}
          position={"absolute"}
          zIndex={"banner"}
          top={"0"}
          right={"1"}
        >
          <Status.Indicator />
        </Status.Root>
        <Avatar.Root>
          <Avatar.Fallback name={user?.username} />
          <Avatar.Image src={user?.username} />
        </Avatar.Root>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Link to={"/account"}>
              <Menu.Item value="Account">
                <Icon>
                  <FaRegCircleUser />
                </Icon>
                Account
              </Menu.Item>
            </Link>
            <Menu.Item
              value="Logout"
              color="fg.error"
              _hover={{ bg: "bg.error", color: "fg.error" }}
              onClick={logout}
            >
              <Icon>
                <MdOutlineLogout />
              </Icon>
              Logout
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

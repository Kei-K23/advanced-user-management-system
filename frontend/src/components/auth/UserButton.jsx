import { Avatar, Menu } from "@chakra-ui/react";
import { useAuth } from "../../providers/AuthProvider";

export default function UserButton() {
  const { user } = useAuth();
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Avatar.Root>
          <Avatar.Fallback name={user.username} />
        </Avatar.Root>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="Account">Account</Menu.Item>
            <Menu.Item value="Logout">Logout</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

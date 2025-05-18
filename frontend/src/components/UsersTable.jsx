import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAllUsers } from "../api/users";
import {
  ActionBar,
  Button,
  Checkbox,
  Kbd,
  Menu,
  Portal,
  Table,
  Tag,
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import { useAuth } from "../providers/AuthProvider";

export default function UsersTable() {
  const queryClient = useQueryClient();
  const { socket } = useAuth();
  const [selection, setSelection] = useState([]);

  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < users?.length;

  useEffect(() => {
    if (!socket) return;

    socket.on("notify_event", (msg) => {
      console.log("Received message:", msg);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      refetchUsers();
    });

    return () => {
      socket.off("notify_event");
    };
  }, [socket]);

  const rows = users?.map((item) => (
    <Table.Row
      key={item.username}
      data-selected={selection.includes(item.username) ? "" : undefined}
    >
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label="Select row"
          checked={selection.includes(item.username)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, item.username]
                : selection.filter((username) => username !== item.username)
            );
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{item.username}</Table.Cell>
      <Table.Cell>{item.email}</Table.Cell>
      <Table.Cell>{item.displayName}</Table.Cell>
      <Table.Cell>
        <Tag.Root colorPalette={item.isOnline ? "green" : "yellow"}>
          <Tag.Label>{item.isOnline ? "Online" : "Offline"}</Tag.Label>
        </Tag.Root>
      </Table.Cell>
      <Table.Cell>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="outline" size="xs">
              <HiDotsVertical />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="edit">Edit</Menu.Item>
                <Menu.Item value="ban" color={"fg.warning"}>
                  Ban
                </Menu.Item>
                <Menu.Item
                  value="delete"
                  color="fg.error"
                  _hover={{ bg: "bg.error", color: "fg.error" }}
                >
                  Delete
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Table.Cell>
    </Table.Row>
  ));

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="6">
              <Checkbox.Root
                size="sm"
                top="0.5"
                aria-label="Select all rows"
                checked={indeterminate ? "indeterminate" : selection.length > 0}
                onCheckedChange={(changes) => {
                  setSelection(
                    changes.checked ? users?.map((item) => item.username) : []
                  );
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader>Username</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Display Name</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table.Root>

      <ActionBar.Root open={hasSelection}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {selection.length} selected
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm">
                Delete <Kbd>⌫</Kbd>
              </Button>
              <Button variant="outline" size="sm">
                Share <Kbd>T</Kbd>
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
}

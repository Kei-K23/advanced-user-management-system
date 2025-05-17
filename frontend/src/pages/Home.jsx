import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { Button, Input } from "@chakra-ui/react";

export default function Home() {
  const [message, setMessage] = useState("");
  const { user, logout, socket } = useAuth();

  useEffect(() => {
    if (!socket) return;

    socket.on("chat-message", (msg) => {
      console.log("Received message:", msg);
    });

    return () => {
      socket.off("chat-message");
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.emit("chat-message", message);
  };

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>

      <form onSubmit={handleSubmit}>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button type="submit">Send</Button>
      </form>

      <div>
        <h2>Real-time Status</h2>
        <p>You're currently logged in on this device.</p>
        <p>
          If you log in on another device, you'll be automatically logged out
          here.
        </p>
      </div>
    </div>
  );
}

import { useAuth } from "../providers/AuthProvider";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>

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

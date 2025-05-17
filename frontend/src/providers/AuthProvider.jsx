import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../api/auth";
import { setupSocket } from "../api/socket";
import { toaster } from "../components/ui/toaster";

// Initialize context with null
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && isError) {
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [isError, isLoading]);

  useEffect(() => {
    if (!token) return;

    const newSocket = setupSocket(token);

    newSocket.connect();

    setSocket(newSocket);

    newSocket.on("force_logout", (res) => {
      logout();
      toaster.create({
        title: res.message,
        type: "info",
      });
      navigate("/login");
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    if (socket) socket.disconnect();
    localStorage.removeItem("token");
    setToken(null);
    setSocket(null);
    queryClient.clear();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    socket,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

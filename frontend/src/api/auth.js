import { api } from "./index";

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data.data;
};

export const getCurrentUserSessions = async () => {
  const response = await api.get("/auth/me/sessions");
  return response.data.data;
};

export const updateCurrentUser = async (data) => {
  const response = await api.patch("/auth/me", data);
  return response.data;
};

export const deleteCurrentUser = async () => {
  const response = await api.delete("/auth/me");
  return response.data;
};

export const deleteCurrentUserInActiveSessions = async () => {
  const response = await api.delete("/auth/me/sessions");
  return response.data;
};

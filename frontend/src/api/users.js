import { api } from "./index";

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data.data;
};

export const banUserById = async (data) => {
  const response = await api.post("/users/ban", data);
  return response.data.data;
};

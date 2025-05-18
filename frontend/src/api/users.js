import { api } from "./index";

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data.data;
};

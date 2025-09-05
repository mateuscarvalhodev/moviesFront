import api from "..";
import type { RegisterPayload, UserDTO } from "./types";

export async function registerUser(payload: RegisterPayload): Promise<UserDTO> {
  const { data } = await api.post<UserDTO>("/auth/register", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

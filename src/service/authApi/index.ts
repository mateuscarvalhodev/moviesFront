import api from "..";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UserDTO,
} from "./types";

export async function registerUser(payload: RegisterPayload): Promise<UserDTO> {
  const { data } = await api.post<UserDTO>("/auth/register", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

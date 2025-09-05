export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

import { IUser } from "../model/user.model.js";

// types/auth.types.ts
export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: "user" | "admin";
  };
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}
export interface RegisterResult {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: "user" | "admin";
  };
}
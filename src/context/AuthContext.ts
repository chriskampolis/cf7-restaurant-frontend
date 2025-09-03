import { createContext } from "react";

type AuthContextProps = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);
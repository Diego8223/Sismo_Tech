import { createContext, useContext, useState, type ReactNode } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("sismo_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, password: string) => {
    if (!email || !password) return false;
    const loggedUser = {
      id: 1,
      name: "Administrador",
      email,
      role: "Administrador del sistema",
    };
    setUser(loggedUser);
    localStorage.setItem("sismo_user", JSON.stringify(loggedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sismo_user");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  return context;
}

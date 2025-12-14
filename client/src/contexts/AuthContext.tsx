import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { trpc } from "@/lib/trpc";

interface User {
  id: number;
  email: string;
  name: string;
  role: "client" | "coach" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // For now, set a mock user (TODO: Implement real auth)
  useEffect(() => {
    // Mock authenticated user
    setUser({
      id: 1,
      email: "user@example.com",
      name: "Demo User",
      role: "client",
    });
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement real login
    setUser({
      id: 1,
      email,
      name: "Demo User",
      role: "client",
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

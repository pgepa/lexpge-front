import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  nome: string;
  email: string;
  id_perfil: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const expiresAt = localStorage.getItem("expiresAt");

      if (storedToken && storedUser && expiresAt) {
        if (Date.now() > Number(expiresAt)) {
          logout(); // Token expirado, remove a sessão
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
      }
    } catch (error) {
      console.error("Erro ao recuperar a sessão:", error);
      logout();
    }
  }, []);

  const login = (token: string, user: User) => {
    try {
      const expiresAt = Date.now() + 12 * 60 * 60 * 1000; // 12 horas

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("expiresAt", expiresAt.toString());

      setToken(token);
      setUser(user);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expiresAt");

    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    
    navigate("/sign-in", { replace: true });
  }, [navigate]);

  const isLoggedIn = () => !!token;

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

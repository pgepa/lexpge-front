import { createContext, useEffect, useState } from "react";
import { UserProfile } from "@/Model/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string,id_perfil: string, nome: string, senha: string) => void;
  loginUser: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    email: string,
    nome: string,
    senha: string,
    id_perfil: string,
  ) => {
    await registerAPI(email, nome, id_perfil, senha)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            nome: res.data.nome,
            email: res?.data.email,
            id_perfil: res?.data.id_perfil,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Login realizado com Sucesso!");
          navigate("/");
        }
      })
      .catch((e) => {
        console.log(e);
        toast.warning("Server error occured")
    });
  };

  const loginUser = async (email: string, senha: string) => {
    await loginAPI(email, senha)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            nome: res.data.nome,
            email: res?.data.email,
            id_perfil: res?.data.id_perfil,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Login realizado com sucesso!");
          navigate("/");
        }
      })
      .catch((e) => {
        console.log(e);
        toast.warning("Server error occured")
    });
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
import { useEffect, useState } from "react";
import { Building, ChevronDown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { api } from '@/lib/axios';

export type GetProfileResponse = {
  id: number;
  nome: string;
  email: string;
  id_perfil: number; 
  ativo: boolean; 
};

export function AccountMenu() {
  const [userProfile, setUserProfile] = useState<GetProfileResponse | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get<GetProfileResponse[]>("/auth/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Response data:", response.data); // Verifique o formato dos dados retornados

          const users = response.data as GetProfileResponse[];

          const loggedInUserId = getLoggedInUserId();
          console.log("Logged in user ID:", loggedInUserId); // Verifique o ID do usuário logado

          const loggedInUser = users.find(user => user.id === loggedInUserId);
          
          if (loggedInUser) {
            setUserProfile(loggedInUser); 
          } else {
            console.error("Usuário logado não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao buscar o perfil do usuário:", error);
        }
      }
    };

    fetchProfile();
  }, []);

  const getLoggedInUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Decoded token payload:", payload); // Verifique o payload decodificado
      return payload.sub; // Ou ajuste conforme sua lógica
    }
    return null;
  };

  if (!userProfile) {
    return <p>Carregando...</p>; // Ou outro indicador de carregamento
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 select-none">
          {userProfile.nome}
          <ChevronDown className="h-4 w-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span>{userProfile.nome}</span>
          <span className="text-xs font-normal text-muted-foreground">{userProfile.email}</span>          
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Building className="w-4 h-4 mr-2" />
          <span>Perfil: {userProfile.id_perfil}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-violet-600 dark:text-violet-400">
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

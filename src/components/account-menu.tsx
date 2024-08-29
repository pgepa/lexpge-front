import { useEffect, useState } from "react";
import { Building, ChevronDown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { api } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { UserEditarSenha } from '@/pages/app/gestao/user-senha';

export type GetProfileResponse = {
    id: number;
    nome: string;
    email: string;
    id_perfil: number;
    ativo: boolean;
};

export function AccountMenu() {
    const [userProfile, setUserProfile] = useState<GetProfileResponse | null>(null);
    const navigate = useNavigate();





    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    // Ajuste o endpoint para pegar as informações do perfil do usuário
                    const response = await api.get<GetProfileResponse>("/auth/profile", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log("Response data:", response.data);

                    setUserProfile(response.data);
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Erro ao buscar o perfil do usuário:", error.message);
                    } else {
                        console.error("Erro desconhecido:", error);
                    }
                }
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // Função para mapear o id_perfil para uma string descritiva
    const getPerfilDescription = (id_perfil: number) => {
        switch (id_perfil) {
            case 1:
                return "Administrador";
            case 2:
                return "Chefia";
            case 3:
                return "Estagiário";
            default:
                return "Desconhecido";
        }
    };

    if (!userProfile) {
        return <p>Carregando...</p>;
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 select-none">
                        {userProfile.nome}
                        <ChevronDown className="h-4 w-4" />
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
                        <span>Perfil: {getPerfilDescription(userProfile.id_perfil)}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuLabel >
                        <UserEditarSenha />
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />



                    <DropdownMenuItem className="text-violet-600 dark:text-violet-400 cursor-pointer" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>Sair</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>




        </div>


    );
}

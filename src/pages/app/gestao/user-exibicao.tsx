import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PencilLine, Trash2 } from 'lucide-react';

export type UserCard = {
  id: number;
  nome: string;
  email: string;
  id_perfil: number;
};

export const UserCard = () => {
  const [users, setUsers] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters] = useState({
    nome: "",
    email: "",
    id_perfil: "",
  });
  const [isFiltering] = useState(false);
  const navigate = useNavigate();

  async function loadUserCard() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const route = isFiltering ? '/admin/usuario' : '/auth/users';
      const response = await api.get(route, {
        params: {
          limite: 1000, // Obtém um número alto para garantir que todos os dados sejam carregados de uma vez
          ...filters,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUserCard();
  }, [filters]);

  const handleEditClick = (user: UserCard) => {
    navigate(`/admin/editar/${user.id}`, { state: { user } });
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Tem certeza de que deseja desabilitar este usuário?")) {
      try {
        const token = localStorage.getItem('token');

        const response = await api.put(`/auth/disable_user/${id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUsers(users.filter((user) => user.id !== id));
          alert("Usuário desabilitado com sucesso.");
        } else {
          alert("Erro ao desabilitar o usuário.");
        }
      } catch (error) {
        console.error("Erro ao desabilitar o usuário:", error);
        alert("Erro ao desabilitar o registro.");
      }
    }
  };

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

  return (
    <>
      {loading && <p>Carregando...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {users.map((user) => (
          <Card key={user.id} className="flex flex-col p-4 border border-gray-200 rounded-lg shadow-md">
            <CardHeader className="flex flex-col space-y-2 pb-4">
              <CardTitle className="text-lg font-semibold text-blue-700 dark:text-blue-300 truncate">{user.nome}</CardTitle>
              <CardDescription className="text-sm text-gray-500">{getPerfilDescription(user.id_perfil)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-gray-600">{user.email}</p>
            </CardContent>
            <CardFooter className="flex gap-2 mt-4">
              <Button
                variant="default"
                size="xs"
                className="gap-2"
                onClick={() => handleEditClick(user)}
              >
                <PencilLine className="h-4 w-4" />
                Editar
                <span className="sr-only">Editar usuário</span>
              </Button>
              <Button
                variant="destructive"
                size="xs"
                className="gap-2"
                onClick={() => handleDeleteClick(user.id)}
              >
                <Trash2 className="h-4 w-4" />
                Desabilitar
                <span className="sr-only">Desabilitar usuário</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

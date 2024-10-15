import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserEditar } from './user-editar';
import { UserAtivo } from './user-ativo';

export type UserCardProps = {
  id: number;
  nome: string;
  email: string;
  id_perfil: number;
  ativo: boolean;
};

export const UserCard = () => {
  const [users, setUsers] = useState<UserCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters] = useState({
    nome: "",
    email: "",
    id_perfil: "",
    ativo: "",
  });
  const [isFiltering] = useState(false);

  const loadUserCard = async () => {
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
  };

  // Função para obter a descrição do perfil
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

  const handleStatusChange = () => {
    loadUserCard();
  };

  useEffect(() => {
    loadUserCard();
  }, [filters]);

  return (
    <>
      {loading && <p>Carregando...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {users.map((user) => (
          <Card key={user.id} className="flex flex-col p-4 border rounded-lg shadow-xl">
            <CardHeader className="flex flex-col space-y-2 pb-4">
              <CardTitle className="text-xl font-semibold text-muted-foreground text-blue-700 dark:text-blue-300 truncate">
                {user.nome}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {getPerfilDescription(user.id_perfil)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">{user.email}</p>
            </CardContent>
            <CardFooter className="flex gap-2 mt-1">
              <UserEditar user={user} />
              <UserAtivo userId={user.id} ativo={user.ativo} onStatusChange={handleStatusChange} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

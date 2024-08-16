import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PencilLine, Trash2 } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type UserCard = {
  id: number;
  nome: string;
  email: string;
  id_perfil: number;
};

export const UserCard = () => {
  const [users, setUsers] = useState<UserCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters] = useState({
    nome: "",
    email: "",
    id_perfil: "",
  });
  const [isFiltering] = useState(false);
  const limit = 10;
  const navigate = useNavigate();
  const paginationRange = 5;

  async function loadUserCard(pagina = 1, filters = {}) {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const route = isFiltering ? '/admin/usuario' : '/auth/users';
      const response = await api.get(route, {
        params: {
          pagina,
          limite: limit,
          ...filters,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedUsers = response.data;
      setUsers(fetchedUsers);

      if (fetchedUsers.length < limit && pagina === 1) {
        setTotalPages(1); // Apenas uma página se não houver mais dados
      } else if (fetchedUsers.length < limit) {
        setTotalPages(pagina); // Última página com menos usuários que o limite
      } else {
        setTotalPages(pagina + 1); // Pode haver mais páginas
      }
      
      setCurrentPage(pagina);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUserCard(currentPage, filters);
  }, [currentPage, filters]);

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

  const handlePageChange = (pagina: number) => {
    if (pagina > 0 && pagina <= totalPages) {
      setCurrentPage(pagina);
    }
  };

  const renderPaginationItems = () => {
    let startPage = Math.max(currentPage - Math.floor(paginationRange / 2), 1);
    const endPage = Math.min(startPage + paginationRange - 1, totalPages);
    
    if (endPage - startPage + 1 < paginationRange) {
      startPage = Math.max(endPage - paginationRange + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
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
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader className="flex-items-center flex-row justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium -tracking-tight text-blue-700 dark:text-blue-300">
                {user.nome}
              </CardTitle>
              <CardDescription>{getPerfilDescription(user.id_perfil)}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              {user.email}
            </p>
          </CardContent>
          <CardFooter className="flex justify-start gap-2">
            <div className="relative flex flex-row items-center justify-center gap-2">
              <Button
                variant="default"
                size="xs"
                className="gap-2"
                onClick={() => handleEditClick(user)}
              >
                <PencilLine className="h-3 w-3" />
                Editar
                <span className="sr-only">Editar usuário</span>
              </Button>
              <Button
                variant="destructive"
                size="xs"
                className="gap-2"
                onClick={() => handleDeleteClick(user.id)}
              >
                <Trash2 className="h-3 w-3" />
                Desabilitar
                <span className="sr-only">Desabilitar usuário</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      <Pagination className="sticky bottom-0 bg-white py-2">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationPrevious
              onClick={() => handlePageChange(1)}
            >
              {currentPage === 2 ? 'Primeira Página' : 'Anterior'}
            </PaginationPrevious>
          )}
          {renderPaginationItems()}
          {currentPage < totalPages && (
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
};

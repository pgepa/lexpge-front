import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, PencilLine, SquareArrowOutUpRight, Trash2 } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AtosTableFilters } from '@/pages/app/atos/atos-table-filters';

export type AtoCard = {
  id: number;
  titulo: string;
  situacao: string;
  ementa: string;
};

export const AtosCard = () => {
  const [atos, setAtos] = useState<AtoCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    conteudo: "",
    numero: "",
    ano: "",
    tipo: "todos",
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const limit = 10;
  const navigate = useNavigate();
  const paginationRange = 5;

  async function loadAtosCard(pagina = 1, filters = {}) {
    setLoading(true);
    try {
      const route = isFiltering ? '/atos/busca' : '/atos';
      const response = await api.get(route, {
        params: {
          pagina,
          limite: limit,
          ...filters,
        },
      });

      const fetchedAtos = response.data;
      setAtos(fetchedAtos);

      if (fetchedAtos.length < limit) {
        setTotalPages(pagina);
      } else if (fetchedAtos.length === limit) {
        setTotalPages(pagina + 1);
      }
      
      setCurrentPage(pagina);
    } catch (error) {
      console.error('Erro ao carregar atos:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAtosCard(currentPage, filters);
  }, [currentPage, filters]);

  const handleFichaClick = (ato: AtoCard) => {
    navigate(`/ficha/${ato.id}`, { state: { ato } });
  };

  const handleTextoIntegralClick = (ato: AtoCard) => {
    navigate(`/texto-integral/${ato.id}`, { state: { ato } });
  };

  const handleEditClick = (ato: AtoCard) => {
    navigate(`/editar/${ato.id}`, { state: { ato } });
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Tem certeza de que deseja excluir este registro?")) {
      try {
        const response = await api.delete(`/atos/${id}`);

        if (response.status === 204) {
          setAtos(atos.filter((ato) => ato.id !== id));
          alert("Registro excluído com sucesso.");
        } else {
          alert("Erro ao excluir o registro.");
        }
      } catch (error) {
        console.error("Erro ao excluir o registro:", error);
        alert("Erro ao excluir o registro.");
      }
    }
  };

  const handlePageChange = (pagina: number) => {
    if (pagina > 0 && pagina <= totalPages) {
      setCurrentPage(pagina);
    }
  };

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
    setIsFiltering(true);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const resetFilters = {
      conteudo: "",
      numero: "",
      ano: "",
      tipo: "todos",
    };
    setFilters(resetFilters);
    setIsFiltering(false);
    setCurrentPage(1);
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

  return (
    <>
      <AtosTableFilters onFilter={handleFilter} onClearFilters={handleClearFilters} />
      {loading && <p>Carregando...</p>}
      {atos.map((ato) => (
        <Card key={ato.id}>
          <CardHeader className="flex-items-center flex-row justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium -tracking-tight text-blue-700 dark:text-blue-300">
                {ato.titulo}
              </CardTitle>
              <CardDescription>{ato.situacao}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <span>
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                {ato.ementa}
              </p>
            </span>
          </CardContent>
          <CardFooter className="flex justify-start gap-2">
            <div className="relative flex flex-row items-center justify-center gap-2">
              <Button
                variant="outline"
                size="xs"
                className="gap-2 border-amber-500 font-normal text-amber-500 hover:text-amber-600 dark:border-amber-300 dark:text-amber-300"
                onClick={() => handleFichaClick(ato)}
              >
                <Eye className="h-3 w-3" />
                Ficha
                <span className="sr-only">Ficha do ato normativo</span>
              </Button>
              <Button
                variant="outline"
                size="xs"
                className="gap-2 border-amber-500 font-normal text-amber-500 hover:text-amber-600 dark:border-amber-300 dark:text-amber-300"
                onClick={() => handleTextoIntegralClick(ato)}
              >
                <SquareArrowOutUpRight className="h-3 w-3" />
                Texto Integral
                <span className="sr-only">
                  Visualizar texto integral do ato normativo
                </span>
              </Button>
              <Button
                variant="default"
                size="xs"
                className="gap-2"
                onClick={() => handleEditClick(ato)}
              >
                <PencilLine className="h-3 w-3" />
                Editar
                <span className="sr-only">Editar ato normativo</span>
              </Button>
              <Button
                variant="destructive"
                size="xs"
                className="gap-2"
                onClick={() => handleDeleteClick(ato.id)}
              >
                <Trash2 className="h-3 w-3" />
                Excluir
                <span className="sr-only">Excluir ato normativo</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      <Pagination className="sticky bottom-0 bg-white py-2">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationPrevious
              onClick={() => handlePageChange(1)} // Navega para a primeira página
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

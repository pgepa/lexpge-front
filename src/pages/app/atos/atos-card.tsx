import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, PencilLine, SquareArrowOutUpRight, Trash2 } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
  const [isFiltering, setIsFiltering] = useState(false); // Novo estado para rastrear se está filtrando
  const limit = 10;
  const navigate = useNavigate();

  async function loadAtosCard(pagina = 1, filters = {}) {
    setLoading(true);
    try {
      const route = isFiltering ? '/atos/busca' : '/atos'; // Escolha a rota com base no estado isFiltering
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
    setIsFiltering(true); // Indicando que estamos aplicando filtros
    setCurrentPage(1); // Resetar para a primeira página quando os filtros são alterados
  };

  const handleClearFilters = () => {
    const resetFilters = {
      conteudo: "",
      numero: "",
      ano: "",
      tipo: "todos",
    };
    setFilters(resetFilters);
    setIsFiltering(false); // Indicando que não estamos aplicando filtros
    setCurrentPage(1); // Voltar para a primeira página
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
      <Pagination>
        <PaginationContent>
          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink onClick={() => handlePageChange(index + 1)} isActive={currentPage === index + 1}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
        </PaginationContent>
      </Pagination>
    </>
  );
};

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, SquareArrowOutUpRight} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AtosPublicFilters } from '@/pages/app/atosPublic/atos-public-filters';

export type AtoCardPublic = {
  id: number;
  titulo: string;
  situacao: string;
  ementa: string;
  descritores: string;
};

export const AtosCardPublic = () => {
  const [atos, setAtos] = useState<AtoCardPublic[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    conteudo: "",
    descritores: "",
    numero: "",
    ano: "",
    tipo: "todos",
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const limit = 10;
  const paginationRange = 5;

  async function loadAtosCardPublic(pagina = 1, filters = {}) {
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
    loadAtosCardPublic(currentPage, filters);
  }, [currentPage, filters]);

  const handleFichaClick = (ato: AtoCardPublic) => {
    const fichaUrl = `/ficha/${ato.id}`;
    const link = document.createElement('a');
    link.href = fichaUrl;
    link.target = '_blank';
    link.click();
  };

  const handleTextoIntegralClick = (ato: AtoCardPublic) => {
    const textoIntegralUrl = `/texto-integral/${ato.id}`;
    const link = document.createElement('a');
    link.href = textoIntegralUrl;   
    link.target = '_blank';
    link.click();
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
      <AtosPublicFilters onFilter={handleFilter} />
      {loading && <p>Carregando...</p>}
      {atos.map((ato) => (
        <Card key={ato.id} className='shadow-lg shadow-blue-600/40'>
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
            <span>
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
        
            </div>
          </CardFooter>
        </Card>
      ))}
      <Pagination className="sticky bottom-0 bg-white dark:bg-transparent py-2">
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

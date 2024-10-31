import { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, PencilLine, SearchX, SquareArrowOutUpRight} from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { AtosTableFilters } from '@/pages/app/atos/atos-table-filters';
import GridLoader from 'react-spinners/GridLoader';

export type AtoCard = {
    id: number;
    titulo: string;
    situacao: string;
    ementa: string;
    descritores: string;
};

export const AtosCardEstagiario = () => {
    const [atos, setAtos] = useState<AtoCard[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
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

            const { resultados, total } = response.data; // Obter resultados e total
            setAtos(resultados);
            setTotalResults(total); // Atualizar total de resultados
            setTotalPages(Math.ceil(total / limit)); // Calcular total de páginas
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
        const fichaUrl = `/#/ficha/${ato.id}`;
        const link = document.createElement('a');
        link.href = fichaUrl;
        link.target = '_blank';
        link.click();
    };

    const handleTextoIntegralClick = (ato: AtoCard) => {
        const textoIntegralUrl = `/#/texto-integral/${ato.id}`;
        const link = document.createElement('a');
        link.href = textoIntegralUrl;
        link.target = '_blank';
        link.click();
    };

    const handleEditClick = (ato: AtoCard) => {
        navigate(`/estagiario/editar/${ato.id}`, { state: { ato } });
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
        const pages = [];
        let startPage = Math.max(currentPage - Math.floor(paginationRange / 2), 1);
        const endPage = Math.min(startPage + paginationRange - 1, totalPages);

        if (endPage - startPage + 1 < paginationRange) {
            startPage = Math.max(endPage - paginationRange + 1, 1);
        }

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
            <AtosTableFilters onFilter={handleFilter} />

            <h2 className='text-xl font-semibold text-justify mt-4 text-slate-700 dark:text-blue-300'>
                {totalResults} resultados encontrados
            </h2>

            {loading && (
                <div className="flex justify-center items-center h-screen">
                    <GridLoader size={16} color="#3727c9" />
                </div>
            )}

            {!loading && (!atos || atos.length === 0) && (
                <div className='text-xl items-center flex flex-col font-semibold text-justify mt-4 text-muted-foreground'>
                    <p>Não foi encontrado nenhum Ato Normativo para o(s) filtro(s) selecionado(s).</p>
                    <p>Tente novamente com outros parâmetros.</p>
                    <SearchX className="h-12 w-12 mt-4" />
                </div>
            )}

            {atos.map((ato) => (
                <Card key={ato.id} className='shadow-md shadow-blue-500/40'>
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
                            <p className="leading-7 [&:not(:first-child)]:mt-6">{ato.ementa}</p>
                        </span>
                        <span>
                            <CardDescription className='mt-2'>{ato.descritores}</CardDescription>
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
                                <span className="sr-only">Visualizar texto integral do ato normativo</span>
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
                            {/**
                             * <Button
                                variant="destructive"
                                size="xs"
                                className="gap-2"
                                onClick={() => handleDeleteClick(ato.id)}
                            >
                                <Trash2 className="h-3 w-3" />
                                Excluir
                                <span className="sr-only">Excluir ato normativo</span>
                            </Button>
                             * 
                             * 
                             */}
                            
                        </div>
                    </CardFooter>
                </Card>
            ))}
            <Pagination className="sticky bottom-0 bg-white dark:bg-transparent py-2">
                <PaginationContent>
                    {currentPage > 1 && (
                        <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)}>
                            {currentPage === 2 ? 'Primeira Página' : 'Anterior'}
                        </PaginationPrevious>
                    )}
                    {renderPaginationItems()}
                    {currentPage < totalPages && (
                        <PaginationNext onClick={() => handlePageChange(currentPage + 1)}>
                            Próxima
                        </PaginationNext>
                    )}
                </PaginationContent>
                <div className="text-center text-sm text-gray-600 mt-2">
                    Página {currentPage} de {totalPages}
                </div>
            </Pagination>
        </>
    );
};

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, SquareArrowOutUpRight, SearchX } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { AtosPublicFilters } from '@/pages/app/atosPublic/atos-public-filters';
import GridLoader from "react-spinners/GridLoader";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState<string>('data_ato_d');
    const [filters, setFilters] = useState({
        conteudo: "",
        descritores: "",
        numero: "",
        ano: "",
        tipo: "todos",
    });
    const [isFiltering, setIsFiltering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const limit = 10;
    const paginationRange = 5;

    async function loadAtosCardPublic(pagina = 1, filters = {}, order = sortOrder) {
        setLoading(true);
        setError(null);
        try {
            const route = isFiltering ? '/atos/busca' : '/atos';
            const response = await api.get(route, {
                params: {
                    pagina,
                    limite: limit,
                    ordem: order, // Passando o parâmetro de ordenação
                    ...filters,
                },
            });

            const { resultados, total } = response.data;
            setAtos(resultados);
            setTotalResults(total);
            setTotalPages(Math.ceil(total / limit));
            setCurrentPage(pagina);
        } catch (error) {
            console.error('Erro ao carregar atos:', error);
            setError('Erro ao carregar atos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAtosCardPublic(currentPage, filters, sortOrder);
    }, [currentPage, filters, sortOrder]);

    const handleFichaClick = (ato: AtoCardPublic) => {
        const fichaUrl = `/#/ficha/${ato.id}`;
        const link = document.createElement('a');
        link.href = fichaUrl;
        link.target = '_blank';
        link.click();
    };

    const handleTextoIntegralClick = (ato: AtoCardPublic) => {
        const textoIntegralUrl = `/#/texto-integral/${ato.id}`;
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

    const handleSortOrderChange = (order: string) => {
        setSortOrder(order);
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

    if (error) return <div>{error}</div>;

    return (
        <>
            <AtosPublicFilters onFilter={handleFilter} />

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

            {atos && atos.length > 0 && (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 space-y-2 sm:space-y-0">
                        <p className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-blue-300 text-center sm:text-left">
                            {Number(totalResults).toLocaleString('pt-BR')} resultados encontrados
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <Label className="font-semibold text-sm text-gray-800 dark:text-white text-center sm:text-left">Ordenação:</Label>
                            <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                                <SelectTrigger className="w-full sm:w-auto">
                                    <SelectValue placeholder="Escolha uma opção" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevancia">Relevância dos resultados</SelectItem>
                                    <SelectItem value="data_ato_d">Maior data do ato</SelectItem>
                                    <SelectItem value="dataatoasc">Menor data do ato</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

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
                                <p className="leading-7 [&:not(:first-child)]:mt-6">
                                    {ato.ementa}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-start gap-2">
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
            )}
        </>
    );
};

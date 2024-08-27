import React, { useContext, useEffect, useState } from 'react';
import { SearchContext } from '@/Context/SearchContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, SquareArrowOutUpRight } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { api } from '@/lib/axios';

interface AtosData {
    data_alteracao: string;
    data_ato: string;
    data_criacao: string;
    data_publicacao: string;
    descritores: string;
    ementa: string;
    fonte: string;
    id: string;
    numero: number;
    numero_formatado: string;
    observacao: string;
    relevancia: number;
    situacao: string;
    texto_compilado: string;
    tipo_id: string;
    titulo: string;
}

const ResultsList: React.FC = () => {
    const { query } = useContext(SearchContext)!;
    const [data, setData] = useState<AtosData[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (query) {
            fetchResults(1); // Nova busca sempre começa na página 1
        }
    }, [query]);

    useEffect(() => {
        if (query) {
            fetchResults(currentPage); // Busca resultados quando a página atual muda
        }
    }, [currentPage]);

    const fetchResults = async (pagina: number) => {
        setLoading(true);
        setError(null);

        const queryString = new URLSearchParams({
            conteudo: query.conteudo,
            descritores: query.descritores,
            numero: query.numero,
            ano: query.ano,
            tipo: query.tipo,
            pagina: pagina.toString(),
            limite: itemsPerPage.toString(),
            texto_compilado: 'false'
        }).toString();

        try {
            const response = await api.get(`/atos/busca?${queryString}`);
            const fetchedData = response.data;
            setData(fetchedData);
            setTotalPages(fetchedData.length < itemsPerPage ? pagina : pagina + 1);
        } catch (err) {
            setError('Erro ao buscar dados');
            console.error('Erro ao buscar dados:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pagina: number) => {
        if (pagina > 0 && pagina <= totalPages) {
            setCurrentPage(pagina);
        }
    };

    const renderPaginationItems = () => {
        const pages = [];
        const startPage = Math.max(currentPage - 2, 1);
        const endPage = Math.min(currentPage + 2, totalPages);

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

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;
    if (!data || data.length === 0) return <div className='text-2xl font-bold tracking-tight text-justify mt-4 text-orange-500'>Não foi encontrado nenhum resultado contendo todos os termos de pesquisa.</div>;

    return (
        <div className='flex flex-col gap-4'>
            <h2 className='text-2xl font-bold tracking-tight text-justify mt-4 text-blue-700'>Resultados para a busca:</h2>
            {data.map((ato) => (
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
                        <p className="leading-7 [&:not(:first-child)]:mt-6">{ato.ementa}</p>
                    </CardContent>
                    <CardFooter className="flex justify-start gap-2">
                        <Button
                            variant="outline"
                            size="xs"
                            className="gap-2 border-amber-500 font-normal text-amber-500 hover:text-amber-600 dark:border-amber-300 dark:text-amber-300"
                            onClick={() => window.open(`/#/ficha/${ato.id}`, '_blank')}
                        >
                            <Eye className="h-3 w-3" />
                            Ficha
                        </Button>
                        <Button
                            variant="outline"
                            size="xs"
                            className="gap-2 border-amber-500 font-normal text-amber-500 hover:text-amber-600 dark:border-amber-300 dark:text-amber-300"
                            onClick={() => window.open(`/#/texto-integral/${ato.id}`, '_blank')}
                        >
                            <SquareArrowOutUpRight className="h-3 w-3" />
                            Texto Integral
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
            </Pagination>
        </div>
    );
};

export default ResultsList;

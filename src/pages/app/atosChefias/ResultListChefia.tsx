import React, { useContext, useEffect, useState } from 'react';
import { SearchContext } from '@/Context/SearchContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, SquareArrowOutUpRight, SearchX } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { api } from '@/lib/axios';
import GridLoader from "react-spinners/GridLoader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AtosData {
    data_alteracao: string | null;
    data_ato: string;
    data_criacao: string;
    data_publicacao: string;
    descritores: string;
    ementa: string;
    fonte: string;
    id: number;
    numero: number;
    numero_formatado: string;
    observacao: string;
    relevancia: number;
    situacao: string;
    texto_compilado: boolean;
    tipo_id: string;
    titulo: string;
}

const ResultsList: React.FC = () => {
    const { query } = useContext(SearchContext)!;
    const [data, setData] = useState<AtosData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sortOrder, setSortOrder] = useState<string>('data_ato_d'); // valor padrão
    const [totalResults, setTotalResults] = useState<number>(0);
    const itemsPerPage = 10;

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (query) {
            fetchResults(1);
        }
    }, [query, sortOrder]);

    useEffect(() => {
        if (query) {
            fetchResults(currentPage);
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
            texto_compilado: 'false',
            ordem: sortOrder // Atualizado para 'ordem'
        }).toString();

        try {
            const response = await api.get(`/atos/busca?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const fetchedData = response.data.resultados;
            const totalItems = response.data.total;
            const itemsPerPage = response.data.resultados_por_pagina;

            setData(fetchedData);
            setTotalResults(totalItems);
            setTotalPages(Math.ceil(totalItems / itemsPerPage));
        } catch (err) {
            setError('Erro ao buscar dados');
            console.error('Erro ao buscar dados:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSortOrderChange = (ordem: string) => {
        setSortOrder(ordem);
        setCurrentPage(1); // reinicia para a primeira página após mudar a ordenação
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <GridLoader size={16} color="#3727c9" />
            </div>
        );
    }
    if (error) return <div>{error}</div>;
    if (!data || data.length === 0) return (
        <div className='text-xl items-center flex flex-col font-semibold text-justify mt-8 text-muted-foreground'>
            <p>Não foi encontrado nenhum Ato Normativo para o(s) filtro(s) selecionado(s).</p>
            <p>Tente novamente com outros parâmetros.</p>
            <SearchX className="h-12 w-12 mt-4" />
        </div>
    );

        

    return (
        <div className='flex flex-col gap-4'>
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
                            <SelectItem value="data_ato_d">Maior data do ato</SelectItem>
                            <SelectItem value="dataatoasc">Menor data do ato</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>


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
                        <span>
                            <CardDescription className='mt-2'>{ato.descritores}</CardDescription>
                        </span>
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
                <div className="text-center text-sm text-gray-600 mt-2">
                    Página {currentPage} de {totalPages}
                </div>
            </Pagination>
        </div>
    );
};

export default ResultsList;

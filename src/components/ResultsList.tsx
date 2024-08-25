import React, { useContext, useEffect, useState } from 'react';
import { SearchContext } from '@/Context/SearchContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, SquareArrowOutUpRight } from 'lucide-react';

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

    // Estados para paginação
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10; 
    // Número de itens por página

    useEffect(() => {
        if (query) {
            setLoading(true);
            const queryString = new URLSearchParams({
                conteudo: query.conteudo,
                descritores: query.descritores,
                numero: query.numero,
                ano: query.ano,
                tipo: query.tipo,
                pagina: currentPage.toString(),
                limite: itemsPerPage.toString(),
                texto_compilado: 'false' // Default conforme descrito
            }).toString();

            console.log("Fetching data with query:", queryString);

            fetch(`${import.meta.env.VITE_API_URL}/atos/busca?${queryString}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Received data:", data);
                    setData(data); // Atribui diretamente o array de atos
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Erro ao buscar dados:', err);
                    setError('Erro ao buscar dados');
                    setLoading(false);
                });
        }
    }, [query, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && data && data.length > 0) {
            setCurrentPage(newPage);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!data || data.length === 0) {
        return <div>
            <h2 className='text-2xl font-bold tracking-tight text-justify mt-4 text-blue-700'>Nenhum resultado encontrado</h2>
        </div>;
    }

    const handleFichaClick = (ato: AtosData) => {
        const fichaUrl = `/ficha/${ato.id}`;
        const link = document.createElement('a');
        link.href = fichaUrl;
        link.target = '_blank';
        link.click();
    };

    const handleTextoIntegralClick = (ato: AtosData) => {
        const textoIntegralUrl = `/texto-integral/${ato.id}`;
        const link = document.createElement('a');
        link.href = textoIntegralUrl;
        link.target = '_blank';
        link.click();
    };

    return (
        <div className='flex flex-col gap-4'>
            <h2 className='text-2xl font-bold tracking-tight text-justify mt-4 text-blue-700'>Resultados para a busca</h2>
            {data.map((ato) => (
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
                        <span></span>
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

            {/* Componentes de Paginação */}
            <div className="flex justify-center mt-4">
                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </Button>
                <span className="mx-2">
                    Página {currentPage}
                </span>
                <Button onClick={() => handlePageChange(currentPage + 1)} disabled={data.length < itemsPerPage}>
                    Próxima
                </Button>
            </div>
        </div>
    );
};

export default ResultsList;

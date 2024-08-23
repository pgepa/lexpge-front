import React, { useContext, useState } from 'react';
import { SearchContext } from '@/Context/SearchContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Input } from "@/components/ui/input";
import logo from '@/assets/logo.svg';
import { Button } from "@/components/ui/button";
import { Search, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SearchForm: React.FC = () => {
    const { query, setQuery } = useContext(SearchContext)!;
    const [localQuery, setLocalQuery] = useState<{ conteudo: string; descritores: string; numero: string; ano: string; tipo: string }>({
        conteudo: query.conteudo,
        descritores: query.descritores,
        numero: query.numero,
        ano: query.ano,
        tipo: query.tipo,
    });
    const navigate = useNavigate();

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        setQuery(localQuery);
        navigate('/results');
    };

    return (
        <>
            <Helmet title="Início" />
            <form className="flex flex-col gap-4 items-center p-4 sm:p-6 md:p-8">

                <img className="w-24 h-24" src={logo} alt="Logo" />
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Procuradoria-Geral do Estado do Pará</h1>
                <h2 className="text-lg sm:text-xl tracking-tight text-muted-foreground">Base de Atos Normativos - LEXPGE</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">

                    <Input
                        placeholder='Número'
                        value={localQuery.numero}
                        onChange={(e) => setLocalQuery({ ...localQuery, numero: e.target.value })}
                    />
                    <Input
                        placeholder="Ano"
                        value={localQuery.ano}
                        onChange={(e) => setLocalQuery({ ...localQuery, ano: e.target.value })}
                        className="w-full"
                    />

                    <Input
                        placeholder="Busca por descritores"
                        value={localQuery.descritores}
                        onChange={(e) => setLocalQuery({ ...localQuery, descritores: e.target.value })}
                        className="w-full sm:w-auto"
                    />

                    <Select
                        value={localQuery.tipo}
                        onValueChange={(value) => setLocalQuery({ ...localQuery, tipo: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Constituição Estadual">Constituição Estadual</SelectItem>
                            <SelectItem value="Decreto Legislativo">Decreto Legislativo</SelectItem>
                            <SelectItem value="Decreto Lei">Decreto Lei</SelectItem>
                            <SelectItem value="Decreto Numerado">Decreto Numerado</SelectItem>
                            <SelectItem value="Decreto Não Numerado">Decreto Não Numerado</SelectItem>
                            <SelectItem value="Emenda Constitucional">Emenda Constitucional</SelectItem>
                            <SelectItem value="Instrução Normativa">Instrução Normativa</SelectItem>
                            <SelectItem value="Lei Complementar">Lei Complementar</SelectItem>
                            <SelectItem value="Lei Ordinária">Lei Ordinária</SelectItem>
                            <SelectItem value="Mensagem do Governador">Mensagem do Governador</SelectItem>
                            <SelectItem value="Portaria">Portaria</SelectItem>
                            <SelectItem value="Portaria Conjunta">Portaria Conjunta</SelectItem>
                            <SelectItem value="Resolução">Resolução</SelectItem>
                        </SelectContent>
                    </Select>


                    <Input
                        placeholder="Busca por avançada por termos"
                        value={localQuery.conteudo}
                        onChange={(e) => setLocalQuery({ ...localQuery, conteudo: e.target.value })}
                        className="w-full sm:col-span-2 md:col-span-4"
                    />

                </div>

                <Button onClick={handleSearch} type="submit" variant="secondary" size="default" className="w-full sm:w-auto">
                    <Search className="h-4 w-4 mr-2" />
                    Pesquisar
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex items-center"
                >
                    <X className="h-4 w-4 mr-2" />
                    Remover filtros
                </Button>

            </form>


        </>

    );
};

export default SearchForm;

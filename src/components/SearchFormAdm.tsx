import React, { useContext, useState } from 'react';
import { SearchContext } from '@/Context/SearchContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Input } from "@/components/ui/input";
import logo from '@/assets/logo.svg';
import { Button } from "@/components/ui/button";
import { Search, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";




const SearchFormAdmin: React.FC = () => {
    const { query, setQuery } = useContext(SearchContext)!;
    const [localQuery, setLocalQuery] = useState<{ conteudo: string; descritores: string; numero: string; ano: string; tipo: string; texto_compilado: boolean; situacao: string; }>({
        conteudo: query.conteudo ?? '',
        descritores: query.descritores ?? '',
        numero: query.numero ?? '',
        ano: query.ano ?? '',
        tipo: query.tipo || 'todos',
        texto_compilado: query.texto_compilado || false,
        situacao: query.situacao || 'todas',
    });
    const navigate = useNavigate();

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        setQuery(localQuery);
        navigate('/admin/results');
    };

    const handleClearFilters = () => {
        // Reseta o estado local para os valores iniciais
        setLocalQuery({
            conteudo: '',
            descritores: '',
            numero: '',
            ano: '',
            tipo: 'todos',
            texto_compilado: false,
            situacao: 'todas',
        });

        // Também reseta o contexto se necessário
        setQuery({
            conteudo: '',
            descritores: '',
            numero: '',
            ano: '',
            tipo: 'todos',
            texto_compilado: false,
            situacao: 'todas',
        });
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
                        placeholder="Número"
                        value={localQuery.numero}
                        onChange={(e) => setLocalQuery({ ...localQuery, numero: e.target.value })}
                        className="w-full"
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
                        className="w-full"
                    />

                    <Select
                        value={localQuery.tipo}
                        onValueChange={(value) => setLocalQuery({ ...localQuery, tipo: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os tipos</SelectItem>
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

                    <Select
                        value={localQuery.situacao}
                        onValueChange={(value) => setLocalQuery({ ...localQuery, situacao: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Situação" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todas as situações</SelectItem>
                            <SelectItem value="Vigente">Vigente</SelectItem>
                            <SelectItem value="Revogado">Revogado(a)</SelectItem>
                            <SelectItem value="Revogado Parcialmente">Revogado(a) Parcialmente</SelectItem>
                            <SelectItem value="Sem Efeito">Sem Efeito</SelectItem>
                            <SelectItem value="Sem Revogação Expressa">Sem Revogação Expressa</SelectItem>
                            <SelectItem value="Inconstitucional">Declarado(a) Inconstitucional</SelectItem>
                            <SelectItem value="Vetado(a)">Vetado(a)</SelectItem>
                            <SelectItem value="Suspensa">Eficácia Suspensa</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Busca avançada por termos"
                        value={localQuery.conteudo}
                        onChange={(e) => setLocalQuery({ ...localQuery, conteudo: e.target.value })}
                        className="w-full sm:col-span-2 md:col-span-3"
                    />

                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
                    <Button onClick={handleSearch} type="submit" size="lg" className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 w-full sm:w-auto">
                        <Search className="h-4 w-4 mr-2" />
                        Pesquisar
                    </Button>
                    <Button
                        onClick={handleClearFilters}
                        type="button"
                        variant="secondary"
                        size="lg"
                        className="w-full sm:w-auto flex items-center"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Remover filtros
                    </Button>
                </div>


            </form>


        </>

    );
};

export default SearchFormAdmin;

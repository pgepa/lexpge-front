import React, { useContext, useState } from 'react';
import { SearchContext } from '@/Context/SearchContext';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SearchFilter: React.FC = () => {
    const { query, setQuery } = useContext(SearchContext)!;
    const [localQuery, setLocalQuery] = useState<{ conteudo: string; descritores: string; numero: string; ano: string; tipo: string; texto_compilado: boolean; situacao: string; }>({
        conteudo: query.conteudo || '',
        descritores: query.descritores || '',
        numero: query.numero || '',
        ano: query.ano || '',
        tipo: query.tipo || 'todos',
        texto_compilado: query.texto_compilado || false,
        situacao: query.situacao || 'todas',
    });
    const navigate = useNavigate();

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        setQuery(localQuery);
        navigate('/estagiario/results');
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
        <form className="flex flex-col sm:flex-row items-center gap-2 flex-wrap">

            <span className="text-lg font-semibold">Pesquisar:</span>
            <Input
                placeholder="Busca por termos"
                value={localQuery.conteudo}
                onChange={(e) => setLocalQuery({ ...localQuery, conteudo: e.target.value })}
               className="w-full sm:w-[320px]"
            />
            <Input
                placeholder='Número'
                value={localQuery.numero}
                onChange={(e) => setLocalQuery({ ...localQuery, numero: e.target.value })}
                className="w-full sm:w-auto"
            />
            <Input
                placeholder="Ano"
                value={localQuery.ano}
                onChange={(e) => setLocalQuery({ ...localQuery, ano: e.target.value })}
                className="w-full sm:w-auto"
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
                <SelectTrigger className="w-full sm:w-[220px]">
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
                <SelectTrigger className="w-full sm:w-[220px]">
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

            <Button onClick={handleSearch} type="submit"  size="default" className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Pesquisar
            </Button>

            <Button onClick={handleClearFilters} variant="outline" size="default" className="w-full sm:w-auto">
                <X className="h-4 w-4 mr-2" />
                Remover filtros
            </Button>



        </form>


    );
};

export default SearchFilter;

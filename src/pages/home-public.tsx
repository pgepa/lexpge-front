import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import logo from '@/assets/logo.svg';
import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { SearchContext } from "@/Context/SearchContext";

export function HomePublic() {
  const [numero, setNumero] = useState("");
  const [ano, setAno] = useState("");
  const [descritores, setDescritores] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [situacao, setSituacao] = useState("todas");
  const [termosBusca, setTermosBusca] = useState("");
  const { setQuery } = useContext(SearchContext)!;
  const navigate = useNavigate();

  const handleSearch = () => {
    setQuery({
      conteudo: termosBusca,
      descritores,
      numero,
      ano,
      tipo,
      texto_compilado: false,
      situacao: situacao === "todas" ? "" : situacao,
    });
    navigate("/atos/");
  };

  const handleClearFilters = () => {
    setNumero("");
    setAno("");
    setDescritores("");
    setTipo("todos");
    setSituacao("todas");
    setTermosBusca("");
  };

  return (
    <>
      <Helmet title="Início" />

      <div className="flex flex-col gap-4 items-center p-4 sm:p-6 md:p-8">
          <img className="w-24 h-24" src={logo} alt="Logo" />
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Procuradoria-Geral do Estado do Pará</h1>
          <h2 className="text-lg sm:text-xl tracking-tight text-muted-foreground">Base de Atos Normativos - LEXPGE</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
            <Input
              placeholder="Número"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Ano"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Busca por descritores"
              value={descritores}
              onChange={(e) => setDescritores(e.target.value)}
              className="w-full"
            />
            <Select
              value={tipo}
              onValueChange={(value) => setTipo(value)}
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
              value={situacao}
              onValueChange={(value) => setSituacao(value)}
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
              value={termosBusca}
              onChange={(e) => setTermosBusca(e.target.value)}
              className="w-full sm:col-span-2 md:col-span-3"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleSearch}
              className="w-full sm:w-auto flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleClearFilters}
              className="w-full sm:w-auto flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Remover filtros
            </Button>
          </div>
        </div>
    </>
  );
}

import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import logo from '@/assets/logo.svg';
import { useState } from 'react';
import { AtosCard } from "@/pages/app/atos/atos-card";

export function Inicio() {
  const [numero, setNumero] = useState("");
  const [ano, setAno] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [termosBusca, setTermosBusca] = useState("");
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  const handleSearch = () => {
    setIsSearchPerformed(true);
  };

  const handleClearFilters = () => {
    setNumero("");
    setAno("");
    setTipo("todos");
    setTermosBusca("");
    setIsSearchPerformed(false);
  };

  return (
    <>
      <Helmet title="Início" />

      {!isSearchPerformed ? (
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
            <Select
              value={tipo}
              onValueChange={(value) => setTipo(value)}
            >
              <SelectTrigger  className="w-full sm:col-span-2">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="constituicaoEstadual">Constituição Estadual</SelectItem>
                <SelectItem value="decretoLegislativo">Decreto Legislativo</SelectItem>
                <SelectItem value="decretoLei">Decreto Lei</SelectItem>
                <SelectItem value="decretoNumerado">Decreto Numerado</SelectItem>
                <SelectItem value="decretoNaoNumerado">Decreto Não Numerado</SelectItem>
                <SelectItem value="emendaConsitucional">Emenda Constitucional</SelectItem>
                <SelectItem value="instrucaoNormativa">Instrução Normativa</SelectItem>
                <SelectItem value="leiComplementar">Lei Complementar</SelectItem>
                <SelectItem value="leiOrdinaria">Lei Ordinária</SelectItem>
                <SelectItem value="mensagemDoGovernador">Mensagem do Governador</SelectItem>
                <SelectItem value="portaria">Portaria</SelectItem>
                <SelectItem value="portariaConjunta">Portaria Conjunta</SelectItem>
                <SelectItem value="resolucao">Resolução</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Busca por termos"
              value={termosBusca}
              onChange={(e) => setTermosBusca(e.target.value)}
              className="w-full sm:col-span-2 md:col-span-4"
            />
          </div>

          <div className="flex flex-row gap-4 items-center mt-4">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleSearch}
              className="flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleClearFilters}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Remover filtros
            </Button>
          </div>
        </div>
      ) : (
        <AtosCard />
      )}
    </>
  );
}

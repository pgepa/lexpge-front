import { Helmet } from "react-helmet-async";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Button } from "./components/ui/button";
import { Search, X } from "lucide-react";
import logo from './assets/logo.svg';
import { AtosCard } from '@/pages/app/atos/atos-card'; // Importando o AtosCard
import { useState } from 'react';

export function Inicio() {
  // Estados para armazenar os filtros
  const [numero, setNumero] = useState("");
  const [ano, setAno] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [termosBusca, setTermosBusca] = useState("");
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});

  // Função que realiza a busca e define os filtros
  const handleSearch = () => {
    const filters = {
      numero,
      ano,
      tipo,
      termosBusca,
    };
    setSearchFilters(filters);
    setIsSearchPerformed(true);
  };

  // Função que limpa os filtros
  const handleClearFilters = () => {
    setNumero("");
    setAno("");
    setTipo("todos");
    setTermosBusca("");
    setIsSearchPerformed(false);
  };

  return (
    <>
      <Helmet title="Início"/>

      {!isSearchPerformed ? (
        <div className="flex flex-col gap-4 items-center"> 
          <img className="w-24 h-24" src={logo} alt="Logo" />
          <h1 className="text-3xl font-bold tracking-tight col-span-2">Procuradoria-Geral do Estado do Pará</h1>
          <h2 className="text-xl tracking-tight text-muted-foreground">Base de Atos Normativos - LEXPGE</h2>
          
          <div className="grid grid-cols-4 gap-4">
            <Input 
              placeholder="Número" 
              value={numero} 
              onChange={(e) => setNumero(e.target.value)} 
            />
            <Input 
              placeholder="Ano" 
              value={ano} 
              onChange={(e) => setAno(e.target.value)} 
            />
            <div className="col-span-2">
              <Select 
                value={tipo} 
                onValueChange={(value) => setTipo(value)}
              >
                <SelectTrigger>
                  <SelectValue />
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
            </div>
            <Input 
              placeholder="Busca por termos" 
              className="col-span-4" 
              value={termosBusca} 
              onChange={(e) => setTermosBusca(e.target.value)} 
            />                
          </div>
          
          <div className="flex flex-row gap-4 items-center">
            <Button 
              type="button" 
              variant="secondary" 
              size="lg" 
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              onClick={handleClearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Remover filtros
            </Button> 
          </div>
        </div>
      ) : (
        <AtosCard filters={searchFilters} /> // Passando os filtros para o AtosCard
      )}
    </>
  );
}

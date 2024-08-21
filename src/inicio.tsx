import { Helmet } from "react-helmet-async";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Button } from "./components/ui/button";
import { Search, X } from "lucide-react";
import logo from "./assets/logo.svg";
import { AtosCard } from "@/pages/app/atos/atos-card";
import { useState } from "react";

export function Inicio() {
  const [numero, setNumero] = useState("");
  const [ano, setAno] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [termosBusca, setTermosBusca] = useState("");
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSearchPerformed(true);
    // Aqui você pode adicionar a lógica para realizar a busca com os filtros aplicados
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
        <div className="flex flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
          <img
            className="w-24 h-24 sm:w-32 sm:h-32 mb-4"
            src={logo}
            alt="Logo"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Procuradoria-Geral do Estado do Pará
          </h1>
          <h2 className="text-lg sm:text-xl text-gray-600 text-center mb-6">
            Base de Atos Normativos - LEXPGE
          </h2>

          <form
            onSubmit={handleSearch}
            className="w-full max-w-4xl flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Número"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full sm:w-1/2"
              />
              <Input
                placeholder="Ano"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className="w-full sm:w-1/2"
              />
            </div>

            <Select
              value={tipo}
              onValueChange={(value) => setTipo(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="constituicaoEstadual">
                  Constituição Estadual
                </SelectItem>
                <SelectItem value="decretoLegislativo">
                  Decreto Legislativo
                </SelectItem>
                <SelectItem value="decretoLei">Decreto Lei</SelectItem>
                <SelectItem value="decretoNumerado">
                  Decreto Numerado
                </SelectItem>
                <SelectItem value="decretoNaoNumerado">
                  Decreto Não Numerado
                </SelectItem>
                <SelectItem value="emendaConstitucional">
                  Emenda Constitucional
                </SelectItem>
                <SelectItem value="instrucaoNormativa">
                  Instrução Normativa
                </SelectItem>
                <SelectItem value="leiComplementar">
                  Lei Complementar
                </SelectItem>
                <SelectItem value="leiOrdinaria">Lei Ordinária</SelectItem>
                <SelectItem value="mensagemDoGovernador">
                  Mensagem do Governador
                </SelectItem>
                <SelectItem value="portaria">Portaria</SelectItem>
                <SelectItem value="portariaConjunta">
                  Portaria Conjunta
                </SelectItem>
                <SelectItem value="resolucao">Resolução</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Busca por termos"
              value={termosBusca}
              onChange={(e) => setTermosBusca(e.target.value)}
              className="w-full"
            />

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Search className="h-4 w-4 mr-2" />
                Filtrar resultados
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleClearFilters}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Remover filtros
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <AtosCard />
      )}
    </>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";


export function AtosTableFilters({ onFilter }: { onFilter: (filters: any) => void }) {
  const [conteudo, setConteudo] = useState("");
  const [numero, setNumero] = useState("");
  const [ano, setAno] = useState("");
  const [tipo, setTipo] = useState("todos");

  const handleFilter = (event: React.FormEvent) => {
    event.preventDefault();
    onFilter({
      conteudo: conteudo.trim() || undefined, // Enviar undefined se estiver vazio
      numero: numero.trim() || undefined,
      ano: ano.trim() || undefined,
      tipo: tipo !== "todos" ? tipo : undefined, // Enviar undefined se for "todos"
    });
  };

  const handleClearFilters = () => {
    setConteudo("");
    setNumero("");
    setAno("");
    setTipo("todos");
    onFilter({ conteudo: undefined, numero: undefined, ano: undefined, tipo: undefined });
  };

  return (
    <form onSubmit={handleFilter} className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="Busca por termos"
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        className="w-[320px]"
      />
      <Input
        placeholder="Número"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        className="w-auto"
      />
      <Input
        placeholder="Ano"
        value={ano}
        onChange={(e) => setAno(e.target.value)}
        className="w-auto"
      />
      <Select value={tipo} onValueChange={(value) => setTipo(value)}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Tipo" />
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
      <Button type="submit" variant="secondary" size="default">
        <Search className="h-4 w-4 mr-2" />
        Filtrar resultados
      </Button>
      <Button type="button" variant="outline" size="default" onClick={handleClearFilters}>
        <X className="h-4 w-4 mr-2" />
        Remover filtros
      </Button>
    </form>
  );
}

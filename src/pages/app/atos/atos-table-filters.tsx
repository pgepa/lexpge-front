import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Switch } from '@/components/ui/switch';

export function AtosTableFilters({ onFilter }: { onFilter: (filters: any) => void }) {
  const [conteudo, setConteudo] = useState("");
  const [descritores, setDescritores] = useState("");
  const [numero, setNumero] = useState("");
  const [ano, setAno] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [texto_compilado, setTexto_Compilado] = useState(false);

  const handleFilter = (event: React.FormEvent) => {
    event.preventDefault();
    onFilter({
      conteudo: conteudo.trim() || undefined,
      descritores: descritores.trim() || undefined,
      numero: numero.trim() || undefined,
      ano: ano.trim() || undefined,
      tipo: tipo !== "todos" ? tipo : undefined,
      texto_compilado: texto_compilado || undefined,
    });
  };

  const handleClearFilters = () => {
    setConteudo("");
    setDescritores("");
    setNumero("");
    setAno("");
    setTipo("todos");
    setTexto_Compilado(false);
    onFilter({ conteudo: undefined, descritores: undefined, numero: undefined, ano: undefined, tipo: undefined });
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col sm:flex-row items-center gap-2 flex-wrap">
      <span className="text-sm font-semibold">Filtros:</span>
      
      <Input
        placeholder="Busca por termos"
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        className="w-full sm:w-auto"
      />
      
      <Input
        placeholder="Busca por descritores"
        value={descritores}
        onChange={(e) => setDescritores(e.target.value)}
        className="w-full sm:w-auto"
      />
      
      <Input
        placeholder="Número"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        className="w-full sm:w-auto"
      />
      
      <Input
        placeholder="Ano"
        value={ano}
        onChange={(e) => setAno(e.target.value)}
        className="w-full sm:w-auto"
      />
      
      <Select value={tipo} onValueChange={(value) => setTipo(value)}>
        <SelectTrigger className="w-full sm:w-[220px]">
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

      <div className="flex items-center">
        <span className="mr-2 font-semibold tracking-tight ">Texto Compilado</span>
        <Switch
          checked={texto_compilado}
          onCheckedChange={(value) => setTexto_Compilado(value)}
        />
      </div>

      <Button type="submit" size="default" className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 w-full sm:w-auto">
        <Search className="h-4 w-4 mr-2" />
        Pesquisar
      </Button>

      <Button type="button" variant="outline" size="default" onClick={handleClearFilters} className="w-full sm:w-auto">
        <X className="h-4 w-4 mr-2" />
        Remover filtros
      </Button>
    </form>
  );
}

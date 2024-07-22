import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

export function AtosTableFilters() {
  return (
    <form className="flex items-center gap-2">
          <span className="text-sm font-semibold">Filtros:</span>
          <Input placeholder="Busca por termos" className="h-8 w-[320px]"/>
          <Input placeholder="Número" className="h-8 w-auto"/>
          <Input placeholder="Ano" className="h-8 w-auto"/>
    
          <Select defaultValue="todos">
            <SelectTrigger className="h-8 w-[220px]">
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

          <Button type="submit" variant="secondary" size="xs">
            <Search className="h-4 w-4 mr-2" />
            Filtrar resultados
          </Button>

          <Button type="button" variant="outline" size="xs">
            <X className="h-4 w-4 mr-2" />
            Remover filtros
          </Button>
    </form>
  )
}
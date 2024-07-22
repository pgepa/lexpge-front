import { Helmet } from "react-helmet-async";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Button } from "./components/ui/button";
import { Search, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from './assets/logo.svg';


export function Inicio() {
  return (
    <>
      <Helmet title="Início"/>

      <div className="flex flex-col gap-4 items-center"> 
        <img className="w-24 h-24" src={logo} alt="Logo" />
        <h1 className="text-3xl font-bold tracking-tight col-span-2">Procuradoria-Geral do Estado do Pará</h1>
        
        <h2 className="text-xl tracking-tight text-muted-foreground" >Base de Atos Normativos - LEXPGE</h2>
        
        <div className="grid grid-cols-4 gap-4">

          
          <Input placeholder="Número" className="h-8"/>
          

          <Input placeholder="Ano" className="h-8"/>

          <div className="col-span-2">
          <Select  defaultValue="todos">
            <SelectTrigger className="h-8">
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
          
          <Input placeholder="Busca por termos" className="h-8 col-span-4"/>                


        </div>
          
        <div className="flex flex-row gap-4 items-center">

        <NavLink to="/atos">
            <Button type="submit" variant="secondary" size="lg">
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
          </NavLink>
          

            <Button type="button" variant="outline" size="lg">
              <X className="h-4 w-4 mr-2" />
              Remover filtros
            </Button> 

          
          </div>
          
          
      </div>

    </>
  )
}
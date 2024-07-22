import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Helmet } from "react-helmet-async";
import { DatePicker } from "../Date/date";
import  Editor from '../editor/Editor';
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button";
import { Save, SquareX } from 'lucide-react';
import { z } from "zod"


const novoRegistroForm = z.object({
  numero: z.string(),
  titulo: z.string(),
  ementa: z.string(),
})

type NovoRegistroForm = z.infer<typeof novoRegistroForm>

export function NovoRegistro () {
  const {register, handleSubmit, formState: { isSubmitting } } = useForm<NovoRegistroForm>()

  async function handleNovoRegistro(data: NovoRegistroForm){

    console.log(data)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
  }


  return (
    <>
    <div className="flex flex-col gap-4">      
      <Helmet title="Novo Registro"/>
      <h1 className="text-3xl font-bold tracking-tight">Novo registro</h1>
    
        <form onSubmit={handleSubmit(handleNovoRegistro)} className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numero">Número:</Label>
            <Input id="numero" type="text" placeholder="Número" className="h-8" {...register('numero')} />
          </div>
          <div className="col-span-3 space-y-2">
            <Label htmlFor="titulo">Título:</Label>
            <Input id="titulo" type="text" placeholder="Título" className="h-8" {...register('titulo')}/>
          </div>
          <div className="col-span-4 space-y-2">
            <Label htmlFor="ementa">Ementa:</Label>
            <Textarea id="ementa" placeholder="Ementa" className="h-8" {...register('ementa')}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo:</Label>          
            <Select defaultValue="default">
              <SelectTrigger className="h-8">
                <SelectValue id="tipo"/>
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="default">Escolha uma opção</SelectItem>
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

          <div className="space-y-2">
            <Label htmlFor="situacao">Situação:</Label>          
            <Select defaultValue="default">
              <SelectTrigger className="h-8">
                <SelectValue id="situacao" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="default">Escolha uma opção</SelectItem>
                <SelectItem value="constituicaoEstadual">Declarado(a) Inconstitucional</SelectItem>
                <SelectItem value="decretoLegislativo">Eficácia Suspensa</SelectItem>
                <SelectItem value="decretoLei">Vigente</SelectItem>
                <SelectItem value="decretoNumerado">Revogado(a)</SelectItem>
                <SelectItem value="decretoNaoNumerado">Revogado(a) Parcialmente</SelectItem>
                <SelectItem value="emendaConsitucional">Sem Efeito</SelectItem>
                <SelectItem value="instrucaoNormativa">Sem Revogação Expressa</SelectItem>
                <SelectItem value="leiComplementar">Vetado(a)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="fonte">Fonte:</Label>
            <Input id="fonte" placeholder="Fonte" className="h-8"/>
          </div>

          <div className=" flex flex-col gap-4">
            <Label htmlFor="datadoato">Data do ato:</Label>
            <DatePicker />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="datadapublicacao">Data de publicação:</Label>
            <DatePicker />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="descritores">Descritores:</Label>
            <Input id="descritores" placeholder="Descritores" className="h-8"/>
          </div>

          <div className="col-span-4 space-y-2">
            <Label htmlFor="observacao">Observação:</Label>
            <Textarea id="observacao" placeholder="Observação" className="h-8"/>
          </div>

          <div id="editor" className="col-span-4">
            <Editor/>
          </div>

          <div className="flex gap-4 justify-center col-span-4">
            <Button disabled={isSubmitting} type="submit">
              <Save className="mr-2 h-4 w-4"/>
              Salvar
            </Button>
            <Button variant="destructive">
              <SquareX  className="mr-2 h-4 w-4"/>
              Cancelar
            </Button>

          </div>


          

         

             
          

        
    
      </form>
    
    </div>

    
    </>
    
    
  )
}

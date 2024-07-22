import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Helmet } from "react-helmet-async";
import { DatePicker } from "../Date/date";
import Editor from '../editor/Editor';
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Save, SquareX } from 'lucide-react';
import { z } from "zod";
import { toast } from 'sonner';
import { zodResolver } from "@hookform/resolvers/zod";

const novoRegistroForm = z.object({
  numero: z.string(),
  titulo: z.string(),
  ementa: z.string(),
  tipo: z.string(),
  situacao: z.string(),
  fonte: z.string(),
  dataDoAto: z.date().nullable(),
  dataDaPublicacao: z.date().nullable(),
  descritores: z.string(),
  observacao: z.string(),
  editor: z.string(),
});

type NovoRegistroForm = z.infer<typeof novoRegistroForm>;

export function NovoRegistro() {
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<NovoRegistroForm>({
    resolver: zodResolver(novoRegistroForm),
  });

  async function handleNovoRegistro(data: NovoRegistroForm) {
    try {
      console.log(data);

      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Novo registro cadastrado com sucesso.');
    } catch {
      toast.error('Cadastro inválido, favor verificar todos os campos.');
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <Helmet title="Novo Registro" />
        <h1 className="text-3xl font-bold tracking-tight">Novo registro</h1>

        <form onSubmit={handleSubmit(handleNovoRegistro)} className="grid grid-cols-4 gap-4 mt-8">
          <div className="space-y-2">
            <Label htmlFor="numero">Número:</Label>
            <Input id="numero" type="text" placeholder="Número" {...register('numero')} />
          </div>
          <div className="col-span-3 space-y-2">
            <Label htmlFor="titulo">Título:</Label>
            <Input id="titulo" type="text" placeholder="Título" {...register('titulo')} />
          </div>
          <div className="col-span-4 space-y-2">
            <Label htmlFor="ementa">Ementa:</Label>
            <Textarea id="ementa" placeholder="Ementa" {...register('ementa')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo:</Label>
            <Controller
              name="tipo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma opção" />
                  </SelectTrigger>
                  <SelectContent>
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
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="situacao">Situação:</Label>
            <Controller
              name="situacao"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inconstitucional">Declarado(a) Inconstitucional</SelectItem>
                    <SelectItem value="suspensa">Eficácia Suspensa</SelectItem>
                    <SelectItem value="vigente">Vigente</SelectItem>
                    <SelectItem value="revogado">Revogado(a)</SelectItem>
                    <SelectItem value="revogadoParcialmente">Revogado(a) Parcialmente</SelectItem>
                    <SelectItem value="semEfeito">Sem Efeito</SelectItem>
                    <SelectItem value="semRevogacaoExpressa">Sem Revogação Expressa</SelectItem>
                    <SelectItem value="vetado">Vetado(a)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="fonte">Fonte:</Label>
            <Input id="fonte" placeholder="Fonte" {...register('fonte')} />
          </div>

          <div className="flex flex-col gap-4" id="dataDoAto">
            <Label htmlFor="dataDoAto">Data do ato:</Label>
            <Controller
              name="dataDoAto"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <DatePicker date={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="dataDaPublicacao">Data de publicação:</Label>
            <Controller
              name="dataDaPublicacao"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <DatePicker date={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="descritores">Descritores:</Label>
            <Input id="descritores" placeholder="Descritores" {...register('descritores')} />
          </div>

          <div className="col-span-4 space-y-2">
            <Label htmlFor="observacao">Observação:</Label>
            <Textarea id="observacao" placeholder="Observação" {...register('observacao')} />
          </div>

          <div id="editor" className="col-span-4">
            <Controller
              name="editor"
              control={control}
              defaultValue=""
              render={({ field }) => <Editor {...field} />}
            />
          </div>

          <div className="flex gap-4 justify-center col-span-4">
            <Button disabled={isSubmitting} type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>

            <Button variant="destructive">
              <SquareX className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

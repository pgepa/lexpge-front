import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Helmet } from "react-helmet-async";
import { DatePicker } from "@/pages/app/Date/date";
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Save, SquareX } from 'lucide-react';
import { z } from "zod";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { EditorTip } from '@/TipTapEditor/editor';
import { EditorTipObservacao } from '@/TipTapEditor/Observacao';


const novoRegistroForm = z.object({
    numero: z.number(),
    titulo: z.string(),
    ementa: z.string(),
    tipo_id: z.string(),
    situacao: z.string(),
    fonte: z.string(),
    dataDoAto: z.date().nullable(),
    dataDaPublicacao: z.date().nullable(),
    descritores: z.string(),
    observacao: z.string(),
    editor: z.string(),
    texto_compilado: z.boolean().optional(),
});

type NovoRegistroForm = z.infer<typeof novoRegistroForm>;

export function NovoRegistro() {
    const navigate = useNavigate();
    const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<NovoRegistroForm>({
        
    });

    async function handleNovoRegistro(data: NovoRegistroForm) {
        if (data.dataDoAto && data.dataDaPublicacao && data.dataDoAto > data.dataDaPublicacao){
            toast.error('A data da publicação não pode ser anterior à data do ato.');
            return;
        }
        try {
            console.log("Data being sent:", data);


            // Prepare data to be sent to the backend
            const payload = {
                numero: data.numero,
                titulo: data.titulo,
                ementa: data.ementa,
                tipo_id: data.tipo_id,
                situacao: data.situacao,
                fonte: data.fonte,
                data_ato: data.dataDoAto ? data.dataDoAto.toISOString().split('T')[0] : null,
                data_publicacao: data.dataDaPublicacao ? data.dataDaPublicacao.toISOString().split('T')[0] : null,
                descritores: data.descritores,
                observacao: data.observacao,
                conteudo: data.editor,
                texto_compilado: data.texto_compilado, // Optional, only for compiled texts
            };

            const token = localStorage.getItem('token');

            const response = await fetch(import.meta.env.VITE_API_URL + '/atos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),

            });

            const result = await response.json();
            console.log("Response from backend:", result);

            if (response.ok) {
                toast.success('Novo registro cadastrado com sucesso.');
                navigate('/admin/atos/');
            } else {
                toast.error(result.error || 'Cadastro inválido, favor verificar todos os campos.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Erro ao cadastrar, favor tentar novamente.');
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
                        <Label htmlFor="tipo_id">Tipo:</Label>
                        <Controller
                            name="tipo_id"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Escolha uma opção" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Constituição Estadual">Constituição Estadual</SelectItem>
                                        <SelectItem value="Decreto Legislativo">Decreto Legislativo</SelectItem>
                                        <SelectItem value="Decreto Lei">Decreto Lei</SelectItem>
                                        <SelectItem value="Decreto Numerado">Decreto Numerado</SelectItem>
                                        <SelectItem value="Decreto Não Numerado">Decreto Não Numerado</SelectItem>
                                        <SelectItem value="Emenda Consitucional">Emenda Constitucional</SelectItem>
                                        <SelectItem value="Instrução Normativa">Instrução Normativa</SelectItem>
                                        <SelectItem value="Lei Complementar">Lei Complementar</SelectItem>
                                        <SelectItem value="Lei Ordinária">Lei Ordinária</SelectItem>
                                        <SelectItem value="Mensagem do Governador">Mensagem do Governador</SelectItem>
                                        <SelectItem value="Portaria">Portaria</SelectItem>
                                        <SelectItem value="Portaria Conjunta">Portaria Conjunta</SelectItem>
                                        <SelectItem value="Resolução">Resolução</SelectItem>
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
                                        <SelectItem value="Inconstitucional">Declarado(a) Inconstitucional</SelectItem>
                                        <SelectItem value="Suspensa">Eficácia Suspensa</SelectItem>
                                        <SelectItem value="Vigente">Vigente</SelectItem>
                                        <SelectItem value="Revogado">Revogado(a)</SelectItem>
                                        <SelectItem value="Revogado Parcialmente">Revogado(a) Parcialmente</SelectItem>
                                        <SelectItem value="Sem Efeito">Sem Efeito</SelectItem>
                                        <SelectItem value="Sem RevogacaoExpressa">Sem Revogação Expressa</SelectItem>
                                        <SelectItem value="Vetado(a)">Vetado(a)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="col-span-1 space-y-2">
                        <Label htmlFor="fonte">Fonte:</Label>
                        <Input id="fonte" placeholder="Fonte" {...register('fonte')} />
                    </div>

                    <div className="flex items-center space-x-2 ">

                        <Controller
                            name="texto_compilado"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                                <Checkbox
                                    id="texto_compilado"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />

                        <Label
                            htmlFor="texto_compilado"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Texto Compilado / Impressão
                        </Label>
                    </div>

                    <div className="flex flex-col gap-4" id="dataDoAto">
                        <Label htmlFor="dataDoAto">Data do ato:</Label>
                        <Controller
                            name="dataDoAto"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                                <DatePicker date={field.value!} onChange={field.onChange} />
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
                                <DatePicker date={field.value!} onChange={field.onChange} />
                            )}
                        />
                    </div>

                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="descritores">Descritores:</Label>
                        <Input id="descritores" placeholder="Descritores" {...register('descritores')} />
                    </div>

                    <div className="col-span-4 space-y-2">
                        <Label>Observação:</Label>
                        <div className="col-span-4">
                            <Controller
                                name="observacao"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <EditorTipObservacao value={field.value} onChange={field.onChange} className='h-[250px] mt-4'/>
                                )}
                            />
                        </div>
                    </div>

                    <div className="col-span-4 space-y-2">
                        <Label>Conteúdo do Ato Normativo:</Label>
                        <div className="col-span-4">
                            <Controller
                                name="editor"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <EditorTip value={field.value} onChange={field.onChange} className='h-[600px] mt-4'/>
                                )}
                            />
                        </div>

                    </div>


                    <div className="flex gap-4 justify-center col-span-4 mt-4">
                        <Button disabled={isSubmitting} type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </Button>


                        <Button variant="destructive" onClick={() => navigate('/admin/atos/')}>
                            <SquareX className="mr-2 h-4 w-4" />
                            Cancelar
                        </Button>


                    </div>
                </form>
            </div>
        </>
    );
}

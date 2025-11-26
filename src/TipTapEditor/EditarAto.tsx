import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/pages/app/Date/date";
import { EditorTip } from '@/TipTapEditor/editor';
import { Button } from "@/components/ui/button";
import { Save, SquareX } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect } from 'react';
import { EditorTipObservacao } from '@/TipTapEditor/Observacao';
import { zodResolver } from '@hookform/resolvers/zod';
import './styles.css'

const editRegistroForm = z.object({ 
    id: z.number(),   
    numero: z.coerce.string().min(1, { message: 'Número é obrigatório' }),
    titulo: z.string().min(1, { message: 'Título é obrigatório' }),
    ementa: z.string().min(1, { message: 'Ementa é obrigatória' }),
    tipo_id: z.string().min(1, { message: 'Tipo é obrigatório' }),
    situacao: z.string().min(1, { message: 'Situação é obrigatória' }),
    fonte: z.string().min(1, { message: 'Fonte é obrigatória' }),
    data_ato: z.date({ required_error: "Data do ato é obrigatória" }),
    data_publicacao: z.date({ required_error: "Data de publicação é obrigatória" }),
    descritores: z.string().min(1, { message: 'Descritores são obrigatórios' }),
    observacao: z.string(),
    conteudo: z.string(),
    texto_compilado: z.boolean().optional(),
})
.refine((data) => {
        if (data.data_ato && data.data_publicacao) {
            return data.data_ato <= data.data_publicacao;
        }
        return true;
    }, {
        message: "A data da publicação não pode ser anterior à data do ato.",
        path: ["data_publicacao"],
    });


type EditRegistroForm = z.infer<typeof editRegistroForm>;

export function EditarRegistro() {
    const location = useLocation();
    const navigate = useNavigate();
    const ato = location.state?.ato as EditRegistroForm;

    const { register, handleSubmit, control, formState: { isSubmitting, errors }, setValue } = useForm<EditRegistroForm>({
        
        resolver: zodResolver(editRegistroForm),
        defaultValues: {
            ...ato,  
            id: (ato && typeof ato.id === 'number') ? ato.id : 0,                      
            data_ato: ato?.data_ato ? new Date(ato.data_ato) : undefined,
            data_publicacao: ato?.data_publicacao ? new Date(ato.data_publicacao) : undefined,
        }

    });

    async function handleEditRegistro(data: EditRegistroForm) {
        try {

            const payload = {
                ...data,
                numero: String(data.numero),
                data_ato: data.data_ato ? new Date(data.data_ato).toISOString().split('T')[0] : null,
                data_publicacao: data.data_publicacao ? new Date(data.data_publicacao).toISOString().split('T')[0] : null,
            };

            const token = localStorage.getItem('token');

            const response = await fetch(`${import.meta.env.VITE_API_URL}/atos/${ato.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success('Registro atualizado com sucesso.');
                navigate('/admin/atos/');
            } else {
                const result = await response.json();
                toast.error(result.error || 'Atualização inválida, favor verificar todos os campos.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Erro ao atualizar, favor tentar novamente.');
        }
    }

    useEffect(() => {

        if (ato?.conteudo) {
            const processedContent = ato.conteudo.replace(
                /src="(https?:\/\/[^\s"]+|data:image\/[a-zA-Z]+;base64,[^\s"]+|\/images\/[^\s"]+)"/g,
                (_, src) => {
                    if (src.startsWith("http") || src.startsWith("data:image")) {
                        return `src="${src}"`; // Mantém URLs externas e base64 inalteradas
                    }
                    if (src.startsWith("/images")) {
                        return `src="${import.meta.env.VITE_PUBLIC_URL}${src}"`; // Corrige caminhos relativos
                    }
                    return `src="${src}"`;
                }
            );
            setValue("conteudo", processedContent); // Define o conteúdo processado
        }
    }, [ato, setValue]);





    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Editar Registro</h1>

            <form onSubmit={handleSubmit(handleEditRegistro)} className="grid grid-cols-4 gap-4 mt-8">
                <div className="space-y-2">
                    <Label htmlFor="numero">Número:</Label>
                    <Input id="numero" type="text" placeholder="Número" {...register('numero')} />
                    {errors.numero && <p className="text-red-500 text-sm">{errors.numero.message}</p>}
                </div>
                <div className="col-span-3 space-y-2">
                    <Label htmlFor="titulo">Título:</Label>
                    <Input id="titulo" type="text" placeholder="Título" {...register('titulo')} />
                    {errors.titulo && <p className="text-red-500 text-sm">{errors.titulo.message}</p>}
                </div>
                <div className="col-span-4 space-y-2">
                    <Label htmlFor="ementa">Ementa:</Label>
                    <Textarea id="ementa" placeholder="Ementa" {...register('ementa')} />
                    {errors.ementa && <p className="text-red-500 text-sm">{errors.ementa.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tipo_id">Tipo:</Label>
                    <Controller
                        name="tipo_id"
                        control={control}
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
                        )}
                    />
                    {errors.tipo_id && <p className="text-red-500 text-sm">{errors.tipo_id.message}</p>}
                    
                </div>
                <div className="space-y-2">
                    <Label htmlFor="situacao">Situação:</Label>
                    <Controller
                        name="situacao"
                        control={control}
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
                                    <SelectItem value="Sem Revogação Expressa">Sem Revogação Expressa</SelectItem>
                                    <SelectItem value="Vetado(a)">Vetado(a)</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.situacao && <p className="text-red-500 text-sm">{errors.situacao.message}</p>}
                </div>
                <div className="col-span-1 space-y-2">
                    <Label htmlFor="fonte">Fonte:</Label>
                    <Input id="fonte" placeholder="Fonte" {...register('fonte')} />
                    {errors.fonte && <p className="text-red-500 text-sm">{errors.fonte.message}</p>}
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
                <div className="flex flex-col gap-4" id="data_ato">
                    <Label htmlFor="data_ato">Data do ato:</Label>
                    <Controller
                        name="data_ato"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                date={field.value ? new Date(field.value) : undefined}
                                onChange={(date) => field.onChange(date ?? undefined)}

                            />
                        )}
                    />
                    {errors.data_ato && <p className="text-red-500 text-sm">{errors.data_ato.message}</p>}
                </div>
                <div className="flex flex-col gap-4" id="data_publicacao">
                    <Label htmlFor="data_publicacao">Data de publicação:</Label>
                    <Controller
                        name="data_publicacao"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                date={field.value ? new Date(field.value) : undefined}
                                onChange={(date) => field.onChange(date ?? undefined)}

                            />
                        )}
                    />
                    {errors.data_publicacao && <p className="text-red-500 text-sm">{errors.data_publicacao.message}</p>}
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="descritores">Descritores:</Label>
                    <Input id="descritores" placeholder="Descritores" {...register('descritores')} />
                    {errors.descritores && <p className="text-red-500 text-sm">{errors.descritores.message}</p>}
                </div>
                <div className="col-span-4 space-y-2">
                    <Label>Observação:</Label>
                    <Controller
                        name="observacao"
                        control={control}
                        render={({ field }) => (
                            <EditorTipObservacao value={field.value} onChange={field.onChange} className='h-[250px] mt-4' />
                        )}
                    />
                </div>
                <div className="col-span-4 space-y-2">
                    <Label>Conteúdo do Ato Normativo:</Label>
                    <Controller
                        name="conteudo"
                        control={control}
                        render={({ field }) => (
                            <EditorTip value={field.value} onChange={field.onChange} className='h-[600px] mt-4' />
                        )}
                    />
                </div>
                <div className="flex gap-4 justify-center col-span-4 mt-4">
                    <Button type="submit" disabled={isSubmitting}>
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
    );
}

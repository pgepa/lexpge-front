import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from "@hookform/resolvers/zod";

const signUpForm = z.object({
    nome: z.string(),
    id_perfil: z.string(),
    email: z.string().email(),
    senha: z.string(),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {

    const navigate = useNavigate();

    const { register, handleSubmit,control, formState: { isSubmitting } } = useForm<SignUpForm>({
        resolver: zodResolver(signUpForm),
    })


    async function handleSignUp(data: SignUpForm) {
        try {
            console.log("Data being sent:", data);

            const payload = {
                nome: data.nome,
                id_perfil: data.id_perfil,
                email: data.email,
                senha: data.senha,

            };

            const token = localStorage.getItem('token');

            const response = await fetch(import.meta.env.VITE_API_URL + '/auth/register', {
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
                toast.success('Usuário cadastrado com sucesso.');
                navigate('/admin/usuario');
            } else {
                toast.error(result.error || 'Cadastro inválido, favor verificar todos os campos.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Erro ao cadastrar usuário, favor tentar novamente.');
        }
    }

    return (
        <>
            <Helmet title="Cadastro" />

            <div className="p-8">


                <div className="w-[350px] flex flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tighter">Criar novo usuário</h1>
                        <p className="text-sm text-muted-foreground">Base de Atos Normativos - LEXPGE</p>

                    </div>


                    <Button variant={'ghost'} onClick={() => navigate(-1)}>
                        <ChevronLeft className=" mr-1 h-4 w-4" />
                        Voltar
                    </Button>



                    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome Completo:</Label>
                            <Input id="nome" type="text" {...register("nome")} />
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="id_perfil">Perfil:</Label>
                            <Controller
                            name="id_perfil"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Escolha uma opção" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  <SelectItem value="1">Administrador</SelectItem>
                                    <SelectItem value="2">Chefia</SelectItem>
                                    <SelectItem value="3">Estagiário</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                             />
                            
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail:</Label>
                            <Input id="email" type="email" {...register("email")} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="senha">Senha:</Label>
                            <Input id="senha" type="password" {...register("senha")} />
                        </div>

                        <Button disabled={isSubmitting} className="w-full" type="submit">Finalizar cadastro</Button>

                        <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
                            Ao continuar, você concorda com nossos <a className="underline underline-offset-4" href="">termos de serviços</a> e <a className="underline underline-offset-4" href="">políticas de privacidade.</a>
                        </p>
                    </form>
                </div>

            </div>
        </>
    )
}
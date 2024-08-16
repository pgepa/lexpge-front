import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { CirclePlus } from 'lucide-react';

const signUpForm = z.object({
    nome: z.string(),
    id_perfil: z.string(),
    email: z.string().email(),
    senha: z.string(),
});

type SignUpForm = z.infer<typeof signUpForm>;

export function SignUp() {
    const navigate = useNavigate();

    const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<SignUpForm>({
        resolver: zodResolver(signUpForm),
    });

    async function handleSignUp(data: SignUpForm) {
        try {
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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                <CirclePlus className="mr-2 h-4 w-4" />
                    Novo Usuário
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(handleSignUp)}>
                    <DialogHeader>
                        <DialogTitle>Novo Usuário</DialogTitle>
                        <DialogDescription>
                            Cadastre um novo usuário aqui. Clique em finalizar cadastro quando terminar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nome" className="text-right">
                                Nome
                            </Label>
                            <Input
                                id="nome"
                                {...register('nome')}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                E-mail
                            </Label>
                            <Input
                                id="email"
                                {...register('email')}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id_perfil" className="text-right">Perfil:</Label>
                            <Controller
                                name="id_perfil"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="col-span-3">
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
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="senha" className="text-right">
                                Nova Senha
                            </Label>
                            <Input
                                id="senha"
                                type="password"
                                {...register('senha')}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={isSubmitting} type="submit">Finalizar Cadastro</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

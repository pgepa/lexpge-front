import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';

const signInFormSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

type SignInForm = z.infer<typeof signInFormSchema>;

export function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
  });

  const handleLogin = async (form: SignInForm) => {
    try {
      const response = await api.post('/auth/login', { email: form.email, senha: form.senha });
      const { access_token, id_perfil } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('userProfile', JSON.stringify(id_perfil));

      switch (id_perfil) {
        case 1:
          navigate('/admin', { replace: true });
          break;
        case 3:
          navigate('/estagiario', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
          break;
      }
    } catch (err) {
      console.error('Erro na autenticação:', err);
      setError('Credenciais inválidas. Por favor, verifique seu e-mail e senha.');
    }
  };

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <div className="w-[350px] flex flex-col justify-center gap-6 mx-auto">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tighter">Acessar painel</h1>
            <p className="text-sm text-muted-foreground">Base de Atos Normativos - LEXPGE</p>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail:</Label>
              <Input id="email" placeholder="E-mail" type="email" {...register("email")} />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha:</Label>
              <Input id="senha" placeholder="******" type="password" {...register("senha")} />
              {errors.senha && <p className="text-red-500">{errors.senha.message}</p>}
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <Button disabled={isSubmitting} className="w-full" type="submit">Acessar painel</Button>
          </form>
        </div>
      </div>
    </>
  );
}

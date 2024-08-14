import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';

const signInFormSchema = z.object({
  email: z.string().email(),
  senha: z.string()
});

type SignInForm = z.infer<typeof signInFormSchema>;

export function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<SignInForm>();

  const handleLogin = async (form: SignInForm) => {
    try {
      const response = await api.post('/auth/login', { email: form.email, senha: form.senha });
      localStorage.setItem('token', response.data.access_token);

      const userPermissions = await api.get('/auth/users', {
        headers: { 'Authorization': `Bearer ${response.data.access_token}` }
      });

      const user = userPermissions.data.find((user: any) => user.email === form.email);
      if (user) {
        localStorage.setItem('userProfile', JSON.stringify(user.id_perfil));
        navigate('/admin/atos/');
      }
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <div className="w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tighter">Acessar painel</h1>
            <p className="text-sm text-muted-foreground">Base de Atos Normativos - LEXPGE</p>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail:</Label>
              <Input id="email" placeholder="E-mail" type="email" {...register("email")} />
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha:</Label>
              <Input id="senha" placeholder="******" type="password" {...register("senha")} />
              {errors.senha && <p>{errors.senha.message}</p>}
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Button disabled={isSubmitting} className="w-full" type="submit">Acessar painel</Button>
          </form>
        </div>
      </div>
    </>
  );
}

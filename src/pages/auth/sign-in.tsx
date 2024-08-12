import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/Context/useAuth'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'


const signInFormSchema = z.object({
  email: z.string().email(),
  senha: z.string()
})

type SignInForm = z.infer<typeof signInFormSchema>

export function SignIn() {
    const { loginUser } = useAuth();

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<SignInForm>()

  const handleLogin = (form: SignInForm) => {
    loginUser(form.email, form.senha);
  }

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

              {errors.email ? <p>{errors.email.message}</p> : ""}

            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha:</Label>
              <Input id="senha" placeholder='******' type="password" {...register("senha")} />
              {errors.senha ? <p>{errors.senha.message}</p> : ""}
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">Acessar painel</Button>
          </form>
        </div>
      </div>
    </>
  )
}

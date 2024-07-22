import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'

const signUpForm = z.object({
  restaurantName: z.string(),
  managerName: z.string(),
  phone: z.string(),
  email: z.string().email(),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {

  const navigate = useNavigate()

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignUpForm>()

  async function handleSignUp(data: SignUpForm) {
    try {

      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success('Usuário cadastrado com sucesso!', {
        action: {
          label: 'Login',
          onClick: () => navigate("/sign-in"),
        },
     })
  
    } catch {

      toast.error('Erro ao cadastrar usuário.')

    }

    }

  return (
    <>
      <Helmet title="Cadastro" />
      <div className="p-8">

        <Button variant={'ghost'} asChild className="absolute right-4 top-4">
          <Link to="/sign-in">
            Fazer login
          </Link>
        </Button>

        <div className="w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tighter">Criar conta</h1>
            <p className="text-sm text-muted-foreground">Base de Atos Normativos - LEXPGE</p>

          </div>

          <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
              <Input id="restaurantName" type="text" {...register("restaurantName")}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName">Seu nome</Label>
              <Input id="managerName" type="text" {...register("managerName")}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input id="email" type="email" {...register("email")}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Seu celular</Label>
              <Input id="phone" type="tel" {...register("phone")}/>
            </div>

            <Button disabled={isSubmitting}className="w-full" type="submit">Finalizar cadastro</Button>

            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
              Ao continuar, você concorda com nossos <a className="underline underline-offset-4" href="">termos de serviços</a> e <a className="underline underline-offset-4" href="">políticas de privacidade.</a>
            </p>
          </form>
        </div>

      </div>
    </>
  )
}
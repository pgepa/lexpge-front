import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NavLink } from '@/components/nav-link'
import { ChevronLeft } from 'lucide-react'

const signUpForm = z.object({
  nome: z.string(),
  id_perfil: z.string(),
  email: z.string().email(),
  senha: z.string(),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {



  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignUpForm>()

  async function handleSignUp(_data: SignUpForm) {
    try {

      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success('Usuário cadastrado com sucesso!', {
        
     })
  
    } catch {

      toast.error('Erro ao cadastrar usuário.')

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
          
            <NavLink to="/usuario">
                    <Button variant={'ghost'}>
                    <ChevronLeft className=" mr-1 h-4 w-4" />
                        Voltar
                    </Button>
            </NavLink>
        

          <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo:</Label>
              <Input id="nome" type="text" {...register("nome")}/>
            </div>

            <div className="col-span-2">
            <Label htmlFor="id_perfil">Perfil:</Label>
                <Select>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Administrador</SelectItem>
                  <SelectItem value="2">Chefia</SelectItem>
                  <SelectItem value="3">Estagiário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail:</Label>
              <Input id="email" type="email" {...register("email")}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha:</Label>
              <Input id="senha" type="password" {...register("senha")}/>
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
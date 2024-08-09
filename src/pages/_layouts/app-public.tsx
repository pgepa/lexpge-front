import { HeaderPublic } from '@/components/header-public'
import { Outlet } from "react-router-dom"

export function AppLayoutPublic() {
  return (
    <div className="flex min-h-screen flex-col antialiased">

        <HeaderPublic />

      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">

        <Outlet />

        <footer className="text-sm text-muted-foreground text-center mt-8">
          Copyright &copy; PGE-PA {new Date().getFullYear()} | DTIGD - Todos os direitos reservados. 
        </footer>

      </div>

      

    </div>
  )
}
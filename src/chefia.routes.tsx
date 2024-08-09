import { createHashRouter } from "react-router-dom"
import { Dashboard } from "./pages/app/dashboard/dashboard"
import { SignIn } from "./pages/auth/sign-in"
import { AppLayout } from "./pages/_layouts/app"
import { AuthLayout } from "./pages/_layouts/auth"
import { SignUp } from "./pages/auth/sign-up"
import { Atos } from "./pages/app/atos/atos-card-teste"
import { NotFound } from "./pages/404"
import { Sobre } from "./pages/sobre"
import { Inicio } from "./inicio"
import { Ficha } from "./pages/app/ficha/ficha"
import { TextoIntegral } from '@/pages/app/conteudo/conteudo-ato'



export const ChefiaRoutes = createHashRouter([
  {
    path: '/',
    element: <AppLayout/>,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Inicio />},
      { path: '/dashboard', element: <Dashboard />},
      { path: '/sobre', element: <Sobre/>},
      { path: '/atos', element: <Atos />},
      { path: '/ficha/:id', element: <Ficha />},
      { path: '/texto-integral/:id', element: <TextoIntegral />},
        
      
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: '/sign-in', element: <SignIn />},
      { path: '/sign-up', element: <SignUp />}
    ]
  }

])
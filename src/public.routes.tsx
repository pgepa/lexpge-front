import { createHashRouter } from "react-router-dom"
import { SignIn } from "./pages/auth/sign-in"
import { AuthLayout } from "./pages/_layouts/auth"
import { SignUp } from "./pages/auth/sign-up"

import { NotFound } from "./pages/404"
import { Sobre } from "./pages/sobre"

import { TextoIntegral } from './pages/app/conteudo/conteudo-ato'
import { Ficha } from './pages/app/ficha/ficha'
import { AtosPublic } from './pages/app/atosPublic/atos-card-public'
import { HomePublic } from './pages/home-public'
import { AppLayoutPublic } from './pages/_layouts/app-public'



export const PublicRouter = createHashRouter([
  {
    path: '/',
    element: <AppLayoutPublic/>,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <HomePublic />},
      { path: '/sobre', element: <Sobre/>},
      { path: '/atos', element: <AtosPublic />},
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
import { createHashRouter } from "react-router-dom";
import { Dashboard } from "./pages/app/dashboard/dashboard";
import { SignIn } from "./pages/auth/sign-in";
import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { SignUp } from "./pages/auth/sign-up";
import { Atos } from "./pages/app/atos/atos-card-teste";
import { NotFound } from "./pages/404";
import { Sobre } from "./pages/sobre";
import { Inicio } from "./inicio";
import { Ficha } from "./pages/app/ficha/ficha";
import { NovoRegistro } from "./pages/app/atos/atos-registro";
import { TextoIntegral } from '@/pages/app/conteudo/conteudo-ato';
import { EditarRegistro } from "./pages/app/atos/atos-editar";
import { ManagementUser } from './pages/app/gestao/gestao-user';
import { AtosPublic } from './pages/app/atosPublic/atos-card-public';
import { AppLayoutPublic } from './pages/_layouts/app-public';
import { HomePublic } from './pages/home-public';
import { AppLayoutEstagiario } from './pages/_layouts/app-estagiario';
import { HomeEstagiario } from './pages/home-estagiario';
import { AtosEstagiario } from './pages/app/atosEstagiario/atos-card-estagiario';
import { EditarRegistroEstagiario } from './pages/app/atos/atos-editar-estagiario';
import PrivateRoute from './utils/private-route';
import { NovoRegistroEstagiario } from './pages/app/atosEstagiario/atos-registro-estagiario';
import { AppLayoutChefia } from './pages/_layouts/app-chefias';
import { HomeChefia } from './pages/home-chefia';
import { AtosChefia } from './pages/app/atosChefias/atos-card-chefias-exibir';
import { TextoIntegralLayout } from './pages/_layouts/texto-integral';

export const AdminRouter = createHashRouter([
  {
    path: '/',
    element: <AppLayoutPublic />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <HomePublic /> },
      { path: '/sobre', element: <Sobre /> },
      { path: '/atos', element: <AtosPublic /> },
      { path: '/ficha/:id', element: <Ficha /> },
      
    ]
  },
  
  {
    path: '/',
    element: <AppLayoutChefia />,
    errorElement: <NotFound />,
    children: [
      { path: '/chefia', element:<PrivateRoute allowedProfiles={[2]}><HomeChefia /></PrivateRoute>  },
      { path: '/chefia/sobre', element: <PrivateRoute allowedProfiles={[2]}><Sobre /></PrivateRoute>  },
      { path: '/chefia/atos', element: <PrivateRoute allowedProfiles={[2]}><AtosChefia /></PrivateRoute>  },
      { path: '/chefia/ficha/:id', element:<PrivateRoute allowedProfiles={[2]}><Ficha /></PrivateRoute>  },
      { path: '/chefia/texto-integral/:id', element: <PrivateRoute allowedProfiles={[2]}><TextoIntegral /></PrivateRoute>  },
      { path: '/chefia/dashboard', element: <PrivateRoute allowedProfiles={[2]}><Dashboard /></PrivateRoute> },
    ]
  },
  {
    path: '/',
    element: <AppLayoutEstagiario />,
    errorElement: <NotFound />,
    children: [
      { path: '/estagiario', element: <PrivateRoute allowedProfiles={[3]}><HomeEstagiario /></PrivateRoute> },
      { path: '/estagiario/sobre', element: <PrivateRoute allowedProfiles={[3]}><Sobre /></PrivateRoute> },
      { path: '/estagiario/atos', element: <PrivateRoute allowedProfiles={[3]}><AtosEstagiario /></PrivateRoute> },
      { path: '/estagiario/ficha/:id', element: <PrivateRoute allowedProfiles={[3]}><Ficha /></PrivateRoute> },
      { path: '/estagiario/registro', element: <PrivateRoute allowedProfiles={[3]}><NovoRegistroEstagiario /></PrivateRoute> },
      { path: '/estagiario/texto-integral/:id', element:<PrivateRoute allowedProfiles={[3]}><TextoIntegral /></PrivateRoute>  },
      { path: '/estagiario/editar/:id', element: <PrivateRoute allowedProfiles={[3]}><EditarRegistroEstagiario /></PrivateRoute> },
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: '/sign-in', element: <SignIn /> },
      { path: '/admin/sign-up', element: <PrivateRoute allowedProfiles={[1]}><SignUp /></PrivateRoute> },
    ]
  },
  {
    path: '/',
    element: <TextoIntegralLayout/>,
    children: [
        { path: '/texto-integral/:id', element: <TextoIntegral /> },
      
    ]
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/admin', element: <PrivateRoute allowedProfiles={[1]}><Inicio /></PrivateRoute> },
      { path: '/admin/dashboard', element: <PrivateRoute allowedProfiles={[1]}><Dashboard /></PrivateRoute> },
      { path: '/admin/sobre', element: <PrivateRoute allowedProfiles={[1]}><Sobre /></PrivateRoute> },
      { path: '/admin/atos', element: <PrivateRoute allowedProfiles={[1]}><Atos /></PrivateRoute> },
      { path: '/admin/ficha/:id', element: <PrivateRoute allowedProfiles={[1]}><Ficha /></PrivateRoute>  },
      { path: '/admin/registro', element: <PrivateRoute allowedProfiles={[1]}><NovoRegistro /></PrivateRoute> },
      { path: '/admin/editar/:id', element: <PrivateRoute allowedProfiles={[1]}><EditarRegistro /></PrivateRoute> },
      { path: '/admin/usuario', element: <PrivateRoute allowedProfiles={[1]}><ManagementUser /></PrivateRoute> },
    ]
  },
]);

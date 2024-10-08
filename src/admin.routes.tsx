import { createHashRouter } from "react-router-dom";
import { Dashboard } from "@/pages/app/dashboard/dashboard";
import { SignIn } from "@/pages/auth/sign-in";
import { AppLayout } from "@/pages/_layouts/app";
import { AuthLayout } from "@/pages/_layouts/auth";
import { SignUp } from "@/pages/auth/sign-up";
import { Atos } from "@/pages/app/atos/atos-card-teste";
import { NotFound } from "@/pages/404";
import { Sobre } from "@/pages/sobre";
import { Ficha } from "@/pages/app/ficha/ficha";
import { NovoRegistro } from "@/pages/app/atos/atos-registro";
import { TextoIntegral } from '@/pages/app/conteudo/conteudo-ato';
import { EditarRegistro } from "@/pages/app/atos/atos-editar";
import { ManagementUser } from '@/pages/app/gestao/gestao-user';
import { AtosPublic } from '@/pages/app/atosPublic/atos-card-public';
import { AppLayoutPublic } from '@/pages/_layouts/app-public';
import { AppLayoutEstagiario } from '@/pages/_layouts/app-estagiario';
import { AtosEstagiario } from '@/pages/app/atosEstagiario/atos-card-estagiario';
import { EditarRegistroEstagiario } from '@/pages/app/atos/atos-editar-estagiario';
import PrivateRoute from '@/utils/private-route';
import { NovoRegistroEstagiario } from '@/pages/app/atosEstagiario/atos-registro-estagiario';
import { AppLayoutChefia } from '@/pages/_layouts/app-chefias';
import { AtosChefia } from '@/pages/app/atosChefias/atos-card-chefias-exibir';
import { TextoIntegralLayout } from '@/pages/_layouts/texto-integral';
import SearchPage from '@/pages/SearchPage';
import ResultsPage from '@/pages/ResultsPage';
import SearchPageAdmin from '@/pages/SearchPageAdm';
import SearchPageEstagiario from '@/pages/SearchPageEstagiario';
import SearchPageChefia from './pages/SearchPageChefia';
import { FichaLayout } from './pages/_layouts/ficha';

export const AdminRouter = createHashRouter([
  {
    path: '/',
    element: <AppLayoutPublic />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <SearchPage /> },
      { path: '/results', element: <ResultsPage /> },
      { path: '/sobre', element: <Sobre /> },
      { path: '/atos', element: <AtosPublic /> },
      
    ]
  },
  
  {
    path: '/',
    element: <AppLayoutChefia />,
    errorElement: <NotFound />,
    children: [
      { path: '/chefia', element:<PrivateRoute allowedProfiles={[2]}><SearchPageChefia /></PrivateRoute>  },
      { path: '/chefia/results', element: <PrivateRoute allowedProfiles={[2]}><ResultsPage /></PrivateRoute> },
      { path: '/chefia/sobre', element: <PrivateRoute allowedProfiles={[2]}><Sobre /></PrivateRoute>  },
      { path: '/chefia/atos', element: <PrivateRoute allowedProfiles={[2]}><AtosChefia /></PrivateRoute>  },
      { path: '/chefia/ficha/:id', element:<PrivateRoute allowedProfiles={[2]}><Ficha /></PrivateRoute>  },
      { path: '/chefia/dashboard', element: <PrivateRoute allowedProfiles={[2]}><Dashboard /></PrivateRoute> },
    ]
  },
  {
    path: '/',
    element: <AppLayoutEstagiario />,
    errorElement: <NotFound />,
    children: [
      { path: '/estagiario', element: <PrivateRoute allowedProfiles={[3]}><SearchPageEstagiario /></PrivateRoute> },
      { path: '/estagiario/results', element: <PrivateRoute allowedProfiles={[3]}><ResultsPage /></PrivateRoute> },
      { path: '/estagiario/sobre', element: <PrivateRoute allowedProfiles={[3]}><Sobre /></PrivateRoute> },
      { path: '/estagiario/atos', element: <PrivateRoute allowedProfiles={[3]}><AtosEstagiario /></PrivateRoute> },
      { path: '/estagiario/registro', element: <PrivateRoute allowedProfiles={[3]}><NovoRegistroEstagiario /></PrivateRoute> },
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
    element: <FichaLayout/>,
    children: [
        { path: '/ficha/:id', element: <Ficha /> },
      
    ]
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/admin', element: <PrivateRoute allowedProfiles={[1]}><SearchPageAdmin /></PrivateRoute> },
      { path: '/admin/results', element: <PrivateRoute allowedProfiles={[1]}><ResultsPage /></PrivateRoute> },
      { path: '/admin/dashboard', element: <PrivateRoute allowedProfiles={[1]}><Dashboard /></PrivateRoute> },
      { path: '/admin/sobre', element: <PrivateRoute allowedProfiles={[1]}><Sobre /></PrivateRoute> },
      { path: '/admin/atos', element: <PrivateRoute allowedProfiles={[1]}><Atos /></PrivateRoute> },
      { path: '/admin/registro', element: <PrivateRoute allowedProfiles={[1]}><NovoRegistro /></PrivateRoute> },
      { path: '/admin/editar/:id', element: <PrivateRoute allowedProfiles={[1]}><EditarRegistro /></PrivateRoute> },
      { path: '/admin/usuario', element: <PrivateRoute allowedProfiles={[1]}><ManagementUser /></PrivateRoute> },
    ]
  },
]);

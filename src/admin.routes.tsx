import { createHashRouter } from "react-router-dom";
import { Dashboard } from "@/pages/app/dashboard/dashboard";
import { SignIn } from "@/pages/auth/sign-in";
import { AppLayout } from "@/pages/_layouts/app";
import { AuthLayout } from "@/pages/_layouts/auth";
import { SignUp } from "@/pages/auth/sign-up";
import { NotFound } from "@/pages/404";
import { Sobre } from "@/pages/sobre";
import { Ficha } from "@/pages/app/ficha/ficha";
import { NovoRegistro } from "@/TipTapEditor/NovoAto";
import { TextoIntegral } from '@/pages/app/conteudo/conteudo-ato';
import { EditarRegistro } from "@/TipTapEditor/EditarAto";
import { ManagementUser } from '@/pages/app/gestao/gestao-user';
import { AppLayoutPublic } from '@/pages/_layouts/app-public';
import { AppLayoutEstagiario } from '@/pages/_layouts/app-estagiario';
import PrivateRoute from '@/utils/private-route';
import { AppLayoutChefia } from '@/pages/_layouts/app-chefias';
import { TextoIntegralLayout } from '@/pages/_layouts/texto-integral';
import SearchPage from '@/pages/SearchPage';
import ResultsPage from '@/pages/ResultsPage';
import SearchPageAdmin from '@/pages/SearchPageAdm';
import SearchPageEstagiario from '@/pages/SearchPageEstagiario';
import SearchPageChefia from '@/pages/SearchPageChefia';
import { FichaLayout } from '@/pages/_layouts/ficha';
import AtosNormativosPublic from '@/pages/app/atosPublic/AtosNormativosPublic';
import AtosNormativosAdmin from '@/pages/app/atos/AtosNormativosAdmin';
import AtosNormativosEstagiario from '@/pages/app/atosEstagiario/AtosNormativosEstagiario';
import AtosNormativosChefia from '@/pages/app/atosChefias/AtosNormativosChefia';
import ResultsPageAdmin from '@/pages/ResultsPageAdmin';
import ResultsPageEstagiario from '@/pages/ResultsPageEstagiario';
import ResultsPageChefia from '@/pages/ResultsPageChefia';

export const AdminRouter = createHashRouter([
  {
    path: '/',
    element: <AppLayoutPublic />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <SearchPage /> },
      { path: '/results', element: <ResultsPage /> },
      { path: '/sobre', element: <Sobre /> },
      { path: '/atos', element: <AtosNormativosPublic /> },
      
    ]
  },
  
  {
    path: '/',
    element: <AppLayoutChefia />,
    errorElement: <NotFound />,
    children: [
      { path: '/chefia', element:<PrivateRoute allowedProfiles={[2]}><SearchPageChefia /></PrivateRoute>  },
      { path: '/chefia/results', element: <PrivateRoute allowedProfiles={[2]}><ResultsPageChefia /></PrivateRoute> },
      { path: '/chefia/sobre', element: <PrivateRoute allowedProfiles={[2]}><Sobre /></PrivateRoute>  },
      { path: '/chefia/atos', element: <PrivateRoute allowedProfiles={[2]}><AtosNormativosChefia /></PrivateRoute>  },
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
      { path: '/estagiario/results', element: <PrivateRoute allowedProfiles={[3]}><ResultsPageEstagiario /></PrivateRoute> },
      { path: '/estagiario/sobre', element: <PrivateRoute allowedProfiles={[3]}><Sobre /></PrivateRoute> },
      { path: '/estagiario/atos', element: <PrivateRoute allowedProfiles={[3]}><AtosNormativosEstagiario /></PrivateRoute> },
      { path: '/estagiario/registro', element: <PrivateRoute allowedProfiles={[3]}><NovoRegistro /></PrivateRoute> },
      { path: '/estagiario/editar/:id', element: <PrivateRoute allowedProfiles={[3]}><EditarRegistro /></PrivateRoute> },
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
      { path: '/admin/results', element: <PrivateRoute allowedProfiles={[1]}><ResultsPageAdmin /></PrivateRoute> },
      { path: '/admin/dashboard', element: <PrivateRoute allowedProfiles={[1]}><Dashboard /></PrivateRoute> },
      { path: '/admin/sobre', element: <PrivateRoute allowedProfiles={[1]}><Sobre /></PrivateRoute> },
      { path: '/admin/atos', element: <PrivateRoute allowedProfiles={[1]}><AtosNormativosAdmin /></PrivateRoute> },
      { path: '/admin/registro', element: <PrivateRoute allowedProfiles={[1]}><NovoRegistro /></PrivateRoute> },
      { path: '/admin/editar/:id', element: <PrivateRoute allowedProfiles={[1]}><EditarRegistro /></PrivateRoute> },
      { path: '/admin/usuario', element: <PrivateRoute allowedProfiles={[1]}><ManagementUser /></PrivateRoute> },
    ]
  },
]);

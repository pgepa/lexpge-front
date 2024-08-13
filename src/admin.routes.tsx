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
import { Navigate } from 'react-router-dom';
import { AtosPublic } from './pages/app/atosPublic/atos-card-public';
import { AppLayoutPublic } from './pages/_layouts/app-public';
import { HomePublic } from './pages/home-public';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/sign-in" />;
};

export const AdminRouter = createHashRouter([
  {
    path: '/',
    element: <AppLayoutPublic />,  // Default layout for the initial route
    errorElement: <NotFound />,
    children: [
        { path: '/', element: <HomePublic />},  // Default home route
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
  },
  {
    path: '/admin',
    element: <AppLayout />,
    children: [
      { path: '/admin', element: <Inicio />},
      { path: '/admin/dashboard', element: 
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      },
      { path: '/admin/sobre', element: <Sobre/>},
      { path: '/admin/atos/', element:
        <PrivateRoute>
            <Atos />
        </PrivateRoute>         
      },
      { path: '/admin/ficha/:id', element: <Ficha />},
      { path: '/admin/registro', element: 
        <PrivateRoute>
            <NovoRegistro />
        </PrivateRoute> 
      
    },
      { path: '/admin/texto-integral/:id', element: <TextoIntegral />},
      { path: '/admin/editar/:id', element:
        <PrivateRoute>
         <EditarRegistro />
        </PrivateRoute> 
      },     
      { path: '/admin/usuario', element:
        <PrivateRoute>
         <ManagementUser />
        </PrivateRoute>          
      
     }     
    ]
  },
]);

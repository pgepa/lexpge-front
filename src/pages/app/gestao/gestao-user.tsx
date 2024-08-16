import { Helmet } from 'react-helmet-async';

import { UserCard } from './user-exibicao';
import { SignUp } from './novo-usuario';
  

export const ManagementUser  = () => (
  <>
    <Helmet title="Atos Normativos" />
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Usuários Cadastrados</h1>
        
        <SignUp/>
        
      </div>
      
      <UserCard />

    

    </div>
  </>
);

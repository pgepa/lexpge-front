import { Helmet } from 'react-helmet-async';

import { AtosCardChefia } from './atos-card-chefias';
  

export const AtosChefia = () => (
  <>
    <Helmet title="Atos Normativos" />
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Atos Normativos</h1>
      </div>
      

      <AtosCardChefia />

      

    </div>
  </>
);

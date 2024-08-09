import { Helmet } from 'react-helmet-async';

import { AtosCardPublic } from './atos-card-model';
  

export const AtosPublic = () => (
  <>
    <Helmet title="Atos Normativos" />
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Atos Normativos</h1>
      </div>
      

      <AtosCardPublic />

      

    </div>
  </>
);

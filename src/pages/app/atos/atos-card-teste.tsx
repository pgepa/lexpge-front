import { Helmet } from 'react-helmet-async';
import { AtosCard } from './atos-card';
import { AtosTableFilters } from './atos-table-filters';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
  

export const Atos = () => (
  <>
    <Helmet title="Atos Normativos" />
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Atos Normativos</h1>
        <NavLink to="/registro">
          <Button type="submit" variant="default" size="sm">
            <CirclePlus className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </NavLink>
      </div>
      <AtosTableFilters />

      <AtosCard />

      

    </div>
  </>
);

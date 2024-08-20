import { Helmet } from 'react-helmet-async';
import { AtosCardEstagiario } from '@/pages/app/atosEstagiario/atos-card';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
  

export const AtosEstagiario = () => (
  <>
    <Helmet title="Atos Normativos" />
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Atos Normativos</h1>
        <NavLink to="/estagiario/registro">
          <Button type="submit" variant="default" size="sm">
            <CirclePlus className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </NavLink>
      </div>
      

      <AtosCardEstagiario />

      

    </div>
  </>
);

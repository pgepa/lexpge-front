
import React from 'react';
import SearchFilter from '@/pages/app/atosEstagiario/SearchFilterAtosEstagiario';
import ResultsList from '@/pages/app/atosEstagiario/ResultAtosCardEstagiario';
import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';

const AtosNormativosEstagiario: React.FC = () => {
    return (
    <>

            <Helmet title="Atos Normativos" />
            <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Atos Normativos</h1>
                    <NavLink to="/estagiario/registro">
                        <Button type="submit" variant="default" size="sm">
                            <CirclePlus className="mr-2 h-4 w-4" />
                            Novo Ato Normativo
                        </Button>
                    </NavLink>
                </div>

                
                    <SearchFilter />
                    <ResultsList />

                </div>

            </>

            );
};

            export default AtosNormativosEstagiario;

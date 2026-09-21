import { useSearchParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { MonthAtosAmountCard } from "./month-atos-amount-card";
import { YearAtosAmountCard } from "./year-atos-amount-card";
import { DayAtosAmountCard } from "./day-atos-amount-card";
import { TotalAtosAmountCard } from "./total-atos-amount-card";
import { AmountChart } from "./amount-chart";
import { PopularAtosChart } from "./popular-atos-chart";
import { TeamProductivity } from "./team-productivity";
import { BarChart3, Users } from "lucide-react";

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('aba') || searchParams.get('tab') || 'geral';

  const setAba = (aba: string) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('aba', aba);
      return p;
    });
  };

  return (
    <>
      <Helmet title={currentTab === 'produtividade' ? "Produtividade da Equipe | Dashboard" : "Dashboard Gerencial"} />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Dashboard Gerencial
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Painel de indicadores estatísticos e acompanhamento de produtividade dos atos normativos.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setAba('geral')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all ${
                currentTab === 'geral'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Visão Geral dos Atos
            </button>
            <button
              type="button"
              onClick={() => setAba('produtividade')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all ${
                currentTab === 'produtividade'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Users className="h-4 w-4" />
              Produtividade da Equipe
            </button>
          </div>
        </div>

        {currentTab === 'geral' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DayAtosAmountCard />
              <MonthAtosAmountCard />
              <YearAtosAmountCard />
              <TotalAtosAmountCard />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
              <AmountChart />
              <PopularAtosChart />
            </div>
          </>
        ) : (
          <TeamProductivity />
        )}
      </div>
    </>
  );
}
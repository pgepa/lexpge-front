import { useEffect, useState } from "react";
import { api } from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MesData {
  mes: number;
  total: number;
}

interface DashboardResponse {
  por_mes: MesData[];
}

const mesesNomes = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function MonthAtosAmountCard() {
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;

  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [totalMes, setTotalMes] = useState<number | null>(null);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get<DashboardResponse>(
          `/dashboard/atos?ano=${anoSelecionado}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const porMes = response.data.por_mes;
        const mesAtualData = porMes.find((m) => m.mes === mesSelecionado);
        const mesAnteriorData = porMes.find((m) => m.mes === mesSelecionado - 1);

        const totalAtual = mesAtualData?.total ?? 0;
        const totalAnterior = mesAnteriorData?.total ?? 0;

        const variacao =
          totalAnterior > 0
            ? ((totalAtual - totalAnterior) / totalAnterior) * 100
            : null;

        setTotalMes(totalAtual);
        setPercentChange(variacao);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [anoSelecionado, mesSelecionado]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 pb-2">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-base font-semibold">
            Atos cadastrados por mês
          </CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex gap-2 w-full">
          {/* Select de Ano */}
          <Select
            value={String(anoSelecionado)}
            onValueChange={(value) => setAnoSelecionado(Number(value))}
          >
            <SelectTrigger className="h-8 w-1/2">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025].map((ano) => (
                <SelectItem key={ano} value={String(ano)}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Select de Mês */}
          <Select
            value={String(mesSelecionado)}
            onValueChange={(value) => setMesSelecionado(Number(value))}
          >
            <SelectTrigger className="h-8 w-1/2">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {mesesNomes.map((nome, index) => (
                <SelectItem key={index + 1} value={String(index + 1)}>
                  {nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        {loading && (
          <span className="text-sm text-muted-foreground">Carregando...</span>
        )}
        {error && (
          <span className="text-sm text-red-500">Erro ao carregar dados</span>
        )}
        {!loading && !error && (
          <>
            <span className="text-2xl font-bold tracking-tight">
               {(totalMes ?? 0).toLocaleString('pt-BR')}
            </span>
            {percentChange !== null ? (
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    percentChange >= 0
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-red-500"
                  }
                >
                  {percentChange >= 0 ? "+" : ""}
                  {percentChange.toFixed(1)}%
                </span>{" "}
                em relação ao mês anterior
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Sem comparação com mês anterior
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { PieChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface AnoData {
  ano: number;
  total: number;
}

interface DashboardResponse {
  por_ano: AnoData[];
}


export function YearAtosAmountCard() {
  const anoAtual = new Date().getFullYear();

  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);
  const [totalAno, setTotalAno] = useState<number | null>(null);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  
  const anosDisponiveis = [2025];

  useEffect(() => {
    const fetchDadosPorAno = async (ano: number): Promise<number> => {
      const token = localStorage.getItem("token");

      const response = await api.get<DashboardResponse>(
        `/dashboard/atos?ano=${ano}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const anoData = response.data.por_ano.find((a) => a.ano === ano);
      return anoData?.total ?? 0;
    };

    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [totalAtual, totalAnterior] = await Promise.all([
          fetchDadosPorAno(anoSelecionado),
          fetchDadosPorAno(anoSelecionado - 1),
        ]);

        const variacao =
          totalAnterior > 0
            ? ((totalAtual - totalAnterior) / totalAnterior) * 100
            : null;

        setTotalAno(totalAtual);
        setPercentChange(variacao);
        setError(false);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard por ano", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [anoSelecionado]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 pb-2">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-base font-semibold">
            Atos cadastrados por ano
          </CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </div>

        <Select
          value={String(anoSelecionado)}
          onValueChange={(value) => setAnoSelecionado(Number(value))}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {anosDisponiveis.map((ano) => (
              <SelectItem key={ano} value={String(ano)}>
                {ano}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              {(totalAno ?? 0).toLocaleString('pt-BR')} 
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
                em relação ao ano anterior
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Sem comparação com ano anterior
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DiaData {
  dia: number;
  total: number;
}

interface DashboardResponse {
  por_dia: DiaData[];
}

const mesesNomes = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function DayAtosAmountCard() {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  const diaAtual = hoje.getDate();

  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [diaSelecionado, setDiaSelecionado] = useState(diaAtual);
  const [totalDia, setTotalDia] = useState<number | null>(null);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const gerarDiasDoMes = (ano: number, mes: number): number[] => {
    const totalDias = new Date(ano, mes, 0).getDate();
    return Array.from({ length: totalDias }, (_, i) => i + 1);
  };

  const getData = async (ano: number, mes: number, dia: number) => {
    const token = localStorage.getItem("token");
    const response = await api.get<DashboardResponse>(
      `/dashboard/atos?ano=${ano}&mes=${mes}&dia=${dia}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.por_dia[0]?.total ?? 0;
  };

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

        // data atual
        const totalAtual = await getData(anoSelecionado, mesSelecionado, diaSelecionado);

        // data anterior (manualmente ajustada)
        const dataAtual = new Date(anoSelecionado, mesSelecionado - 1, diaSelecionado);
        const dataAnterior = new Date(dataAtual);
        dataAnterior.setDate(dataAtual.getDate() - 1);

        const anoAnterior = dataAnterior.getFullYear();
        const mesAnterior = dataAnterior.getMonth() + 1;
        const diaAnterior = dataAnterior.getDate();

        const totalAnterior = await getData(anoAnterior, mesAnterior, diaAnterior);

        const variacao =
          totalAnterior > 0
            ? ((totalAtual - totalAnterior) / totalAnterior) * 100
            : null;

        setTotalDia(totalAtual);
        setPercentChange(variacao);
        setError(false);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard por dia", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [anoSelecionado, mesSelecionado, diaSelecionado]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 pb-2">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-base font-semibold">
            Atos cadastrados por dia
          </CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full">
          <Select
            value={String(anoSelecionado)}
            onValueChange={(v) => setAnoSelecionado(Number(v))}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map((ano) => (
                <SelectItem key={ano} value={String(ano)}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(mesSelecionado)}
            onValueChange={(v) => setMesSelecionado(Number(v))}
          >
            <SelectTrigger className="h-8 w-full">
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

          <Select
            value={String(diaSelecionado)}
            onValueChange={(v) => setDiaSelecionado(Number(v))}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Dia" />
            </SelectTrigger>
            <SelectContent>
              {gerarDiasDoMes(anoSelecionado, mesSelecionado).map((dia) => (
                <SelectItem key={dia} value={String(dia)}>
                  {dia}
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
              {totalDia}
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
                em relação ao dia anterior
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Sem comparação com dia anterior
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

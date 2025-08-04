import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
} from "recharts";
import colors from "tailwindcss/colors";

interface PeriodoData {
  ano: number;
  mes: number;
  total: number;
}

const mesesAbreviados = [
  "", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export function AmountChart() {
  const [data, setData] = useState<{ date: string; atos: number }[]>([]);
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
        const response = await api.get<PeriodoData[]>("/dashboard/atos/periodo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formatted = response.data.map((item) => ({
          date: `${mesesAbreviados[item.mes]}/${item.ano}`,
          atos: item.total,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Erro ao buscar dados do período", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-5">
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-8">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">Atos nos últimos 6 Meses</CardTitle>
            <CardDescription>Evolução de Atos Cadastrados</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-muted-foreground">Carregando...</p>}
          {error && <p className="text-sm text-red-500">Erro ao carregar dados</p>}
          {!loading && !error && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} style={{ fontSize: 12 }}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16} />
                <YAxis stroke="#888" axisLine={false} tickLine={false} width={80} />
                <CartesianGrid vertical={false} className="stroke-muted" />
                <Tooltip
                  formatter={(value: number) => [`${value} atos`, "Total"]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Line
                  type="linear"
                  strokeWidth={2}
                  dataKey="atos"
                  stroke={colors.violet[500]}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart as BarChartIcon } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import colors from "tailwindcss/colors";

interface AcessoData {
  tipo_id: string;
  quantidade: number;
}

const COLORS = [
  colors.sky[500],
  colors.amber[500],
  colors.violet[500],
  colors.emerald[500],
  colors.rose[500],
  colors.fuchsia[500],
  colors.cyan[500],
  colors.teal[500],
  colors.orange[500],
  colors.red[500],
  colors.green[500],
  colors.blue[500],
  colors.yellow[500],
];

export function PopularAtosChart() {
  const [data, setData] = useState<AcessoData[]>([]);
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
        const response = await api.get("/dashboard/atos/acessados", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Renomeando e limitando aos 10 mais acessados
        const renamedData = response.data
          .map((item: any) => ({
            tipo_id: item.tipo_id,
            quantidade: item.soma_relevancia,
          }))
          .sort((a: { quantidade: number; }, b: { quantidade: number; }) => b.quantidade - a.quantidade) // ordena por mais acessados
          .slice(0, 10); // pega os 10 primeiros

        setData(renamedData);
      } catch (err) {
        console.error("Erro ao buscar atos mais acessados", err);
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
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              Atos mais acessados
            </CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          )}
          {error && (
            <p className="text-sm text-red-500">Erro ao carregar dados</p>
          )}
          {!loading && !error && data.length > 0 && (
            <ResponsiveContainer width="100%" height={270}>
              <BarChart
                data={data}
                layout="vertical"
                margin={{ left: 60, right: 5 }}
              >
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis
                  dataKey="tipo_id"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="quantidade" barSize={20}>
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

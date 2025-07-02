import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { PieChart } from "lucide-react";

interface DashboardResponse {
  total_global: number;
}

export function TotalAtosAmountCard() {
  const [totalGlobal, setTotalGlobal] = useState<number | null>(null);
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
        const response = await api.get<DashboardResponse>(
          `/dashboard/atos?ano=${new Date().getFullYear()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTotalGlobal(response.data.total_global ?? 0);
      } catch (err) {
        console.error("Erro ao buscar total global de atos", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="flex-row space-y-0 flex items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          Total de atos cadastrados
        </CardTitle>
        <PieChart className="h-4 w-4 text-muted-foreground" />
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
              {totalGlobal?.toLocaleString("pt-BR")}
            </span>
            <p className="text-xs text-muted-foreground">
              Total de Atos Normativos cadastrados na base{" "}
              <span className="text-violet-600 dark:text-violet-400">LEXPGE</span>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

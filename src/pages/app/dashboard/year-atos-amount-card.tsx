import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

export function YearAtosAmountCard() {
  return (
    <Card>
            <CardHeader className="flex-row space-y-0 flex-items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Total de atos cadastrados (ano)</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1">
              <span className="text-2xl font-bold tracking-tight">
                1.200
              </span>
              <p className="text-xs text-muted-foreground">
                <span className="text-violet-600 dark:text-violet-400">+8%</span> em relação ao mês ano anterior
              </p>
            </CardContent>
          </Card>
  )
}
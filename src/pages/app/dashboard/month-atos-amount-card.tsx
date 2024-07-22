import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

export function MonthAtosAmountCard() {
  return (
    <Card>
            <CardHeader className="flex-row space-y-0 flex-items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Total de atos cadastrados (mês)</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1">
              <span className="text-2xl font-bold tracking-tight">
                200
              </span>
              <p className="text-xs text-muted-foreground">
                <span className="text-violet-600 dark:text-violet-400">+5%</span> em relação ao mês passado
              </p>
            </CardContent>
          </Card>
  )
}
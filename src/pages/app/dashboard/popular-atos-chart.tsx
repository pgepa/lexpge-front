import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import colors from "tailwindcss/colors"

const data = [
  {tipo: 'Resolução', total: 30},
  {tipo: 'Portaria', total: 22},
  {tipo: 'Constituição', total: 14},
  {tipo: 'Decreto lei', total:7},
  {tipo: 'Lei ordinária', total: 35}
 
]
const COLORS = [
  colors.sky[500],
  colors.amber[500],
  colors.violet[500],
  colors.emerald[500],
  colors.rose[500]
]

export function PopularAtosChart() {
  return (
    <div className="col-span-3">
      <Card>
        <CardHeader className="pb-8">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Atos mais acessados</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground"/>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart style={{fontSize: 12}}>

              <Pie data={data} dataKey="total" nameKey="tipo" cx="50%" cy="50%" outerRadius={86} innerRadius={64} strokeWidth={8}
              labelLine={false} 
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                index,
              }) => {
                const RADIAN = Math.PI / 180
                const radius = 12 + innerRadius + (outerRadius - innerRadius)
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)
              
                return (
                  <text
                    x={x}
                    y={y}
                    className="fill-muted-foreground text-xs"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {data[index].tipo.length > 15
                      ? data[index].tipo.substring(0, 15).concat('...')
                      : data[index].tipo}{' '}
                    ({value})
                  </text>
                )
              }}>
                {data.map((_, index)=> {
                  return (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} className="stroke-background hover:opacity-80" />
                  )
                })}
              </Pie>                       
              
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
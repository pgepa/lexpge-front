import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Line } from "recharts"
import colors from "tailwindcss/colors"

const data = [
  {date: '10/12', atos: 12},
  {date: '11/12', atos: 6},
  {date: '12/12', atos: 20},
  {date: '13/12', atos: 4},
  {date: '14/12', atos: 14},
  {date: '15/12', atos: 15},
  {date: '16/12', atos: 16},
]

export function AmountChart() {
  return (
    <div className="col-span-5">
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-8">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">Atos cadastrados no período</CardTitle>
            <CardDescription>Total diário de atos cadastrados no período</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data} style={{fontSize: 12}}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16}/>

              <YAxis stroke="#888" axisLine={false} tickLine={false} width={80}/>

              <CartesianGrid vertical= {false} className="stroke-muted" />

              <Line type="linear" strokeWidth={2} dataKey="atos" stroke={colors.violet[500]} />
              
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
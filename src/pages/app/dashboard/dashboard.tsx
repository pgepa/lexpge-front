import { MonthAtosAmountCard } from "./month-atos-amount-card"
import { Helmet } from 'react-helmet-async'
import { YearAtosAmountCard } from "./year-atos-amount-card"
import { DayAtosAmountCard } from "./day-atos-amount-card"
import { TotalAtosAmountCard } from "./total-atos-amount-card"
import { AmountChart } from "./amount-chart"
import { PopularAtosChart } from "./popular-atos-chart"

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

          <div className="grid grid-cols-4 gap-4">
            <DayAtosAmountCard />
            <MonthAtosAmountCard />
            <YearAtosAmountCard />
            <TotalAtosAmountCard />
          </div>

          <div className="grid grid-cols-10 gap-4">
            <AmountChart />
            <PopularAtosChart />
          </div>

      </div>
    </>
  )
}
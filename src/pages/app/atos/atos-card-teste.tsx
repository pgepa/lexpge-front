import { Helmet } from 'react-helmet-async'
import { AtosCard } from './atos-card'
import { AtosTableFilters } from './atos-table-filters'
import { Pagination } from '@/components/pagination'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react'




export function Atos() {

 
  return (
    <>
      <Helmet title="Atos Normativos" />

      

      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Atos Normativos</h1>
          <NavLink to="/registro">
              <Button type="submit" variant="default" size="xs">
                <CirclePlus className="h-4 w-4 mr-2" />
                Novo Registro
              </Button>
            </NavLink>

        </div>

        <div>
        </div>

        <AtosTableFilters />

               
          {Array.from({length: 10}).map((_, i) => {
             return (
                <AtosCard key={i}/>
              )
          })}
        
                       

        <Pagination pageIndex={0} totalCount={18750} perPage={10}/>
         
      </div>
    </>
  )
}
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AtosTableRow } from  "../atos/atos-table-row"
import { Helmet } from "react-helmet-async";
import { AtosTableFilters } from "../atos/atos-table-filters"
import { Pagination } from "@/components/pagination";

export function AtosTable() {
  return (
    <>
      <Helmet title="Atos Normativos"/>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Atos Normativos</h1>
        <div className="space-y-2.5">
          <AtosTableFilters />

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[64px]">Número</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Ementa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Data do ato</TableHead>
                  <TableHead>Data da publicação</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead className="w-[64px]"></TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
             {Array.from({length: 10}).map((_, i) => {
              return (
               <AtosTableRow key={i}/>
              )
             })}
            </TableBody>
          </Table>
          </div>

          <Pagination pageIndex={0} totalCount={105} perPage={10}/>
        </div>
      </div>
    </>
  )
}
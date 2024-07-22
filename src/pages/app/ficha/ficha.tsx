import { Table, TableBody, TableRow, TableCell, TableFooter } from "@/components/ui/table";

import { Helmet } from "react-helmet-async";

export function Ficha() {
  return (
    <>
      <Helmet title="Ficha"/>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold tracking-tight text-center">Constituição Estadual de 05 de Outubro de 1989</h1>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Número:</TableCell>
              <TableCell className="flex justify-start">123456</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Título:</TableCell>
              <TableCell className="flex justify-start">Constituição Estadual de 05 de Outubro de 1989</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Ementa:</TableCell>
              <TableCell className="flex justify-start">CONSTITUIÇÃO DO ESTADO DO PARÁ</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Tipo:</TableCell>
              <TableCell className="flex justify-start">Constituição Estadual</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Fonte:</TableCell>
              <TableCell className="flex justify-start">DOE</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Situação:</TableCell>
              <TableCell className="flex justify-start">Vigente</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Data do ato:</TableCell>
              <TableCell className="flex justify-start">05/10/1989</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Data de publicação:</TableCell>
              <TableCell className="flex justify-start">06/10/1989</TableCell>
            </TableRow>
            
          </TableBody>
          
          <TableFooter>
          <TableRow>
              <TableCell className="text-muted-foreground">Observação:</TableCell>
              <TableCell className="flex text-justify font-medium">Publicada em encarte do DOE nº 26.573, de 06/10/1989; Republicada no DOE nº 26.587, de 27/10/1989. Atualizada até a Emenda Constitucional nº 91, de 21/05/2024, publicada no DOE nº 35.838, de 29/05/2024.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Descritores:</TableCell>
              <TableCell className="flex text-justify font-medium">LISTA PRÉ-APROVADA, PROCESSO JUDICIAIS, IGEPREV, PGE.</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

    </>
  )
}
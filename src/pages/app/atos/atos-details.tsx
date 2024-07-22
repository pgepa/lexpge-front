import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableFooter, TableRow } from "@/components/ui/table";

export function AtosDetails() {
  return (
    <DialogContent>
      <DialogHeader>Detalhes do Ato Normativo</DialogHeader>
      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Número:</TableCell>
              <TableCell className="flex justify-end">123456</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Título:</TableCell>
              <TableCell className="flex justify-end">Constituição Estadual de 05 de Outubro de 1989</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Ementa:</TableCell>
              <TableCell className="flex justify-end">CONSTITUIÇÃO DO ESTADO DO PARÁ</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Tipo:</TableCell>
              <TableCell className="flex justify-end">Constituição Estadual</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Fonte:</TableCell>
              <TableCell className="flex justify-end">DOE</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Situação:</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      <span>Vigente</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Data do ato:</TableCell>
              <TableCell className="flex justify-end">05/10/1989</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Data de publicação:</TableCell>
              <TableCell className="flex justify-end">06/10/1989</TableCell>
            </TableRow>
            
          </TableBody>
          
          <TableFooter>
          <TableRow>
              <TableCell className="text-muted-foreground">Observação:</TableCell>
              <TableCell className="flex text-justify font-medium">Publicada em encarte do DOE nº 26.573, de 06/10/1989; Republicada no DOE nº 26.587, de 27/10/1989. Atualizada até a Emenda Constitucional nº 91, de 21/05/2024, publicada no DOE nº 35.838, de 29/05/2024.</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </DialogContent>
  )
}
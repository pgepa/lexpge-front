import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableRow, TableCell } from "@/components/ui/table";
import { SquarePen, X, Search, Files } from "lucide-react";
import { AtosDetails } from "./atos-details";


export function AtosTableRow() {
  return (
    <TableRow>
                <TableCell>
                  <div className="flex flex-col items-center justify-center relative gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="xs">
                          <Search className="h-3 w-3" />
                          <span className="sr-only">Detalhes do ato normativo</span>
                        </Button>
                      </DialogTrigger>

                      <AtosDetails />
                    </Dialog>
                    <Button variant="outline" size="xs">
                      <Files className="h-3 w-3" />
                      <span className="sr-only">Visualizar ato normativo</span>
                    </Button>
                  </div>
                  
                </TableCell>
                <TableCell className="font-mono text-xs font-medium">1</TableCell>
                <TableCell className="font-medium">CONSTITUIÇÃO ESTADUAL DE 05 DE OUTUBRO DE 1989</TableCell>
                <TableCell className="text-muted-foreground">CONSTITUIÇÃO DO ESTADO DO PARÁ</TableCell>
                <TableCell className="text-muted-foreground">Constituição Estadual</TableCell>
                <TableCell>DOE</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span>Vigente</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">05/10/1989</TableCell>
                <TableCell className="text-muted-foreground">06/10/1989</TableCell>
                <TableCell className="text-muted-foreground">Publicada em encarte do DOE nº 26.573, de 06/10/1989; Republicada no DOE nº 26.587, de 27/10/1989. Atualizada até a Emenda Constitucional nº 91, de 21/05/2024, publicada no DOE nº 35.838, de 29/05/2024.</TableCell>
                <TableCell>
                  <div className="flex flex-col items-center justify-center relative gap-2">
                    <Button variant="outline" size="xs">
                      <SquarePen className="h-3 w-3 mr-2" />
                        Editar
                    </Button>
                    <Button variant="outline" size="xs">
                      <X className="h-3 w-3 mr-2" />
                      Excluir
                    </Button>
                  </div>
                  
                </TableCell>
                
              </TableRow>
  )
}
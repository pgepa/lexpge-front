import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, PencilLine, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";


export function AtosCard( ) {
  
  return (
   
    <Card>
            <CardHeader className="flex-row space-y-0 flex-items-center justify-between pb-4">
              <div className="space-y-1">
              <CardTitle className="text-base -tracking-tight font-medium text-blue-700 dark:text-blue-300">INSTRUÇÃO NORMATIVA Nº 001 DE 28 DE OUTUBRO DE 2020</CardTitle>
              <CardDescription>Vigente</CardDescription>
              </div>
             
            </CardHeader>
            <CardContent className="space-y-1">
            
              <span>
                <p className="leading-7 [&:not(:first-child)]:mt-6">Fixa procedimentos administrativos a serem adotados nos processos de regularização fundiária de terras públicas do Estado do Pará que na Base Digital Fundiária do ITERPA apresentem incidências em eventuais títulos expedidos nas glebas das antigas colônias estaduais e dá outras providências.</p>
              </span>
          
            </CardContent>
            <CardFooter className="flex justify-start gap-2">
            <div className="flex flex-row items-center justify-center relative gap-2">
                    
                <NavLink to="/ficha">
                        <Button variant="outline" size="xs" className="gap-2 text-amber-500 font-normal  border-amber-500 hover:text-amber-600 dark:border-amber-300 dark:text-amber-300">
                          <Eye className="h-3 w-3" />
                           Ficha
                          <span className="sr-only">Ficha do ato normativo</span>
                        </Button>
                </NavLink>  
                      
                                         
                    <Button variant="outline" size="xs" className="gap-2 text-amber-500 font-normal border-amber-500 hover:text-amber-600 dark:border-amber-300 dark:text-amber-300">
                      <SquareArrowOutUpRight  className="h-3 w-3" />
                      Texto Integral
                      <span className="sr-only">Visualizar texto integral do ato normativo</span>
                    </Button>

                    <Button variant="default" size="xs" className="gap-2">
                      <PencilLine  className="h-3 w-3" />
                      Editar
                      <span className="sr-only">Editar ato normativo</span>
                    </Button>

                    <Button variant="destructive" size="xs" className="gap-2">
                      <Trash2  className="h-3 w-3" />
                      Excluir
                      <span className="sr-only">Excluir ato normativo</span>
                    </Button>
                  </div>
            </CardFooter>
          </Card>
  )
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, PencilLine, SquareArrowOutUpRight, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios'

export type AtoCard = {
  id: number;
  titulo: string;
  situacao: string;
  ementa: string;
}

export const AtosCard = () => {
  const [atos, setAtos] = useState<AtoCard[]>([]);
  const navigate = useNavigate();

  async function loadAtosCard() {
    const response = await api.get('/atos');
    
    //const data = await response.json();
    setAtos(response.data);
  }

  useEffect(() => {
    loadAtosCard();
  }, []);

  const handleFichaClick = (ato: AtoCard) => {
    navigate(`/ficha/${ato.id}`, { state: { ato } });
  };

  const handleTextoIntegralClick = (ato: AtoCard) => {
    navigate(`/texto-integral/${ato.id}`, { state: { ato } });
  };

  const handleEditClick = (ato: AtoCard) => {
    navigate(`/editar/${ato.id}`, { state: { ato } });
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Tem certeza de que deseja excluir este registro?")) {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + `/atos/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setAtos(atos.filter((ato) => ato.id !== id));
          alert("Registro excluído com sucesso.");
        } else {
          alert("Erro ao excluir o registro.");
        }
      } catch (error) {
        console.error("Erro ao excluir o registro:", error);
        alert("Erro ao excluir o registro.");
      }
    }
  };

  return (
    <>
      {atos.map((ato) => (
        <Card key={ato.id}>
          <CardHeader className="flex-items-center flex-row justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium -tracking-tight text-blue-700 dark:text-blue-300">
                {ato.titulo}
              </CardTitle>
              <CardDescription>{ato.situacao}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <span>
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                {ato.ementa}
              </p>
            </span>
          </CardContent>
          <CardFooter className="flex justify-start gap-2">
            <div className="relative flex flex-row items-center justify-center gap-2">
              <Button
                variant="outline"
                size="xs"
                className="gap-2 border-amber-500 font-normal text-amber-500 hover:text-amber-600 dark:border-amber-300 dark:text-amber-300"
                onClick={() => handleFichaClick(ato)}
              >
                <Eye className="h-3 w-3" />
                Ficha
                <span className="sr-only">Ficha do ato normativo</span>
              </Button>
              <Button
                variant="outline"
                size="xs"
                className="gap-2 border-amber-500 font-normal text-amber-500 hover:text-amber-600 dark:border-amber-300 dark:text-amber-300"
                onClick={() => handleTextoIntegralClick(ato)}
              >
                <SquareArrowOutUpRight className="h-3 w-3" />
                Texto Integral
                <span className="sr-only">
                  Visualizar texto integral do ato normativo
                </span>
              </Button>
              <Button
                variant="default"
                size="xs"
                className="gap-2"
                onClick={() => handleEditClick(ato)}
              >
                <PencilLine className="h-3 w-3" />
                Editar
                <span className="sr-only">Editar ato normativo</span>
              </Button>
              <Button
                variant="destructive"
                size="xs"
                className="gap-2"
                onClick={() => handleDeleteClick(ato.id)}
              >
                <Trash2 className="h-3 w-3" />
                Excluir
                <span className="sr-only">Excluir ato normativo</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

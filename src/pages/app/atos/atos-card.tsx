import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, PencilLine, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AtoCard {
    id: number;
    titulo: string;
    situacao: string;
    ementa: string;
}

export function AtosCard() {
    const [atos, setAtos] = useState<AtoCard[]>([]);
    const navigate = useNavigate();

    async function loadAtosCard() {
        const response = await fetch('http://10.96.5.67:5000/atos');
        const data = await response.json();
        setAtos(data);
    }

    useEffect(() => {
        loadAtosCard();
    }, []);

    const handleFichaClick = (ato: AtoCard) => {
        navigate(`/ficha/${ato.id}`, { state: { ato } });
    };

    return (
        <>
            {atos.map((ato) => (
                <Card key={ato.id}>
                    <CardHeader className="flex-row space-y-0 flex-items-center justify-between pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-base -tracking-tight font-medium text-blue-700 dark:text-blue-300">{ato.titulo}</CardTitle>
                            <CardDescription>{ato.situacao}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <span>
                            <p className="leading-7 [&:not(:first-child)]:mt-6">{ato.ementa}</p>
                        </span>
                    </CardContent>
                    <CardFooter className="flex justify-start gap-2">
                        <div className="flex flex-row items-center justify-center relative gap-2">
                            <Button variant="outline" size="xs" className="gap-2 text-amber-500 font-normal border-amber-500 hover:text-amber-600 dark:border-amber-300 dark:text-amber-300" onClick={() => handleFichaClick(ato)}>
                                <Eye className="h-3 w-3" />
                                Ficha
                                <span className="sr-only">Ficha do ato normativo</span>
                            </Button>
                            <Button variant="outline" size="xs" className="gap-2 text-amber-500 font-normal border-amber-500 hover:text-amber-600 dark:border-amber-300 dark:text-amber-300">
                                <SquareArrowOutUpRight className="h-3 w-3" />
                                Texto Integral
                                <span className="sr-only">Visualizar texto integral do ato normativo</span>
                            </Button>
                            <Button variant="default" size="xs" className="gap-2">
                                <PencilLine className="h-3 w-3" />
                                Editar
                                <span className="sr-only">Editar ato normativo</span>
                            </Button>
                            <Button variant="destructive" size="xs" className="gap-2">
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

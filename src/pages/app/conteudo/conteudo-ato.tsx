import { Helmet } from "react-helmet-async";
import { useLocation, Location, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface TextoIntegral {
    id: number;
    conteudo: string;
}

export function TextoIntegral() {
    const location = useLocation() as Location<{ ato?: TextoIntegral }>;
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [ato, setAto] = useState<TextoIntegral | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadTextoIntegral() {
            try {
                const atoId = location.state?.ato?.id ?? parseInt(id!, 10);

                if (!atoId) {
                    throw new Error("ID do ato não encontrado");
                }

                const response = await fetch(import.meta.env.VITE_API_URL + `/atos/${atoId}`);
                
                if (!response.ok) {
                    throw new Error(`Erro ao buscar o ato: ${response.status}`);
                }

                const data = await response.json();
                setAto(data);
            } catch (error) {
                setError((error as Error).message);
                navigate("/atos");

                toast({
                  title: "Erro ao carregar o ato",
                  description: "Não foi possível carregar o texto integral do ato selecionado.",
                  variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }
        loadTextoIntegral();
    }, [id, location.state?.ato?.id]);

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    if (error || !ato) {
        return <p>Erro ao carregar o texto integral.</p>;
    }

    return (
        <>
            <Helmet title="Texto Integral" />
            <div className="space-y-6 p-4">
                <Button variant={"ghost"} onClick={() => navigate(-1)}>
                    <ChevronLeft className=" mr-1 h-4 w-4" />
                    Voltar
                </Button>

                <style>{`
                    .jodit-table-style {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    .jodit-table-style th, .jodit-table-style td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                    .jodit-table-style th {
                        background-color: #f2f2f2;
                        text-align: left;
                    }
                    .jodit-table-style caption {
                        caption-side: bottom;
                        padding: 10px;
                        font-weight: bold;
                    }

                    /* Aplica a fonte Calibri e tamanho 12pt se não houver estilo definido */
                    .conteudo-ato *:not([style*="font-family"]):not([style*="font-size"]) {
                        font-family: Calibri, sans-serif !important;
                        font-size: 12pt !important;
                    }
                `}</style>

                <div className="flex flex-wrap items-center gap-2 p-2 conteudo-ato">
                    <div className="flex-1" dangerouslySetInnerHTML={{ __html: ato.conteudo }} />
                </div>
            </div>
        </>
    );
}

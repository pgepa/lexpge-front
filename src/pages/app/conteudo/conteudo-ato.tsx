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
                // Redireciona de volta para a página de atos em caso de erro
                navigate("/atos"); 

                // Mostra um toast de erro
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
    }, [id, location.state?.ato?.id]); // Dependência adicionada

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    if (error || !ato) { // Verifica se há erro ou se o ato não foi carregado
        return <p>Erro ao carregar o texto integral.</p>;
    }

    return (
        <>
            <Helmet title="Texto Integral" />
            <div className="space-y-6 p-4">
                <Button variant={"ghost"} onClick={() => navigate(-1)}> {/* Navegação de volta */}
                <ChevronLeft className=" mr-1 h-4 w-4" />  
                    Voltar
                </Button>

                <div className="flex flex-wrap items-center gap-2 p-2">
                 <div className="flex-1" dangerouslySetInnerHTML={{ __html: ato.conteudo }} />
                </div>
            </div>
        </>
    );
}

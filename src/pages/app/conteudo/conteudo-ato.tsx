import { Helmet } from "react-helmet-async";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import logo from '@/assets/logo.svg'

interface TextoIntegral {
    id: number;
    conteudo: string; // Usando 'conteudo' para armazenar o HTML
}

export function TextoIntegral() {
    const location = useLocation<{ ato?: TextoIntegral }>(); // Usando a interface correta
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate(); // Adiciona o hook useNavigate

    const [ato, setAto] = useState<TextoIntegral | null>(null); // Inicializa como null
    const [isLoading, setIsLoading] = useState<boolean>(true); // Renomeia a variável
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadTextoIntegral() {
            try {
                const atoId = location.state?.ato?.id ?? parseInt(id!, 10); // Obter o ID do ato

                if (!atoId) {
                    throw new Error("ID do ato não encontrado");
                }

                const response = await fetch(`http://10.96.20.14:4000/atos/${atoId}`);
                
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
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Voltar
                </Button>

                <div className="flex flex-col gap-1 items-center">
                    <img className="w-24 h-24" src={logo} alt="Logo" />
                    <h5 className="font-bold text-xs tracking-tight text-justify font-calibri" >GOVERNO DO ESTADO DO PARÁ</h5>
                </div>


                <div className="flex flex-wrap items-center gap-2 p-2">
                 <div className="flex-1" dangerouslySetInnerHTML={{ __html: ato.conteudo }} />
                </div>
            </div>
        </>
    );
}

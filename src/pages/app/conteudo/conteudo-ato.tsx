import { Helmet } from "react-helmet-async";
import { useLocation, Location, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import GridLoader from "react-spinners/GridLoader";
// Importe seu arquivo de estilos
import '../../../TipTapEditor/styles.css';

interface TextoIntegral {
  id: number;
  conteudo: string;
}

const ContentViewer = ({ content }: { content: string }) => {
  return (
    <div className="tiptap prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

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
          description: "Não foi possível carregar este ato normativo, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadTextoIntegral();
  }, [id, location.state?.ato?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <GridLoader size={16} color="#3727c9" />
      </div>
    );
  }

  if (error || !ato) {
    return (
      <p className='text-xl font-semibold text-muted-foreground'>
        Não foi possível carregar este ato normativo, tente novamente.
      </p>
    );
  }

  return (
    <>
      <Helmet title={`Ato Normativo ${id ? `| ${id}` : ''}`} />
      <div className="space-y-6 p-4">
        <div className="flex flex-wrap items-center gap-2 p-2">
          <ContentViewer content={ato.conteudo} />
        </div>
      </div>
    </>
  );
}
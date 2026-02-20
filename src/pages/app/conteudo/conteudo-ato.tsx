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


// Insere <br> dentro de <p> vazios e <p> vazios com text-align: center
const formatContent = (html: string) => {
  return html.replace(
    /<p(\s+style="text-align:\s*(?:center|justify)")?>\s*<\/p>/g,
    '<p$1><br></p>'
  );
};

// Aplica width, height, margin e display do atributo containerstyle (ImageResize) no style da img para a exibição respeitar tamanho e alinhamento
const normalizeImageDimensions = (html: string): string => {
  if (typeof document === 'undefined') return html;
  const div = document.createElement('div');
  div.innerHTML = html;
  const imgs = div.querySelectorAll<HTMLImageElement>('img[containerstyle]');
  imgs.forEach((img) => {
    const containerStyle = img.getAttribute('containerstyle');
    if (!containerStyle) return;
    const widthMatch = containerStyle.match(/width:\s*([0-9.]+)px/);
    const heightMatch = containerStyle.match(/height:\s*([0-9.]+)px/);
    const marginMatch = containerStyle.match(/margin:\s*([^;]+)/);
    const displayMatch = containerStyle.match(/display:\s*([^;]+)/);
    let style = img.getAttribute('style') || '';
    if (widthMatch) style = (style ? style.trimEnd() + '; ' : '') + `width: ${widthMatch[1]}px`;
    if (heightMatch) style = (style ? style.trimEnd() + '; ' : '') + `height: ${heightMatch[1]}px`;
    if (marginMatch) style = (style ? style.trimEnd() + '; ' : '') + `margin: ${marginMatch[1].trim()}`;
    if (displayMatch) style = (style ? style.trimEnd() + '; ' : '') + `display: ${displayMatch[1].trim()}`;
    if (style) img.setAttribute('style', style);
    img.removeAttribute('containerstyle');
  });
  return div.innerHTML;
};

const ContentViewer = ({ content }: { content: string }) => {
  const normalized = normalizeImageDimensions(formatContent(content));
  return (
    <div className="tiptap max-w-none conteudo-ato-viewer">
      <div dangerouslySetInnerHTML={{ __html: normalized }} />
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

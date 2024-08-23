import React, { useContext, useEffect, useState } from 'react';
import { SearchContext } from '@/Context/SearchContext';

interface AtosData {
  data_alteracao: string;
  data_ato: string;
  data_criacao: string;
  data_publicacao: string;
  descritores: string;
  ementa: string;
  fonte: string;
  id: string;
  numero: number;
  numero_formatado: string;
  observacao: string;
  relevancia: number;
  situacao: string;
  texto_compilado: boolean;
  tipo_id: string;
  titulo: string;
}

const ResultsList: React.FC = () => {
  const { query } = useContext(SearchContext)!;
  const [data, setData] = useState<AtosData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      const queryString = new URLSearchParams({
        conteudo: query.conteudo,
        descritores: query.descritores,
        numero: query.numero,
        ano: query.ano,
        tipo: query.tipo,
      }).toString();

      fetch(`http://10.96.20.14:4000/atos/busca?${queryString}`)
        .then(response => response.json())
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Erro ao buscar dados');
          setLoading(false);
        });
    }
  }, [query]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div>Nenhum resultado encontrado</div>;
  }

  return (
    <div>
      <h2>Resultados para a busca</h2>
      {data.map((ato) => (
        <div key={ato.id}>
          <h3>{ato.titulo}</h3>
          <p>Número: {ato.numero_formatado}</p>
          <p>Tipo: {ato.tipo_id}</p>
          <p>Data do Ato: {new Date(ato.data_ato).toLocaleDateString()}</p>
          <p>Data de Publicação: {new Date(ato.data_publicacao).toLocaleDateString()}</p>
          <p>Data de Criação: {new Date(ato.data_criacao).toLocaleDateString()}</p>
          <p>Data de Alteração: {new Date(ato.data_alteracao).toLocaleDateString()}</p>
          <p>Descritores: {ato.descritores}</p>
          <p>Ementa: {ato.ementa}</p>
          <p>Fonte: {ato.fonte}</p>
          <p>Observação: <span dangerouslySetInnerHTML={{ __html: ato.observacao }} /></p>
          <p>Situação: {ato.situacao}</p>
          <p>Relevância: {ato.relevancia}</p>
          <p>Texto Compilado: {ato.texto_compilado ? 'Sim' : 'Não'}</p>
        </div>
      ))}
    </div>
  );
};

export default ResultsList;

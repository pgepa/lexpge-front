import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { DatePicker } from '@/pages/app/Date/date';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/axios';
import {
  CalendarDays,
  Calendar,
  Search,
  X,
  RotateCw,
  Eye,
  SquareArrowOutUpRight,
  Building,
  AlertCircle,
  Clock,
  Check,
} from 'lucide-react';
import GridLoader from 'react-spinners/GridLoader';
import { format, subDays, startOfMonth } from 'date-fns';

interface AtoResenha {
  id: string;
  numero: number;
  numero_formatado: string;
  titulo: string;
  ementa: string;
  tipo_id: string;
  fonte: string;
  situacao: string;
  data_ato: string;
  data_publicacao: string;
  observacao?: string;
  descritores?: string;
  origem?: string | null;
}

interface DiaResenha {
  data: string;
  data_formatada: string;
  dia_semana: string;
  total: number;
  atos: AtoResenha[];
}

interface ResenhaData {
  total_atos: number;
  total_dias: number;
  data_inicio: string;
  data_fim: string;
  campo_data: string;
  ordem: string;
  dias: DiaResenha[];
}

function stripHtml(html?: string | null): string {
  if (!html) return '';
  let str = html;

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const tmp = document.createElement('div');
      tmp.innerHTML = str;
      let text = tmp.textContent || tmp.innerText || '';
      if (text.includes('<') && text.includes('>')) {
        tmp.innerHTML = text;
        text = tmp.textContent || tmp.innerText || '';
      }
      return text.replace(/\s+/g, ' ').trim();
    } catch {
      // Fallback para regex abaixo
    }
  }

  str = str.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&nbsp;/gi, ' ');
  str = str.replace(/<\/(p|div|li|tr|h[1-6])>/gi, ' ').replace(/<br\s*\/?>/gi, ' ');
  str = str.replace(/<[^>]+>/g, '');
  str = str.replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'");
  return str.replace(/\s+/g, ' ').trim();
}

function formatBrDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  const clean = dateStr.slice(0, 10);
  const parts = clean.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

function toIsoDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export const ResenhaPage: React.FC = () => {
  // Estado de filtros
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'7' | '15' | '30' | 'mes' | null>('7');
  const [dataInicio, setDataInicio] = useState<Date | undefined>(() => subDays(new Date(), 7));
  const [dataFim, setDataFim] = useState<Date | undefined>(() => new Date());
  const [campoData, setCampoData] = useState<'data_publicacao' | 'data_ato'>('data_publicacao');
  const [ordem, setOrdem] = useState<'desc' | 'asc'>('desc');
  const [tipo, setTipo] = useState<string>('todos');
  const [fonte, setFonte] = useState<string>('todas');
  const [origem, setOrigem] = useState<string>('');

  // Estado de dados e requisição
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resenha, setResenha] = useState<ResenhaData | null>(null);

  const carregarResenha = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: Record<string, string> = {
      campo_data: campoData,
      ordem: ordem,
      limite: '500',
    };

    if (dataInicio) {
      params.data_inicio = toIsoDate(dataInicio);
    }
    if (dataFim) {
      params.data_fim = toIsoDate(dataFim);
    }
    if (tipo && tipo !== 'todos') {
      params.tipo = tipo;
    }
    if (fonte && fonte !== 'todas') {
      params.fonte = fonte;
    }
    if (origem && origem.trim() !== '') {
      params.origem = origem.trim();
    }

    try {
      const response = await api.get('/atos/resenha', { params });
      setResenha(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar resenha:', err);
      setError(
        err.response?.data?.error ||
        'Não foi possível carregar a resenha de atos. Verifique os parâmetros e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }, [dataInicio, dataFim, campoData, ordem, tipo, fonte, origem]);

  // Carrega ao montar
  useEffect(() => {
    carregarResenha();
  }, []);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    carregarResenha();
  };

  const handleLimparFiltros = () => {
    setPeriodoSelecionado('7');
    setDataInicio(subDays(new Date(), 7));
    setDataFim(new Date());
    setCampoData('data_publicacao');
    setOrdem('desc');
    setTipo('todos');
    setFonte('todas');
    setOrigem('');
  };

  const setPreset = (diasAtras: number) => {
    setPeriodoSelecionado(String(diasAtras) as '7' | '15' | '30');
    setDataInicio(subDays(new Date(), diasAtras));
    setDataFim(new Date());
  };

  const setMesAtual = () => {
    setPeriodoSelecionado('mes');
    setDataInicio(startOfMonth(new Date()));
    setDataFim(new Date());
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
      <Helmet title="Resenha Diária de Atos Normativos - LEXPGE" />

      {/* Cabeçalho na Tela */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Resenha Diária de Atos Normativos
              </h1>
              <p className="text-sm text-muted-foreground">
                Consulte a linha do tempo cronológica dos atos oficiais publicados no DOE e DO-e/SEFA.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={carregarResenha}
            disabled={loading}
            className="gap-1.5"
            title="Recarregar resenha"
          >
            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Painel de Filtros e Parâmetros */}
      <Card className="print:hidden border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-3 pt-5 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold">
                Parâmetros da Resenha
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Defina o período desejado e os critérios de busca para listar as publicações organizadas dia a dia.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-0">
          <form onSubmit={handleBuscar} className="space-y-5">
            {/* Barra de Atalhos Rápidos */}
            <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 px-1">
                <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Período rápido:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant={periodoSelecionado === '7' ? 'default' : 'outline'}
                  size="xs"
                  className={`text-xs h-7 px-3 rounded-md transition-all ${
                    periodoSelecionado === '7'
                      ? 'bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => setPreset(7)}
                >
                  {periodoSelecionado === '7' && <Check className="h-3 w-3 mr-1" />}
                  Últimos 7 dias
                </Button>
                <Button
                  type="button"
                  variant={periodoSelecionado === '15' ? 'default' : 'outline'}
                  size="xs"
                  className={`text-xs h-7 px-3 rounded-md transition-all ${
                    periodoSelecionado === '15'
                      ? 'bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => setPreset(15)}
                >
                  {periodoSelecionado === '15' && <Check className="h-3 w-3 mr-1" />}
                  Últimos 15 dias
                </Button>
                <Button
                  type="button"
                  variant={periodoSelecionado === '30' ? 'default' : 'outline'}
                  size="xs"
                  className={`text-xs h-7 px-3 rounded-md transition-all ${
                    periodoSelecionado === '30'
                      ? 'bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => setPreset(30)}
                >
                  {periodoSelecionado === '30' && <Check className="h-3 w-3 mr-1" />}
                  Últimos 30 dias
                </Button>
                <Button
                  type="button"
                  variant={periodoSelecionado === 'mes' ? 'default' : 'outline'}
                  size="xs"
                  className={`text-xs h-7 px-3 rounded-md transition-all ${
                    periodoSelecionado === 'mes'
                      ? 'bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-700'
                  }`}
                  onClick={setMesAtual}
                >
                  {periodoSelecionado === 'mes' && <Check className="h-3 w-3 mr-1" />}
                  Mês Atual
                </Button>
              </div>
            </div>

            {/* Linha 1: Intervalo de Datas e Critérios de Ordenação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5 min-w-0">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Data Inicial:
                </Label>
                <DatePicker
                  date={dataInicio}
                  onChange={(d) => {
                    setPeriodoSelecionado(null);
                    setDataInicio(d);
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Data Final:
                </Label>
                <DatePicker
                  date={dataFim}
                  onChange={(d) => {
                    setPeriodoSelecionado(null);
                    setDataFim(d);
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Critério de Data:
                </Label>
                <Select
                  value={campoData}
                  onValueChange={(val: 'data_publicacao' | 'data_ato') => setCampoData(val)}
                >
                  <SelectTrigger className="w-full h-10 min-w-0">
                    <SelectValue placeholder="Selecione o critério" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data_publicacao">Publicação (Diário Oficial)</SelectItem>
                    <SelectItem value="data_ato">Assinatura do Ato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ordem Cronológica:
                </Label>
                <Select
                  value={ordem}
                  onValueChange={(val: 'desc' | 'asc') => setOrdem(val)}
                >
                  <SelectTrigger className="w-full h-10 min-w-0">
                    <SelectValue placeholder="Selecione a ordem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Mais recentes primeiro</SelectItem>
                    <SelectItem value="asc">Mais antigos primeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Linha 2: Filtros de Refinamento (Tipo, Diário, Origem) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5 min-w-0">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tipo de Ato:
                </Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger className="w-full h-10 min-w-0">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tipos</SelectItem>
                    <SelectItem value="Constituição Estadual">Constituição Estadual</SelectItem>
                    <SelectItem value="Decreto Legislativo">Decreto Legislativo</SelectItem>
                    <SelectItem value="Decreto Lei">Decreto Lei</SelectItem>
                    <SelectItem value="Decreto Numerado">Decreto Numerado</SelectItem>
                    <SelectItem value="Decreto Não Numerado">Decreto Não Numerado</SelectItem>
                    <SelectItem value="Emenda Constitucional">Emenda Constitucional</SelectItem>
                    <SelectItem value="Instrução Normativa">Instrução Normativa</SelectItem>
                    <SelectItem value="Lei Complementar">Lei Complementar</SelectItem>
                    <SelectItem value="Lei Ordinária">Lei Ordinária</SelectItem>
                    <SelectItem value="Mensagem do Governador">Mensagem do Governador</SelectItem>
                    <SelectItem value="Portaria">Portaria</SelectItem>
                    <SelectItem value="Portaria Conjunta">Portaria Conjunta</SelectItem>
                    <SelectItem value="Resolução">Resolução</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Diário Oficial:
                </Label>
                <Select value={fonte} onValueChange={setFonte}>
                  <SelectTrigger className="w-full h-10 min-w-0">
                    <SelectValue placeholder="Todos os diários" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos os diários</SelectItem>
                    <SelectItem value="DOE">DOE (Diário Oficial do Estado)</SelectItem>
                    <SelectItem value="DO-E/SEFA">DO-e/SEFA (Diário da SEFA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 min-w-0 sm:col-span-2 lg:col-span-1">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Origem / Secretaria:
                </Label>
                <Input
                  placeholder="Ex: SEDUC, SEFA, PGE, SESPA..."
                  value={origem}
                  onChange={(e) => setOrigem(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>

            {/* Linha de Ações */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={handleLimparFiltros}
                className="w-full sm:w-auto gap-2"
              >
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>

              <Button
                type="submit"
                size="default"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white gap-2 shadow-sm font-medium"
              >
                <Search className="h-4 w-4" />
                Consultar Resenha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Resumo de Resultados */}
      {resenha && !loading && (
        <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {Number(resenha.total_atos).toLocaleString('pt-BR')} ato{resenha.total_atos === 1 ? '' : 's'} normativo{resenha.total_atos === 1 ? '' : 's'}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-slate-600 dark:text-slate-400">
              Distribuídos em <strong className="text-slate-800 dark:text-slate-200">{resenha.total_dias} dia{resenha.total_dias === 1 ? '' : 's'}</strong> com publicações
            </span>
            {resenha.data_inicio && resenha.data_fim && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-slate-600 dark:text-slate-400">
                  Período: <strong>{formatBrDate(resenha.data_inicio)}</strong> a <strong>{formatBrDate(resenha.data_fim)}</strong>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Critério: {resenha.campo_data === 'data_publicacao' ? 'Data de Publicação (DOE)' : 'Data do Ato'}
            </span>
          </div>
        </div>
      )}

      {/* Estado de Carregamento */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <GridLoader color="#2563EB" size={14} />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Consultando publicações e montando a resenha diária...
          </p>
        </div>
      )}

      {/* Estado de Erro */}
      {error && !loading && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-red-800 dark:text-red-200">Falha ao consultar resenha</h4>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <Button
              variant="outline"
              size="xs"
              onClick={carregarResenha}
              className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {/* Estado Vazio */}
      {!loading && !error && resenha && resenha.dias.length === 0 && (
        <div className="text-center py-16 border rounded-lg bg-slate-50 dark:bg-slate-900/40 border-dashed space-y-3">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground/60" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Nenhum ato encontrado neste período
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Não foram registradas publicações oficiais com os filtros selecionados. Tente ampliar o intervalo de datas ou remover restrições de tipo e secretaria.
          </p>
          <Button variant="outline" size="sm" onClick={handleLimparFiltros} className="mt-2">
            Ver últimos 7 dias
          </Button>
        </div>
      )}

      {/* Timeline de Dias */}
      {!loading && !error && resenha && resenha.dias.length > 0 && (
        <div className="space-y-8">
          {resenha.dias.map((dia) => (
            <section
              key={dia.data}
              className="space-y-3 print:break-inside-avoid"
            >
              {/* Cabeçalho do Dia */}
              <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-l-4 border-blue-600 rounded-r-lg p-3.5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                        {dia.dia_semana}
                      </span>
                      <span className="text-slate-400 dark:text-slate-600">•</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                        {dia.data_formatada}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Publicado em: {formatBrDate(dia.data)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-600 text-white shadow-xs">
                    {dia.total} {dia.total === 1 ? 'ato' : 'atos'}
                  </span>
                </div>
              </div>

              {/* Lista de Atos do Dia */}
              <div className="grid grid-cols-1 gap-3.5 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-800 ml-3">
                {dia.atos.map((ato) => (
                  <Card
                    key={ato.id}
                    className="shadow-sm hover:shadow-md transition-shadow duration-200 border-slate-200 dark:border-slate-800"
                  >
                    <CardHeader className="pb-2 pt-4 px-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-1.5 flex-1">
                          <CardTitle className="text-base font-semibold text-blue-700 dark:text-blue-400">
                            {ato.titulo}
                          </CardTitle>

                          {/* Badges de Metadados: Fonte, Origem, Situação, Tipo */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Tipo */}
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {ato.tipo_id}
                            </span>

                            {/* Situação */}
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-md border ${
                                ato.situacao === 'Vigente'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                              }`}
                            >
                              {ato.situacao}
                            </span>

                            {/* Diário Oficial (Fonte) */}
                            {ato.fonte && (
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                                  ato.fonte === 'DO-E/SEFA'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                                    : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                                }`}
                              >
                                {ato.fonte}
                              </span>
                            )}

                            {/* Origem / Secretaria */}
                            {ato.origem && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800 flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {ato.origem}
                              </span>
                            )}

                            {/* Data do Ato */}
                            {ato.data_ato && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1 ml-1">
                                <Clock className="h-3 w-3" />
                                Assinado em: {formatBrDate(ato.data_ato)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-5 py-2">
                      <p
                        style={{ textAlign: 'justify' }}
                        className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal"
                      >
                        {stripHtml(ato.ementa)}
                      </p>

                      {ato.observacao && stripHtml(ato.observacao) && (
                        <div className="mt-2 text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-md border border-slate-200 dark:border-slate-800 whitespace-pre-line">
                          <strong className="text-slate-700 dark:text-slate-300">Observação:</strong> {stripHtml(ato.observacao)}
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="px-5 pt-2 pb-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Publicado em: <strong>{formatBrDate(ato.data_publicacao)}</strong>
                      </span>

                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          variant="outline"
                          size="xs"
                          className="gap-1.5 border-amber-500 font-medium text-amber-600 hover:text-amber-700 dark:border-amber-400 dark:text-amber-300"
                          onClick={() => window.open(`/#/ficha/${ato.id}`, '_blank')}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Ficha do Ato
                        </Button>

                        <Button
                          variant="outline"
                          size="xs"
                          className="gap-1.5 border-blue-600 font-medium text-blue-600 hover:text-blue-700 dark:border-blue-400 dark:text-blue-300"
                          onClick={() => window.open(`/#/texto-integral/${ato.id}`, '_blank')}
                        >
                          <SquareArrowOutUpRight className="h-3.5 w-3.5" />
                          Texto Integral
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResenhaPage;

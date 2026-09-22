import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DatePicker } from "@/pages/app/Date/date";
import {
  Users,
  FilePlus2,
  FileEdit,
  Activity,
  Award,
  Search,
  Download,
  RotateCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  BookOpen,
  FileText,
  BadgeAlert,
  Clock,
  ArrowUpDown,
  Tag,
  Check
} from "lucide-react";
import GridLoader from "react-spinners/GridLoader";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface TipoBreakdown {
  tipo: string;
  total: number;
}

interface UsuarioProdutividade {
  id: number;
  nome: string;
  email: string;
  id_perfil: number;
  perfil: string;
  ativo: boolean;
  total_criados: number;
  total_editados: number;
  total_excluidos: number;
  total_acoes: number;
  ultima_acao: string | null;
  tipos: TipoBreakdown[];
}

interface ResumoProdutividade {
  total_criados: number;
  total_editados: number;
  total_excluidos: number;
  total_acoes: number;
  total_usuarios: number;
  servidor_destaque: {
    id: number;
    nome: string;
    perfil: string;
    total_acoes: number;
  } | null;
  data_inicio?: string | null;
  data_fim?: string | null;
}

interface DetalheItem {
  id_auditoria: number;
  id_ato: number | null;
  acao: string;
  data_acao: string;
  data_acao_iso: string;
  numero_formatado: string;
  titulo: string;
  tipo_id: string;
  fonte: string;
  origem: string;
  ementa: string;
  situacao: string;
}

interface DetalhesResponse {
  usuario: {
    id: number;
    nome: string;
    email: string;
    perfil: string;
  };
  paginacao: {
    pagina: number;
    limite: number;
    total_itens: number;
    total_paginas: number;
  };
  itens: DetalheItem[];
}

export function TeamProductivity() {
  // Filtros principais
  const [presetSelecionado, setPresetSelecionado] = useState<'este_mes' | 'mes_anterior' | 'ultimos_30' | 'ano_atual' | 'tudo' | null>('este_mes');
  const [dataInicio, setDataInicio] = useState<Date | undefined>(startOfMonth(new Date()));
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date());
  const [filtroPerfil, setFiltroPerfil] = useState<string>("todos");
  const [buscaNome, setBuscaNome] = useState<string>("");

  // Estado dos dados da equipe
  const [resumo, setResumo] = useState<ResumoProdutividade | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioProdutividade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal de Detalhes do Usuário
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioProdutividade | null>(null);
  const [detalhesModalAberto, setDetalhesModalAberto] = useState<boolean>(false);
  const [tipoAcaoDetalhes, setTipoAcaoDetalhes] = useState<string>("todos");
  const [paginaDetalhes, setPaginaDetalhes] = useState<number>(1);
  const [detalhesData, setDetalhesData] = useState<DetalhesResponse | null>(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState<boolean>(false);

  // Ordenação da tabela de produtividade
  const [ordenacao, setOrdenacao] = useState<'total' | 'criados' | 'editados' | 'nome'>('total');
  const [ordemDesc, setOrdemDesc] = useState<boolean>(true);

  // Presets de data
  const aplicarPreset = (tipo: 'este_mes' | 'mes_anterior' | 'ultimos_30' | 'ano_atual' | 'tudo') => {
    setPresetSelecionado(tipo);
    const hoje = new Date();
    if (tipo === 'este_mes') {
      setDataInicio(startOfMonth(hoje));
      setDataFim(hoje);
    } else if (tipo === 'mes_anterior') {
      const mesPassado = subMonths(hoje, 1);
      setDataInicio(startOfMonth(mesPassado));
      setDataFim(endOfMonth(mesPassado));
    } else if (tipo === 'ultimos_30') {
      setDataInicio(subDays(hoje, 30));
      setDataFim(hoje);
    } else if (tipo === 'ano_atual') {
      setDataInicio(new Date(hoje.getFullYear(), 0, 1));
      setDataFim(hoje);
    } else if (tipo === 'tudo') {
      setDataInicio(undefined);
      setDataFim(undefined);
    }
  };

  // Carregar dados de produtividade
  const carregarProdutividade = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const params = new URLSearchParams();
      if (dataInicio) {
        params.append('data_inicio', format(dataInicio, 'yyyy-MM-dd'));
      }
      if (dataFim) {
        params.append('data_fim', format(dataFim, 'yyyy-MM-dd'));
      }
      if (filtroPerfil && filtroPerfil !== 'todos') {
        params.append('id_perfil', filtroPerfil);
      }

      const res = await api.get<{ resumo: ResumoProdutividade; usuarios: UsuarioProdutividade[] }>(
        `/dashboard/produtividade?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResumo(res.data.resumo);
      setUsuarios(res.data.usuarios);
    } catch (err: any) {
      console.error("Erro ao carregar produtividade:", err);
      const msg = err.response?.data?.error || "Erro ao carregar dados de produtividade da equipe.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }, [dataInicio, dataFim, filtroPerfil]);

  useEffect(() => {
    carregarProdutividade();
  }, [carregarProdutividade]);

  // Carregar detalhes quando modal abre ou troca de página/filtro de ação
  const carregarDetalhes = useCallback(async (usuarioId: number, page: number, acao: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoadingDetalhes(true);
      const params = new URLSearchParams();
      params.append('id_usuario', String(usuarioId));
      params.append('pagina', String(page));
      params.append('limite', '8');
      if (acao && acao !== 'todos') {
        params.append('tipo_acao', acao);
      }
      if (dataInicio) {
        params.append('data_inicio', format(dataInicio, 'yyyy-MM-dd'));
      }
      if (dataFim) {
        params.append('data_fim', format(dataFim, 'yyyy-MM-dd'));
      }

      const res = await api.get<DetalhesResponse>(
        `/dashboard/produtividade/detalhes?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDetalhesData(res.data);
    } catch (err) {
      console.error("Erro ao buscar detalhes de atos do usuário:", err);
    } finally {
      setLoadingDetalhes(false);
    }
  }, [dataInicio, dataFim]);

  const abrirDetalhes = (u: UsuarioProdutividade) => {
    setUsuarioSelecionado(u);
    setPaginaDetalhes(1);
    setTipoAcaoDetalhes("todos");
    setDetalhesModalAberto(true);
    carregarDetalhes(u.id, 1, "todos");
  };

  const mudarFiltroAcaoDetalhes = (novaAcao: string) => {
    setTipoAcaoDetalhes(novaAcao);
    setPaginaDetalhes(1);
    if (usuarioSelecionado) {
      carregarDetalhes(usuarioSelecionado.id, 1, novaAcao);
    }
  };

  const mudarPaginaDetalhes = (novaPagina: number) => {
    setPaginaDetalhes(novaPagina);
    if (usuarioSelecionado) {
      carregarDetalhes(usuarioSelecionado.id, novaPagina, tipoAcaoDetalhes);
    }
  };

  // Filtragem e ordenação local da lista de usuários
  const usuariosFiltrados = useMemo(() => {
    let lista = [...usuarios];

    if (buscaNome.trim()) {
      const q = buscaNome.toLowerCase().trim();
      lista = lista.filter(
        (u) =>
          u.nome.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.perfil.toLowerCase().includes(q)
      );
    }

    lista.sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      if (ordenacao === 'total') {
        valA = a.total_acoes;
        valB = b.total_acoes;
      } else if (ordenacao === 'criados') {
        valA = a.total_criados;
        valB = b.total_criados;
      } else if (ordenacao === 'editados') {
        valA = a.total_editados;
        valB = b.total_editados;
      } else if (ordenacao === 'nome') {
        return ordemDesc ? b.nome.localeCompare(a.nome) : a.nome.localeCompare(b.nome);
      }

      return ordemDesc ? valB - valA : valA - valB;
    });

    return lista;
  }, [usuarios, buscaNome, ordenacao, ordemDesc]);

  // Exportação para CSV / Excel
  const exportarCSV = () => {
    if (!usuariosFiltrados.length) return;

    const headers = [
      "Nome",
      "Email",
      "Perfil",
      "Status",
      "Atos Cadastrados",
      "Atos Editados/Revisados",
      "Total de Acoes",
      "Ultima Atividade",
      "Distribuicao por Tipo"
    ];

    const rows = usuariosFiltrados.map((u) => {
      const tiposStr = u.tipos && u.tipos.length > 0
        ? u.tipos.map((t) => `${t.tipo}: ${t.total}`).join(" | ")
        : "Nenhum";

      return [
        `"${u.nome.replace(/"/g, '""')}"`,
        `"${u.email}"`,
        `"${u.perfil}"`,
        `"${u.ativo ? "Ativo" : "Inativo"}"`,
        u.total_criados,
        u.total_editados,
        u.total_acoes,
        `"${u.ultima_acao || "-"}"`,
        `"${tiposStr.replace(/"/g, '""')}"`
      ].join(";");
    });

    // UTF-8 BOM (\uFEFF) para abrir no Excel em português sem quebrar acentuação
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const periodoStr = dataInicio && dataFim
      ? `${format(dataInicio, 'ddMMyyyy')}_a_${format(dataFim, 'ddMMyyyy')}`
      : "periodo-completo";
    link.href = url;
    link.setAttribute("download", `relatorio_produtividade_lexpge_${periodoStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const alternarOrdenacao = (coluna: 'total' | 'criados' | 'editados' | 'nome') => {
    if (ordenacao === coluna) {
      setOrdemDesc(!ordemDesc);
    } else {
      setOrdenacao(coluna);
      setOrdemDesc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros e Atalhos Rápidos */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-3 pt-5 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Filtros do Relatório de Produtividade
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Filtre por período de atividade, perfil de usuário ou busque por servidor específico.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={carregarProdutividade}
                disabled={loading}
                className="gap-1.5 h-9"
              >
                <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={exportarCSV}
                disabled={loading || usuariosFiltrados.length === 0}
                className="gap-1.5 h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
                title="Exportar dados para planilha Excel (.csv)"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-0 space-y-4">
          {/* Atalhos de Período */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 px-1">
              <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Período rápido:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                type="button"
                variant={presetSelecionado === 'este_mes' ? 'default' : 'outline'}
                size="xs"
                className={`text-xs h-7 px-3 rounded-md transition-all ${
                  presetSelecionado === 'este_mes'
                    ? 'bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-700'
                }`}
                onClick={() => aplicarPreset('este_mes')}
              >
                {presetSelecionado === 'este_mes' && <Check className="h-3 w-3 mr-1" />}
                Este Mês
              </Button>
              <Button
                type="button"
                variant={presetSelecionado === 'mes_anterior' ? 'default' : 'outline'}
                size="xs"
                className={`text-xs h-7 px-3 rounded-md transition-all ${
                  presetSelecionado === 'mes_anterior'
                    ? 'bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-700'
                }`}
                onClick={() => aplicarPreset('mes_anterior')}
              >
                {presetSelecionado === 'mes_anterior' && <Check className="h-3 w-3 mr-1" />}
                Mês Anterior
              </Button>
              <Button
                type="button"
                variant={presetSelecionado === 'ultimos_30' ? 'default' : 'outline'}
                size="xs"
                className={`text-xs h-7 px-3 rounded-md transition-all ${
                  presetSelecionado === 'ultimos_30'
                    ? 'bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-700'
                }`}
                onClick={() => aplicarPreset('ultimos_30')}
              >
                {presetSelecionado === 'ultimos_30' && <Check className="h-3 w-3 mr-1" />}
                Últimos 30 dias
              </Button>
              <Button
                type="button"
                variant={presetSelecionado === 'ano_atual' ? 'default' : 'outline'}
                size="xs"
                className={`text-xs h-7 px-3 rounded-md transition-all ${
                  presetSelecionado === 'ano_atual'
                    ? 'bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-700'
                }`}
                onClick={() => aplicarPreset('ano_atual')}
              >
                {presetSelecionado === 'ano_atual' && <Check className="h-3 w-3 mr-1" />}
                Ano Atual
              </Button>
              <Button
                type="button"
                variant={presetSelecionado === 'tudo' ? 'default' : 'outline'}
                size="xs"
                className={`text-xs h-7 px-3 rounded-md transition-all ${
                  presetSelecionado === 'tudo'
                    ? 'bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-700'
                }`}
                onClick={() => aplicarPreset('tudo')}
              >
                {presetSelecionado === 'tudo' && <Check className="h-3 w-3 mr-1" />}
                Histórico Completo
              </Button>
            </div>
          </div>

          {/* Grid de Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Data Inicial:
              </Label>
              <DatePicker
                date={dataInicio}
                onChange={(d) => {
                  setPresetSelecionado(null);
                  setDataInicio(d);
                }}
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Data Final:
              </Label>
              <DatePicker
                date={dataFim}
                onChange={(d) => {
                  setPresetSelecionado(null);
                  setDataFim(d);
                }}
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Filtrar por Perfil:
              </Label>
              <Select value={filtroPerfil} onValueChange={setFiltroPerfil}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Todos os Perfis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Perfis</SelectItem>
                  <SelectItem value="3">Estagiários (Perfil 3)</SelectItem>
                  <SelectItem value="1">Administradores (Perfil 1)</SelectItem>
                  <SelectItem value="2">Chefias (Perfil 2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Buscar Servidor:
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome, email ou perfil..."
                  value={buscaNome}
                  onChange={(e) => setBuscaNome(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensagem de Erro se houver */}
      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-950 dark:border-red-900 dark:text-red-300 flex items-center gap-3">
          <BadgeAlert className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      {/* Cards de Resumo / KPIs do Período */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Atos Cadastrados */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Atos Cadastrados
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <FilePlus2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {loading ? "..." : (resumo?.total_criados ?? 0).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Novos atos inseridos na base no período
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Atos Editados / Revisados */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Atos Revisados / Editados
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <FileEdit className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {loading ? "..." : (resumo?.total_editados ?? 0).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Atualizações, correções e indexações
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Total Geral de Ações */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Volume Total de Ações
            </CardTitle>
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {loading ? "..." : (resumo?.total_acoes ?? 0).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de intervenções registradas em auditoria
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Servidor em Destaque */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Maior Produção
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate" title={resumo?.servidor_destaque?.nome || "Sem atividades"}>
              {loading ? "..." : (resumo?.servidor_destaque?.nome || "Sem atividades")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {resumo?.servidor_destaque
                ? `${resumo.servidor_destaque.total_acoes} ações (${resumo.servidor_destaque.perfil})`
                : "Nenhuma ação no período"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Produtividade da Equipe */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Desempenho por Servidor / Estagiário
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Exibindo {usuariosFiltrados.length} colaboradores com registro no sistema.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <GridLoader color="#2563eb" size={10} />
              <p className="text-xs text-muted-foreground">Consolidando dados da equipe...</p>
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm">
              Nenhum colaborador encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => alternarOrdenacao('nome')}
                    >
                      <div className="flex items-center gap-1.5">
                        Servidor
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead
                      className="text-right cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => alternarOrdenacao('criados')}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        Cadastros
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-right cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => alternarOrdenacao('editados')}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        Edições/Revisões
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-right cursor-pointer hover:text-blue-600 transition-colors font-bold"
                      onClick={() => alternarOrdenacao('total')}
                    >
                      <div className="flex items-center justify-end gap-1.5 text-blue-600 dark:text-blue-400">
                        Total Ações
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Tipos Mais Frequentes</TableHead>
                    <TableHead className="text-center">Última Ação</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuariosFiltrados.map((u) => {
                    const initials = u.nome
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((n) => n[0].toUpperCase())
                      .join("");

                    let badgeColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
                    if (u.id_perfil === 1) {
                      badgeColor = "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
                    } else if (u.id_perfil === 2) {
                      badgeColor = "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
                    } else if (u.id_perfil === 3) {
                      badgeColor = "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
                    }

                    return (
                      <TableRow key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                        {/* Servidor */}
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 flex-shrink-0">
                              {initials || "U"}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {u.nome}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Perfil */}
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                            {u.perfil}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs ${
                              u.ativo ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                u.ativo ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            />
                            {u.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>

                        {/* Cadastros */}
                        <TableCell className="text-right">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            {u.total_criados}
                          </span>
                        </TableCell>

                        {/* Edições */}
                        <TableCell className="text-right">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                            {u.total_editados}
                          </span>
                        </TableCell>

                        {/* Total de Ações */}
                        <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100">
                          {u.total_acoes}
                        </TableCell>

                        {/* Tipos Mais Frequentes */}
                        <TableCell className="max-w-xs">
                          {u.tipos && u.tipos.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {u.tipos.slice(0, 3).map((t, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                  <Tag className="h-2.5 w-2.5 text-muted-foreground" />
                                  {t.tipo}: <span className="font-semibold">{t.total}</span>
                                </span>
                              ))}
                              {u.tipos.length > 3 && (
                                <span className="text-[10px] text-muted-foreground self-center">
                                  +{u.tipos.length - 3} outros
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>

                        {/* Última Ação */}
                        <TableCell className="text-center text-xs text-muted-foreground">
                          {u.ultima_acao ? u.ultima_acao.slice(0, 16) : "-"}
                        </TableCell>

                        {/* Ações */}
                        <TableCell className="text-right pr-6">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => abrirDetalhes(u)}
                            className="text-xs gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Ver Atos
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal / Dialog de Detalhamento dos Atos do Usuário */}
      <Dialog open={detalhesModalAberto} onOpenChange={setDetalhesModalAberto}>
        <DialogContent className="max-w-4xl max-h-[88vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Atos Trabalhados: {usuarioSelecionado?.nome}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {usuarioSelecionado?.email} • {usuarioSelecionado?.perfil} • Total no período: {detalhesData?.paginacao.total_itens ?? usuarioSelecionado?.total_acoes} ações
                </DialogDescription>
              </div>

              {/* Filtro por tipo de ação no modal */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-md border text-xs">
                <button
                  type="button"
                  onClick={() => mudarFiltroAcaoDetalhes("todos")}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    tipoAcaoDetalhes === "todos"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => mudarFiltroAcaoDetalhes("criacao")}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    tipoAcaoDetalhes === "criacao"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Cadastros
                </button>
                <button
                  type="button"
                  onClick={() => mudarFiltroAcaoDetalhes("edicao")}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    tipoAcaoDetalhes === "edicao"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Edições
                </button>
              </div>
            </div>
          </DialogHeader>

          {/* Conteúdo com rolagem da lista de atos */}
          <div className="flex-1 overflow-y-auto p-6">
            {loadingDetalhes ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <GridLoader color="#2563eb" size={10} />
                <p className="text-xs text-muted-foreground">Buscando histórico do servidor...</p>
              </div>
            ) : !detalhesData || detalhesData.itens.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm">
                Nenhum ato encontrado para este filtro de ação no período selecionado.
              </div>
            ) : (
              <div className="space-y-3">
                {detalhesData.itens.map((item) => (
                  <div
                    key={item.id_auditoria}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            item.acao === "Criação"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          }`}
                        >
                          {item.acao}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {item.tipo_id} Nº {item.numero_formatado}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          • {item.data_acao}
                        </span>
                      </div>

                      {/* Botões de atalho: Ficha e Texto Integral */}
                      {item.id_ato && (
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <Button
                            variant="outline"
                            size="xs"
                            asChild
                            className="text-[11px] h-7 px-2.5 gap-1 text-slate-700 dark:text-slate-200"
                          >
                            <a
                              href={`/#/ficha/${item.id_ato}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Abrir Ficha do Ato em nova aba"
                            >
                              <BookOpen className="h-3 w-3 text-blue-600" />
                              Ficha
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            asChild
                            className="text-[11px] h-7 px-2.5 gap-1 text-slate-700 dark:text-slate-200"
                          >
                            <a
                              href={`/#/texto-integral/${item.id_ato}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Abrir Texto Integral do Ato em nova aba"
                            >
                              <FileText className="h-3 w-3 text-emerald-600" />
                              Texto
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-xs font-medium text-slate-800 dark:text-slate-200">
                      {item.titulo}
                    </div>

                    {item.ementa && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {item.ementa}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1 border-t border-slate-100 dark:border-slate-800">
                      {item.fonte && item.fonte !== '-' && (
                        <span>
                          <strong className="text-slate-600 dark:text-slate-400">Fonte:</strong> {item.fonte}
                        </span>
                      )}
                      {item.origem && item.origem !== '-' && (
                        <span>
                          <strong className="text-slate-600 dark:text-slate-400">Origem:</strong> {item.origem}
                        </span>
                      )}
                      {item.situacao && item.situacao !== '-' && (
                        <span>
                          <strong className="text-slate-600 dark:text-slate-400">Situação:</strong> {item.situacao}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rodapé do Modal com Paginação */}
          {detalhesData && detalhesData.paginacao.total_paginas > 1 && (
            <div className="p-3 border-t bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs px-6">
              <span className="text-muted-foreground">
                Página {detalhesData.paginacao.pagina} de {detalhesData.paginacao.total_paginas} ({detalhesData.paginacao.total_itens} registros)
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="xs"
                  disabled={paginaDetalhes <= 1 || loadingDetalhes}
                  onClick={() => mudarPaginaDetalhes(paginaDetalhes - 1)}
                  className="gap-1 h-7"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  disabled={paginaDetalhes >= detalhesData.paginacao.total_paginas || loadingDetalhes}
                  onClick={() => mudarPaginaDetalhes(paginaDetalhes + 1)}
                  className="gap-1 h-7"
                >
                  Próxima
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

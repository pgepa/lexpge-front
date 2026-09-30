import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Calendar as CalendarIcon,
  CheckCircle2,
  Loader2,
  Layers,
  Users,
  Filter,
  FileCheck,
  UserCheck
} from "lucide-react";
import { toast } from "react-toastify";
import { jsPDF } from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { BRASAO_PARA_BASE64 } from '@/assets/brasaoParaBase64';

// Registrar o plugin autotable no construtor jsPDF
try {
  if (typeof applyPlugin === 'function') {
    applyPlugin(jsPDF);
  }
} catch (e) {
  console.warn("Falha ao registrar plugin autoTable no jsPDF:", e);
}

// Helper robusto para instanciar jsPDF em qualquer ambiente (ESM/CJS/Vite)
const createPDFDoc = (options: any) => {
  // @ts-ignore
  const PDFConstructor = typeof jsPDF === 'function' ? jsPDF : (jsPDF as any).jsPDF || (window as any).jspdf?.jsPDF;
  return new PDFConstructor(options);
};

// Helper robusto para invocar autoTable
const applyAutoTable = (doc: any, options: any) => {
  if (typeof doc.autoTable === 'function') {
    doc.autoTable(options);
    return;
  }
  if (typeof autoTable === 'function') {
    autoTable(doc, options);
    return;
  }
  if ((autoTable as any).default && typeof (autoTable as any).default === 'function') {
    (autoTable as any).default(doc, options);
    return;
  }
  throw new Error("Módulo autoTable não disponível para geração de tabelas no PDF.");
};

// Helper universal e seguro para download do arquivo PDF no navegador
const salvarArquivoPDF = (doc: any, nomeArquivo: string) => {
  try {
    doc.save(nomeArquivo);
  } catch (errSave) {
    console.warn("doc.save falhou, usando download com Blob:", errSave);
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Helper universal e seguro para download do arquivo XLSX no navegador
const salvarArquivoXLSX = (wb: any, nomeArquivo: string) => {
  try {
    XLSX.writeFile(wb, nomeArquivo);
  } catch (errWrite) {
    console.warn("XLSX.writeFile falhou, usando download com Blob:", errWrite);
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

const TODOS_TIPOS_ATOS = [
  'Portaria',
  'Decreto Numerado',
  'Resolução',
  'Decreto Não Numerado',
  'Lei Ordinária',
  'Instrução Normativa',
  'Mensagem do Governador',
  'Portaria Conjunta',
  'Lei Complementar',
  'Constituição Estadual',
  'Decreto Legislativo',
  'Decreto Lei',
  'Emenda Constitucional',
];

const MESES = [
  { valor: '01', nome: 'Janeiro' },
  { valor: '02', nome: 'Fevereiro' },
  { valor: '03', nome: 'Março' },
  { valor: '04', nome: 'Abril' },
  { valor: '05', nome: 'Maio' },
  { valor: '06', nome: 'Junho' },
  { valor: '07', nome: 'Julho' },
  { valor: '08', nome: 'Agosto' },
  { valor: '09', nome: 'Setembro' },
  { valor: '10', nome: 'Outubro' },
  { valor: '11', nome: 'Novembro' },
  { valor: '12', nome: 'Dezembro' },
];

const ANOS = ['2027', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];

interface UsuarioEquipeExport {
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
  total_criados: number;
  total_editados: number;
  total_acoes: number;
  ultima_acao: string | null;
  tipos?: { tipo: string; total: number }[];
}

interface ExportReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuariosEquipe?: UsuarioEquipeExport[];
  periodoEquipeLabel?: string;
}

export function ExportReportModal({
  open,
  onOpenChange,
  usuariosEquipe = [],
  periodoEquipeLabel: _periodoEquipeLabel = "Período Geral",
}: ExportReportModalProps) {
  const hoje = new Date();
  const mesAtualStr = String(hoje.getMonth() + 1).padStart(2, '0');
  const anoAtualStr = String(hoje.getFullYear());

  // Tipo de relatório
  const [tipoRelatorio, setTipoRelatorio] = useState<'atos_submetidos' | 'produtividade_equipe'>('atos_submetidos');

  // Filtro de especificação de perfil de usuário
  const [perfilSelecionado, setPerfilSelecionado] = useState<string>('todos');

  // Modo de período para atos submetidos
  const [modoPeriodo, setModoPeriodo] = useState<'mes_unico' | 'intervalo'>('mes_unico');
  const [mesInicio, setMesInicio] = useState<string>(mesAtualStr);
  const [anoInicio, setAnoInicio] = useState<string>(anoAtualStr);
  const [mesFim, setMesFim] = useState<string>(mesAtualStr);
  const [anoFim, setAnoFim] = useState<string>(anoAtualStr);
  // Modo de período próprio para Produtividade da Equipe
  const [modoPeriodoEquipe, setModoPeriodoEquipe] = useState<'mes_unico' | 'intervalo'>('mes_unico');
  const [mesInicioEquipe, setMesInicioEquipe] = useState<string>(mesAtualStr);
  const [anoInicioEquipe, setAnoInicioEquipe] = useState<string>(anoAtualStr);
  const [mesFimEquipe, setMesFimEquipe] = useState<string>(mesAtualStr);
  const [anoFimEquipe, setAnoFimEquipe] = useState<string>(anoAtualStr);
  const [usuariosEquipePeriodo, setUsuariosEquipePeriodo] = useState<UsuarioEquipeExport[]>(usuariosEquipe);
  const [carregandoPreviewEquipe, setCarregandoPreviewEquipe] = useState<boolean>(false);

  // Helper para rótulo formatado do período de equipe
  const getPeriodoEquipeCalculado = useCallback(() => {
    if (modoPeriodoEquipe === 'mes_unico') {
      const mesNome = MESES.find((m) => m.valor === mesInicioEquipe)?.nome || mesInicioEquipe;
      return `${mesNome} de ${anoInicioEquipe}`;
    }
    const mesIniNome = MESES.find((m) => m.valor === mesInicioEquipe)?.nome || mesInicioEquipe;
    const mesFimNome = MESES.find((m) => m.valor === mesFimEquipe)?.nome || mesFimEquipe;
    return `${mesIniNome}/${anoInicioEquipe} a ${mesFimNome}/${anoFimEquipe}`;
  }, [modoPeriodoEquipe, mesInicioEquipe, anoInicioEquipe, mesFimEquipe, anoFimEquipe]);

  // Helper para datas no formato YYYY-MM-DD para requisição de produtividade da equipe
  const getDatasEquipeCalculadas = useCallback(() => {
    let dataInicioStr: string;
    let dataFimStr: string;

    if (modoPeriodoEquipe === 'mes_unico') {
      const ano = parseInt(anoInicioEquipe, 10);
      const mes = parseInt(mesInicioEquipe, 10);
      const ultimoDia = new Date(ano, mes, 0).getDate();
      dataInicioStr = `${anoInicioEquipe}-${mesInicioEquipe}-01`;
      dataFimStr = `${anoInicioEquipe}-${mesInicioEquipe}-${String(ultimoDia).padStart(2, '0')}`;
    } else {
      const anoF = parseInt(anoFimEquipe, 10);
      const mesF = parseInt(mesFimEquipe, 10);
      const ultimoDiaF = new Date(anoF, mesF, 0).getDate();
      dataInicioStr = `${anoInicioEquipe}-${mesInicioEquipe}-01`;
      dataFimStr = `${anoFimEquipe}-${mesFimEquipe}-${String(ultimoDiaF).padStart(2, '0')}`;
    }

    return { dataInicioStr, dataFimStr, label: getPeriodoEquipeCalculado() };
  }, [modoPeriodoEquipe, mesInicioEquipe, anoInicioEquipe, mesFimEquipe, anoFimEquipe, getPeriodoEquipeCalculado]);

  // Carregar prévia de colaboradores em tempo real quando o período próprio de equipe for alterado
  useEffect(() => {
    if (!open || tipoRelatorio !== 'produtividade_equipe') return;

    let cancelado = false;
    const carregarPreviewEquipe = async () => {
      setCarregandoPreviewEquipe(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { dataInicioStr, dataFimStr } = getDatasEquipeCalculadas();
        const res = await api.get('/dashboard/produtividade', {
          headers: { Authorization: `Bearer ${token}` },
          params: { data_inicio: dataInicioStr, data_fim: dataFimStr },
        });

        if (!cancelado) {
          setUsuariosEquipePeriodo(res.data.usuarios || []);
        }
      } catch (err) {
        console.error("Erro ao carregar prévia de equipe:", err);
      } finally {
        if (!cancelado) {
          setCarregandoPreviewEquipe(false);
        }
      }
    };

    carregarPreviewEquipe();
    return () => {
      cancelado = true;
    };
  }, [open, tipoRelatorio, getDatasEquipeCalculadas]);

  // Tipos de atos selecionados
  const [todosTiposSelecionados, setTodosTiposSelecionados] = useState<boolean>(true);
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>(TODOS_TIPOS_ATOS);

  // Formato de exportação
  const [formato, setFormato] = useState<'pdf' | 'xlsx'>('pdf');
  const [carregando, setCarregando] = useState<boolean>(false);

  // Manipulação de tipos
  const toggleTodosTipos = (checked: boolean) => {
    setTodosTiposSelecionados(checked);
    if (checked) {
      setTiposSelecionados(TODOS_TIPOS_ATOS);
    } else {
      setTiposSelecionados([]);
    }
  };

  const toggleTipo = (tipo: string) => {
    let novosTipos: string[];
    if (tiposSelecionados.includes(tipo)) {
      novosTipos = tiposSelecionados.filter((t) => t !== tipo);
    } else {
      novosTipos = [...tiposSelecionados, tipo];
    }
    setTiposSelecionados(novosTipos);
    setTodosTiposSelecionados(novosTipos.length === TODOS_TIPOS_ATOS.length);
  };

  // Helper para legenda descritiva do perfil selecionado
  const getPerfilLegenda = () => {
    switch (perfilSelecionado) {
      case 'estagiario':
        return 'Somente Estagiários';
      case 'chefia':
        return 'Somente Chefias';
      case 'administrador':
        return 'Somente Administradores';
      default:
        return 'Todos os Perfis (Estagiários, Chefias e Administradores)';
    }
  };

  // Exportar Relatório de Quantidade de Atos Submetidos
  const exportarAtosSubmetidos = async () => {
    if (tiposSelecionados.length === 0) {
      toast.warning("Por favor, selecione ao menos um tipo de ato para o relatório.");
      return;
    }

    const paramMesInicio = `${anoInicio}-${mesInicio}`;
    const paramMesFim = modoPeriodo === 'mes_unico' ? paramMesInicio : `${anoFim}-${mesFim}`;

    if (paramMesInicio > paramMesFim) {
      toast.error("O mês inicial não pode ser posterior ao mês final.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Sessão não autenticada. Faça login novamente para exportar.");
      return;
    }

    setCarregando(true);
    try {
      const tiposParam = todosTiposSelecionados ? '' : tiposSelecionados.join(',');
      const response = await api.get('/dashboard/produtividade/relatorio-atos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          mes_inicio: paramMesInicio,
          mes_fim: paramMesFim,
          tipos: tiposParam || undefined,
        },
      });

      const dados = response.data;

      if (formato === 'xlsx') {
        gerarXLSXAtosSubmetidos(dados);
      } else {
        gerarPDFAtosSubmetidos(dados);
      }

      toast.success("Relatório gerado com sucesso!");
      onOpenChange(false);
    } catch (err: any) {
      console.error("Erro ao gerar relatório:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        err.message ||
        "Erro ao consultar dados para o relatório.";
      toast.error(msg);
    } finally {
      setCarregando(false);
    }
  };

  // Helper para slugs e labels dos meses
  const NOMES_MESES_SLUG: Record<number, string> = {
    1: 'janeiro',
    2: 'fevereiro',
    3: 'marco',
    4: 'abril',
    5: 'maio',
    6: 'junho',
    7: 'julho',
    8: 'agosto',
    9: 'setembro',
    10: 'outubro',
    11: 'novembro',
    12: 'dezembro',
  };

  const NOMES_MESES_LABEL: Record<number, string> = {
    1: 'Janeiro',
    2: 'Fevereiro',
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    7: 'Julho',
    8: 'Agosto',
    9: 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro',
  };

  // Gerador XLSX para Quantidade de Atos Submetidos (Matriz idêntica ao layout solicitado)
  const gerarXLSXAtosSubmetidos = (dados: any) => {
    const wb = XLSX.utils.book_new();

    const meses = dados.resumo_meses && dados.resumo_meses.length > 0
      ? dados.resumo_meses
      : [{
          mes_key: dados.periodo?.mes_inicio || '2026-01',
          ano: parseInt(dados.periodo?.mes_inicio?.split('-')[0] || '2026', 10),
          mes: parseInt(dados.periodo?.mes_inicio?.split('-')[1] || '1', 10),
          nome_mes: dados.periodo?.label || 'Mês',
          tipos: dados.resumo_tipos || [],
          total: dados.total_geral || 0,
        }];

    const todosMesmoAno = meses.every((m: any) => m.ano === meses[0]?.ano);

    const colunasMeses = meses.map((m: any) => {
      const slug = NOMES_MESES_SLUG[m.mes] || `mes_${m.mes}`;
      return todosMesmoAno ? `total_${slug}` : `total_${slug}_${m.ano}`;
    });

    let nomeColunaTotal = 'total_periodo';
    if (meses.length === 2) nomeColunaTotal = 'total_bimestre';
    else if (meses.length === 3) nomeColunaTotal = 'total_trimestre';
    else if (meses.length === 4) nomeColunaTotal = 'total_quadrimestre';
    else if (meses.length === 6) nomeColunaTotal = 'total_semestre';
    else if (meses.length === 12) nomeColunaTotal = 'total_ano';

    const cabecalho = meses.length > 1
      ? ['tipo ato', ...colunasMeses, nomeColunaTotal]
      : ['tipo ato', colunasMeses[0] || 'total'];

    // Determinar todos os tipos de atos que devem constar no relatório
    const tiposBase = todosTiposSelecionados
      ? Array.from(new Set([
          ...TODOS_TIPOS_ATOS,
          ...(dados.resumo_tipos || []).map((r: any) => r.tipo),
        ]))
      : tiposSelecionados;

    // Mapear contagens por mês: mesKey -> { [tipo]: count }
    const mapaMesTipo: Record<string, Record<string, number>> = {};
    meses.forEach((m: any) => {
      const chave = m.mes_key;
      mapaMesTipo[chave] = {};
      (m.tipos || []).forEach((t: any) => {
        mapaMesTipo[chave][t.tipo] = t.total ?? 0;
      });
    });

    // Montar lista de tipos com suas contagens e totais
    const linhasDados = tiposBase.map((tipo) => {
      const contagensPorMes = meses.map((m: any) => mapaMesTipo[m.mes_key]?.[tipo] ?? 0);
      const totalTipo = contagensPorMes.reduce((acc: number, curr: number) => acc + curr, 0);
      return {
        tipo,
        contagensPorMes,
        totalTipo,
      };
    });

    // Ordenação idêntica ao exemplo do usuário:
    // 1. Maior totalTipo primeiro (decrescente)
    // 2. Empates (ex: tipos com 0): ordem alfabética
    linhasDados.sort((a, b) => {
      if (b.totalTipo !== a.totalTipo) {
        return b.totalTipo - a.totalTipo;
      }
      return a.tipo.localeCompare(b.tipo, 'pt-BR');
    });

    const linhasAOA: any[] = [cabecalho];
    linhasDados.forEach((item) => {
      if (meses.length > 1) {
        linhasAOA.push([item.tipo, ...item.contagensPorMes, item.totalTipo]);
      } else {
        linhasAOA.push([item.tipo, item.contagensPorMes[0] ?? item.totalTipo]);
      }
    });

    const ws = XLSX.utils.aoa_to_sheet(linhasAOA);

    const colWidths = [{ wch: 30 }];
    meses.forEach(() => colWidths.push({ wch: 18 }));
    if (meses.length > 1) {
      colWidths.push({ wch: 18 });
    }
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Atos Submetidos");

    const nomeArquivo = `quantidade_atos_submetidos_${dados.periodo?.mes_inicio}_a_${dados.periodo?.mes_fim}.xlsx`;
    salvarArquivoXLSX(wb, nomeArquivo);
  };

  // Gerador PDF para Quantidade de Atos Submetidos (Matriz com tipos e meses)
  const gerarPDFAtosSubmetidos = (dados: any) => {
    const meses = dados.resumo_meses && dados.resumo_meses.length > 0
      ? dados.resumo_meses
      : [{
          mes_key: dados.periodo?.mes_inicio || '2026-01',
          ano: parseInt(dados.periodo?.mes_inicio?.split('-')[0] || '2026', 10),
          mes: parseInt(dados.periodo?.mes_inicio?.split('-')[1] || '1', 10),
          nome_mes: dados.periodo?.label || 'Mês',
          tipos: dados.resumo_tipos || [],
          total: dados.total_geral || 0,
        }];

    // Se mais de 5 meses, usar landscape (horizontal) para acomodar as colunas confortavelmente
    const orientacao = meses.length > 5 ? 'landscape' : 'portrait';
    const doc = createPDFDoc({ orientation: orientacao, unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Brasão do Estado do Pará
    try {
      doc.addImage(BRASAO_PARA_BASE64, 'PNG', 14, 7, 16.5, 20.6);
    } catch (e) {
      console.error("Erro ao desenhar brasão do Pará no PDF:", e);
    }

    // 2. Cabeçalho Institucional Oficial
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text("GOVERNO DO ESTADO DO PARÁ", 35, 12.5);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text("PROCURADORIA-GERAL DO ESTADO (PGE/PA)", 35, 18);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text("SISTEMA LEXPGE • QUANTIDADE DE ATOS SUBMETIDOS", 35, 23.5);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(
      `Período: ${dados.periodo?.label || "-"}   |   Emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
      35,
      28
    );

    // Linha divisória de cabeçalho
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(14, 31, pageWidth - 14, 31);

    // Metadados do relatório
    let currentY = 36;
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(14, currentY, pageWidth - 28, 14, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text("Período de Referência:", 18, currentY + 8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(dados.periodo?.label || "-", 60, currentY + 8.5);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("Total Geral de Atos:", pageWidth - 90, currentY + 8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text(`${dados.total_geral || 0} atos`, pageWidth - 45, currentY + 8.5);

    currentY += 20;

    const tiposBase = todosTiposSelecionados
      ? Array.from(new Set([
          ...TODOS_TIPOS_ATOS,
          ...(dados.resumo_tipos || []).map((r: any) => r.tipo),
        ]))
      : tiposSelecionados;

    const mapaMesTipo: Record<string, Record<string, number>> = {};
    meses.forEach((m: any) => {
      const chave = m.mes_key;
      mapaMesTipo[chave] = {};
      (m.tipos || []).forEach((t: any) => {
        mapaMesTipo[chave][t.tipo] = t.total ?? 0;
      });
    });

    const linhasDados = tiposBase.map((tipo) => {
      const contagensPorMes = meses.map((m: any) => mapaMesTipo[m.mes_key]?.[tipo] ?? 0);
      const totalTipo = contagensPorMes.reduce((acc: number, curr: number) => acc + curr, 0);
      return {
        tipo,
        contagensPorMes,
        totalTipo,
      };
    });

    linhasDados.sort((a, b) => {
      if (b.totalTipo !== a.totalTipo) {
        return b.totalTipo - a.totalTipo;
      }
      return a.tipo.localeCompare(b.tipo, 'pt-BR');
    });

    let headPDF: string[][] = [];
    let bodyPDF: (string | number)[][] = [];

    if (meses.length > 1) {
      const colunasMesesPDF = meses.map((m: any) => {
        const nome = NOMES_MESES_LABEL[m.mes] || `Mês ${m.mes}`;
        return meses.length > 6 ? nome.slice(0, 3) : nome;
      });

      let rotuloTotal = 'Total Período';
      if (meses.length === 2) rotuloTotal = 'Total Bimestre';
      else if (meses.length === 3) rotuloTotal = 'Total Trimestre';
      else if (meses.length === 4) rotuloTotal = 'Total Quadrimestre';
      else if (meses.length === 6) rotuloTotal = 'Total Semestre';
      else if (meses.length === 12) rotuloTotal = 'Total Ano';

      headPDF = [['Tipo de Ato Normativo', ...colunasMesesPDF, rotuloTotal]];

      bodyPDF = linhasDados.map((item) => [
        item.tipo,
        ...item.contagensPorMes.map(String),
        String(item.totalTipo),
      ]);

      const totaisPorMes = meses.map((_: any, idx: number) => {
        const soma = linhasDados.reduce((acc: number, curr: any) => acc + (curr.contagensPorMes[idx] || 0), 0);
        return String(soma);
      });
      bodyPDF.push(['TOTAL GERAL', ...totaisPorMes, String(dados.total_geral || 0)]);
    } else {
      headPDF = [['Tipo de Ato Normativo', 'Quantidade']];
      bodyPDF = linhasDados.map((item) => [
        item.tipo,
        String(item.contagensPorMes[0] ?? item.totalTipo),
      ]);
      bodyPDF.push(['TOTAL GERAL', String(dados.total_geral || 0)]);
    }

    const columnStylesPDF: Record<number, any> = {
      0: { halign: 'left' },
    };
    if (meses.length > 1) {
      meses.forEach((_: any, idx: number) => {
        columnStylesPDF[idx + 1] = { halign: 'center' };
      });
      columnStylesPDF[meses.length + 1] = { halign: 'center', fontStyle: 'bold' };
    } else {
      columnStylesPDF[1] = { halign: 'center', fontStyle: 'bold' };
    }

    applyAutoTable(doc, {
      startY: currentY,
      margin: { left: 14, right: 14 },
      head: headPDF,
      body: bodyPDF,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 3,
        halign: 'center',
      },
      columnStyles: columnStylesPDF,
      didParseCell: (hookData: any) => {
        if (hookData.row.index === bodyPDF.length - 1) {
          hookData.cell.styles.fontStyle = 'bold';
          hookData.cell.styles.fillColor = [241, 245, 249]; // slate-100
        }
      },
    });

    const totalPaginas = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.setDrawColor(226, 232, 240);
      doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
      doc.text("Sistema LEXPGE • Procuradoria-Geral do Estado do Pará", 14, pageHeight - 7);
      doc.text(`Página ${i} de ${totalPaginas}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
    }

    const nomeArquivo = `quantidade_atos_submetidos_${dados.periodo?.mes_inicio}_a_${dados.periodo?.mes_fim}.pdf`;
    salvarArquivoPDF(doc, nomeArquivo);
  };

  // Exportar Produtividade Geral da Equipe com Período Próprio Selecionado
  const exportarProdutividadeEquipe = async () => {
    const paramMesInicio = `${anoInicioEquipe}-${mesInicioEquipe}`;
    const paramMesFim = modoPeriodoEquipe === 'mes_unico' ? paramMesInicio : `${anoFimEquipe}-${mesFimEquipe}`;

    if (paramMesInicio > paramMesFim) {
      toast.error("O mês inicial não pode ser posterior ao mês final.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Sessão não autenticada. Faça login novamente para exportar.");
      return;
    }

    setCarregando(true);
    try {
      const { dataInicioStr, dataFimStr, label } = getDatasEquipeCalculadas();

      const res = await api.get('/dashboard/produtividade', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          data_inicio: dataInicioStr,
          data_fim: dataFimStr,
        },
      });

      const todosUsuarios: any[] = res.data.usuarios || [];

      // Filtragem por perfil especificado
      let usuariosParaExportar = [...todosUsuarios];
      if (perfilSelecionado !== 'todos') {
        usuariosParaExportar = usuariosParaExportar.filter((u) => {
          const p = (u.perfil || '').toLowerCase();
          if (perfilSelecionado === 'estagiario') return p.includes('estagi');
          if (perfilSelecionado === 'chefia') return p.includes('chefia');
          if (perfilSelecionado === 'administrador') return p.includes('admin');
          return true;
        });
      }

      if (usuariosParaExportar.length === 0) {
        toast.warning(`Nenhum usuário encontrado com o perfil especificado (${getPerfilLegenda()}) no período selecionado.`);
        return;
      }

      if (formato === 'xlsx') {
        const wb = XLSX.utils.book_new();
        const headers = [
          "Nome do Servidor",
          "Email",
          "Perfil",
          "Status",
          "Atos Cadastrados",
          "Atos Editados/Revisados",
          "Total de Ações",
          "Última Atividade",
          "Distribuição por Tipo",
        ];

        const rows = usuariosParaExportar.map((u) => {
          const tiposStr = u.tipos && u.tipos.length > 0
            ? u.tipos.map((t: any) => `${t.tipo}: ${t.total}`).join(" | ")
            : "Nenhum";

          return [
            u.nome,
            u.email,
            u.perfil,
            u.ativo ? "Ativo" : "Inativo",
            u.total_criados,
            u.total_editados,
            u.total_acoes,
            u.ultima_acao || "-",
            tiposStr,
          ];
        });

        const ws = XLSX.utils.aoa_to_sheet([
          ["GOVERNO DO ESTADO DO PARÁ - PROCURADORIA-GERAL DO ESTADO (PGE/PA)"],
          [`RELATÓRIO DE PRODUTIVIDADE DA EQUIPE - ${label}`],
          [`Perfil Filtrado: ${getPerfilLegenda()}`],
          [`Total de Colaboradores: ${usuariosParaExportar.length}`],
          [],
          headers,
          ...rows
        ]);
        ws['!cols'] = [
          { wch: 32 },
          { wch: 32 },
          { wch: 20 },
          { wch: 14 },
          { wch: 18 },
          { wch: 22 },
          { wch: 16 },
          { wch: 22 },
          { wch: 40 },
        ];
        XLSX.utils.book_append_sheet(wb, ws, "Produtividade Equipe");
        salvarArquivoXLSX(wb, `relatorio_produtividade_equipe_${dataInicioStr}_a_${dataFimStr}.xlsx`);
      } else {
        const doc = createPDFDoc({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();

        // 1. Brasão do Estado do Pará
        try {
          doc.addImage(BRASAO_PARA_BASE64, 'PNG', 14, 6, 17, 21.3);
        } catch (e) {
          console.error("Erro ao desenhar brasão do Pará no PDF:", e);
        }

        // 2. Cabeçalho Institucional Oficial
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text("GOVERNO DO ESTADO DO PARÁ", 35, 11);

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text("PROCURADORIA-GERAL DO ESTADO (PGE/PA)", 35, 16.5);

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text("SISTEMA LEXPGE • RELATÓRIO DE PRODUTIVIDADE DA EQUIPE", 35, 21.5);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(
          `Período: ${label}   |   Perfil: ${getPerfilLegenda()}   |   Total de Colaboradores: ${usuariosParaExportar.length}   |   Emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
          35,
          26
        );

        // Linha divisória de cabeçalho
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.5);
        doc.line(14, 29, pageWidth - 14, 29);

        // Tabela de Produtividade (Conteúdo Centralizado com a coluna)
        const headersPDF = [['Servidor', 'Perfil', 'Status', 'Cadastrados', 'Editados/Revisados', 'Total de Ações', 'Última Atividade']];
        const rowsPDF = usuariosParaExportar.map((u) => [
          u.nome,
          u.perfil,
          u.ativo ? "Ativo" : "Inativo",
          String(u.total_criados),
          String(u.total_editados),
          String(u.total_acoes),
          u.ultima_acao || "-",
        ]);

        applyAutoTable(doc, {
          startY: 33,
          margin: { left: 14, right: 14 },
          head: headersPDF,
          body: rowsPDF,
          theme: 'striped',
          headStyles: {
            fillColor: [30, 41, 59],
            textColor: 255,
            fontSize: 9.5,
            fontStyle: 'bold',
            halign: 'center',
          },
          styles: {
            fontSize: 9,
            cellPadding: 3,
            halign: 'center',
          },
          columnStyles: {
            0: { halign: 'center' },
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center', fontStyle: 'bold' },
            4: { halign: 'center' },
            5: { halign: 'center', fontStyle: 'bold' },
            6: { halign: 'center' },
          },
        });

        const totalPaginas = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= totalPaginas; i++) {
          doc.setPage(i);
          doc.setFontSize(8.5);
          doc.setTextColor(148, 163, 184);
          doc.text(`Página ${i} de ${totalPaginas} • Sistema LEXPGE`, pageWidth - 14, 202, { align: 'right' });
        }

        salvarArquivoPDF(doc, `relatorio_produtividade_equipe_${dataInicioStr}_a_${dataFimStr}.pdf`);
      }

      toast.success("Relatório de produtividade da equipe gerado com sucesso!");
      onOpenChange(false);
    } catch (err: any) {
      console.error("Erro ao gerar relatório de equipe:", err);
      toast.error(err.message || "Erro ao processar arquivo para exportação.");
    } finally {
      setCarregando(false);
    }
  };

  const handleExportar = () => {
    if (tipoRelatorio === 'atos_submetidos') {
      exportarAtosSubmetidos();
    } else {
      exportarProdutividadeEquipe();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[96vw] max-w-5xl md:max-w-[1020px] lg:max-w-[1080px] p-0 flex flex-col max-h-[88vh] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden gap-0"
      >
        {/* Cabeçalho do Modal Retangular Centralizado */}
        <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 shrink-0">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30 shrink-0">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Exportação de Relatórios Gerenciais
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure os filtros desejados, especifique os perfis e selecione o formato do relatório oficial.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Corpo com Disposição Retangular de Duas Colunas */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Coluna Esquerda: Modalidade, Perfil e Formato */}
            <div className="lg:col-span-5 space-y-4">
              {/* Seção 1: Escolha da Modalidade */}
              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  1. Modalidade do Relatório
                </Label>
                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTipoRelatorio('atos_submetidos')}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all relative flex flex-col gap-1.5 ${
                      tipoRelatorio === 'atos_submetidos'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 shadow-sm ring-4 ring-blue-600/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${
                          tipoRelatorio === 'atos_submetidos'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          <Layers className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-sm block">Quantidade de Atos Submetidos</span>
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Quantitativo por mês e tipo</span>
                        </div>
                      </div>
                      {tipoRelatorio === 'atos_submetidos' && (
                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipoRelatorio('produtividade_equipe')}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all relative flex flex-col gap-1.5 ${
                      tipoRelatorio === 'produtividade_equipe'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 shadow-sm ring-4 ring-blue-600/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${
                          tipoRelatorio === 'produtividade_equipe'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-sm block">Produtividade da Equipe</span>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Ações por colaborador</span>
                        </div>
                      </div>
                      {tipoRelatorio === 'produtividade_equipe' && (
                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Seção 2: Especificação de Perfil de Usuário (Apenas para Produtividade da Equipe) */}
              {tipoRelatorio === 'produtividade_equipe' && (
                <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      2. Perfil de Usuário / Especificação
                    </Label>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      Filtro
                    </span>
                  </div>
                  <Select value={perfilSelecionado} onValueChange={setPerfilSelecionado}>
                    <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                      <SelectValue placeholder="Selecione o perfil desejado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos" className="text-sm font-semibold">
                        Todos os Perfis (Estagiários, Chefias e Administradores)
                      </SelectItem>
                      <SelectItem value="estagiario" className="text-sm">
                        Somente Estagiários
                      </SelectItem>
                      <SelectItem value="chefia" className="text-sm">
                        Somente Chefias
                      </SelectItem>
                      <SelectItem value="administrador" className="text-sm">
                        Somente Administradores
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {perfilSelecionado === 'todos'
                      ? 'Inclui dados de todos os colaboradores cadastrados.'
                      : `Filtrando exclusivamente os dados gerados por: ${
                          perfilSelecionado === 'estagiario'
                            ? 'Estagiários'
                            : perfilSelecionado === 'chefia'
                            ? 'Chefias'
                            : 'Administradores'
                        }.`}
                  </p>
                </div>
              )}

              {/* Seção: Formato do Arquivo de Saída */}
              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  {tipoRelatorio === 'atos_submetidos' ? '2. Formato do Arquivo de Saída' : '3. Formato do Arquivo de Saída'}
                </Label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormato('pdf')}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col gap-1.5 ${
                      formato === 'pdf'
                        ? 'border-red-600 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-red-100 shadow-sm ring-4 ring-red-600/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-1.5 rounded-lg ${
                        formato === 'pdf'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      {formato === 'pdf' && (
                        <CheckCircle2 className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm block">PDF (.pdf)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Com Brasão do Pará</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormato('xlsx')}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col gap-1.5 ${
                      formato === 'xlsx'
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-sm ring-4 ring-emerald-600/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-1.5 rounded-lg ${
                        formato === 'xlsx'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        <FileSpreadsheet className="h-5 w-5" />
                      </div>
                      {formato === 'xlsx' && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm block">Excel (.xlsx)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Planilha estruturada</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Período e Tipos de Atos OU Resumo da Equipe */}
            <div className="lg:col-span-7 space-y-4">
              {tipoRelatorio === 'atos_submetidos' ? (
                <>
                  {/* Período de Apuração */}
                  <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        3. Período de Apuração
                      </Label>
                      <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-lg self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setModoPeriodo('mes_unico')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            modoPeriodo === 'mes_unico'
                              ? 'bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Mês Específico
                        </button>
                        <button
                          type="button"
                          onClick={() => setModoPeriodo('intervalo')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            modoPeriodo === 'intervalo'
                              ? 'bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Intervalo de Meses
                        </button>
                      </div>
                    </div>

                    {modoPeriodo === 'mes_unico' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            Mês de Referência:
                          </Label>
                          <Select value={mesInicio} onValueChange={setMesInicio}>
                            <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                              <SelectValue placeholder="Selecione o mês" />
                            </SelectTrigger>
                            <SelectContent>
                              {MESES.map((m) => (
                                <SelectItem key={m.valor} value={m.valor} className="text-sm">
                                  {m.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            Ano:
                          </Label>
                          <Select value={anoInicio} onValueChange={setAnoInicio}>
                            <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                              <SelectValue placeholder="Selecione o ano" />
                            </SelectTrigger>
                            <SelectContent>
                              {ANOS.map((a) => (
                                <SelectItem key={a} value={a} className="text-sm">
                                  {a}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            De (Mês Inicial):
                          </Label>
                          <div className="grid grid-cols-2 gap-1.5">
                            <Select value={mesInicio} onValueChange={setMesInicio}>
                              <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MESES.map((m) => (
                                  <SelectItem key={m.valor} value={m.valor} className="text-sm">
                                    {m.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select value={anoInicio} onValueChange={setAnoInicio}>
                              <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ANOS.map((a) => (
                                  <SelectItem key={a} value={a} className="text-sm">
                                    {a}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Até (Mês Final):
                          </Label>
                          <div className="grid grid-cols-2 gap-1.5">
                            <Select value={mesFim} onValueChange={setMesFim}>
                              <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MESES.map((m) => (
                                  <SelectItem key={m.valor} value={m.valor} className="text-sm">
                                    {m.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select value={anoFim} onValueChange={setAnoFim}>
                              <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ANOS.map((a) => (
                                  <SelectItem key={a} value={a} className="text-sm">
                                    {a}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tipos de Atos Normativos */}
                  <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        4. Tipos de Atos a Incluir
                      </Label>
                      <div
                        onClick={() => toggleTodosTipos(!todosTiposSelecionados)}
                        className="flex items-center space-x-2 cursor-pointer bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xs hover:bg-slate-100 transition-colors"
                      >
                        <Checkbox
                          id="todos-tipos"
                          checked={todosTiposSelecionados}
                          onCheckedChange={(checked) => toggleTodosTipos(checked as boolean)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor="todos-tipos"
                          className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          Todos ({tiposSelecionados.length}/{TODOS_TIPOS_ATOS.length})
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-0.5 max-h-56 overflow-y-auto pr-1">
                      {TODOS_TIPOS_ATOS.map((tipo) => {
                        const isChecked = tiposSelecionados.includes(tipo);
                        return (
                          <div
                            key={tipo}
                            onClick={() => toggleTipo(tipo)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all border text-xs sm:text-sm ${
                              isChecked
                                ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-400 dark:border-blue-700 text-blue-950 dark:text-blue-100 font-semibold shadow-2xs ring-1 ring-blue-400/20'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50/80'
                            }`}
                          >
                            <Checkbox
                              id={`tipo-${tipo}`}
                              checked={isChecked}
                              onCheckedChange={() => toggleTipo(tipo)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-4 w-4"
                            />
                            <label
                              htmlFor={`tipo-${tipo}`}
                              className="cursor-pointer truncate select-none"
                            >
                              {tipo}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* Painel Próprio para Produtividade da Equipe: Período Próprio e Resumo Objetivo (Sem Dicas) */
                <div className="space-y-4">
                  {/* Período de Apuração da Produtividade */}
                  <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        4. Período de Apuração da Produtividade
                      </Label>
                      <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-lg self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setModoPeriodoEquipe('mes_unico')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            modoPeriodoEquipe === 'mes_unico'
                              ? 'bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Mês Específico
                        </button>
                        <button
                          type="button"
                          onClick={() => setModoPeriodoEquipe('intervalo')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            modoPeriodoEquipe === 'intervalo'
                              ? 'bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Intervalo de Meses
                        </button>
                      </div>
                    </div>

                    {modoPeriodoEquipe === 'mes_unico' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            Mês de Referência:
                          </Label>
                          <Select value={mesInicioEquipe} onValueChange={setMesInicioEquipe}>
                            <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                              <SelectValue placeholder="Selecione o mês" />
                            </SelectTrigger>
                            <SelectContent>
                              {MESES.map((m) => (
                                <SelectItem key={m.valor} value={m.valor} className="text-sm">
                                  {m.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            Ano:
                          </Label>
                          <Select value={anoInicioEquipe} onValueChange={setAnoInicioEquipe}>
                            <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                              <SelectValue placeholder="Selecione o ano" />
                            </SelectTrigger>
                            <SelectContent>
                              {ANOS.map((a) => (
                                <SelectItem key={a} value={a} className="text-sm">
                                  {a}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            De (Mês Inicial):
                          </Label>
                          <div className="grid grid-cols-2 gap-1.5">
                            <Select value={mesInicioEquipe} onValueChange={setMesInicioEquipe}>
                              <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MESES.map((m) => (
                                  <SelectItem key={m.valor} value={m.valor} className="text-sm">
                                    {m.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select value={anoInicioEquipe} onValueChange={setAnoInicioEquipe}>
                              <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ANOS.map((a) => (
                                  <SelectItem key={a} value={a} className="text-sm">
                                    {a}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Até (Mês Final):
                          </Label>
                          <div className="grid grid-cols-2 gap-1.5">
                            <Select value={mesFimEquipe} onValueChange={setMesFimEquipe}>
                              <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MESES.map((m) => (
                                  <SelectItem key={m.valor} value={m.valor} className="text-sm">
                                    {m.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select value={anoFimEquipe} onValueChange={setAnoFimEquipe}>
                              <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ANOS.map((a) => (
                                  <SelectItem key={a} value={a} className="text-sm">
                                    {a}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resumo Objetivo do Período e Colaboradores (Sem Dicas) */}
                  <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Colaboradores com Ações no Período
                      </Label>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {carregandoPreviewEquipe ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Loader2 className="h-3 w-3 animate-spin" /> Atualizando...
                          </span>
                        ) : (
                          `${usuariosEquipePeriodo.filter((u) => {
                            if (perfilSelecionado === 'todos') return true;
                            const p = (u.perfil || '').toLowerCase();
                            if (perfilSelecionado === 'estagiario') return p.includes('estagi');
                            if (perfilSelecionado === 'chefia') return p.includes('chefia');
                            if (perfilSelecionado === 'administrador') return p.includes('admin');
                            return true;
                          }).length} Colaboradores`
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Período Selecionado:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{getPeriodoEquipeCalculado()}</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Filtro de Perfil:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{getPerfilLegenda()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/80 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
            disabled={carregando}
            className="w-full sm:w-auto h-11 px-5 text-sm font-semibold border-slate-300 dark:border-slate-700"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="default"
            size="lg"
            onClick={handleExportar}
            disabled={carregando}
            className={`w-full sm:w-auto h-11 px-6 text-sm font-bold shadow-md transition-all active:scale-[0.98] ${
              formato === 'xlsx'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
            }`}
          >
            {carregando ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Gerando Arquivo {formato.toUpperCase()}...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Exportar em {formato.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Building2, ChevronDown, Plus, Check } from 'lucide-react';

export interface OrgaoInfo {
  sigla: string;
  nome?: string;
}

// Catálogo base dos principais órgãos e secretarias do Estado do Pará
export const ORGAOS_BASE_PA: OrgaoInfo[] = [
  { sigla: 'PGE', nome: 'Procuradoria-Geral do Estado' },
  { sigla: 'SEDUC', nome: 'Secretaria de Estado de Educação' },
  { sigla: 'SEFA', nome: 'Secretaria de Estado da Fazenda' },
  { sigla: 'SEPLAD', nome: 'Secretaria de Estado de Planejamento e Administração' },
  { sigla: 'SESPA', nome: 'Secretaria de Estado de Saúde Pública' },
  { sigla: 'SEGUP', nome: 'Secretaria de Estado de Segurança Pública e Defesa Social' },
  { sigla: 'SEMAS', nome: 'Secretaria de Estado de Meio Ambiente e Sustentabilidade' },
  { sigla: 'SETRAN', nome: 'Secretaria de Estado de Transportes' },
  { sigla: 'SEDEME', nome: 'Secretaria de Estado de Desenvolvimento Econômico, Mineração e Energia' },
  { sigla: 'SECTET', nome: 'Secretaria de Ciência, Tecnologia e Educação Superior, Profissional e Tecnológica' },
  { sigla: 'SECULT', nome: 'Secretaria de Estado de Cultura' },
  { sigla: 'SEEL', nome: 'Secretaria de Estado de Esporte e Lazer' },
  { sigla: 'SEAP', nome: 'Secretaria de Estado de Administração Penitenciária' },
  { sigla: 'SEASTER', nome: 'Secretaria de Assistência Social, Trabalho, Emprego e Renda' },
  { sigla: 'SEJUDH', nome: 'Secretaria de Estado de Justiça e Direitos Humanos' },
  { sigla: 'AGE', nome: 'Auditoria-Geral do Estado' },
  { sigla: 'DETRAN', nome: 'Departamento de Trânsito do Estado do Pará' },
  { sigla: 'ITERPA', nome: 'Instituto de Terras do Pará' },
  { sigla: 'IGEPREV', nome: 'Instituto de Gestão Previdenciária do Estado do Pará' },
  { sigla: 'JUCEPA', nome: 'Junta Comercial do Estado do Pará' },
  { sigla: 'COSANPA', nome: 'Companhia de Saneamento do Pará' },
  { sigla: 'EMATER', nome: 'Empresa de Assistência Técnica e Extensão Rural do Pará' },
  { sigla: 'ARCON', nome: 'Agência de Regulação e Controle de Serviços Públicos' },
  { sigla: 'IDEFLOR-BIO', nome: 'Instituto de Desenvolvimento Florestal e da Biodiversidade' },
  { sigla: 'PCPA', nome: 'Polícia Civil do Estado do Pará' },
  { sigla: 'PM', nome: 'Polícia Militar do Pará' },
  { sigla: 'CBMPA', nome: 'Corpo de Bombeiros Militar do Pará' },
  { sigla: 'CPC', nome: 'Centro de Perícias Científicas Renato Chaves' },
  { sigla: 'DPPA', nome: 'Defensoria Pública do Estado do Pará' },
  { sigla: 'ALEPA', nome: 'Assembleia Legislativa do Estado do Pará' },
  { sigla: 'TCEPA', nome: 'Tribunal de Contas do Estado do Pará' },
  { sigla: 'TCMPA', nome: 'Tribunal de Contas dos Municípios do Estado do Pará' },
  { sigla: 'FSCMPA', nome: 'Fundação Santa Casa de Misericórdia do Pará' },
  { sigla: 'FUNTELPA', nome: 'Fundação Paraense de Radiodifusão' },
  { sigla: 'FAPESPA', nome: 'Fundação Amazônia de Amparo a Estudos e Pesquisas' },
  { sigla: 'PRODEPA', nome: 'Empresa de Tecnologia da Informação e Comunicação do Pará' },
  { sigla: 'NGTM', nome: 'Núcleo de Gerenciamento de Transporte Metropolitano' },
  { sigla: 'CPH', nome: 'Companhia de Portos e Hidrovias do Pará' },
  { sigla: 'FCP', nome: 'Fundação Cultural do Estado do Pará' },
  { sigla: 'FCG', nome: 'Fundação Carlos Gomes' },
  { sigla: 'SEAD', nome: 'Secretaria de Estado de Administração (Histórico)' },
  { sigla: 'SEICOM', nome: 'Secretaria de Indústria, Comércio e Mineração (Histórico)' },
];

const LOCAL_STORAGE_KEY = 'lexpge_custom_origens';

interface OrigemAutocompleteProps {
  id?: string;
  value?: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function OrigemAutocomplete({
  id = 'origem',
  value = '',
  onChange,
  disabled = false,
  placeholder = 'Ex: SEDUC, SEPLAD, PGE',
  className = '',
}: OrigemAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [customSiglas, setCustomSiglas] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [apiSiglas, setApiSiglas] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Busca siglas registradas no backend
  useEffect(() => {
    let isMounted = true;
    async function carregarOrigensBackend() {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/atos/origens`, { headers });
        if (res.ok) {
          const data: string[] = await res.json();
          if (isMounted && Array.isArray(data)) {
            setApiSiglas(data);
          }
        }
      } catch (err) {
        console.debug('Erro ao carregar origens do backend:', err);
      }
    }
    carregarOrigensBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  // Consolidação de todas as siglas conhecidas (Base + API + Salvas pelo usuário)
  const todasSiglasMap = useMemo(() => {
    const map = new Map<string, OrgaoInfo>();

    // 1. Base pré-definida
    ORGAOS_BASE_PA.forEach((o) => {
      map.set(o.sigla.toUpperCase(), o);
    });

    // 2. Siglas do backend
    apiSiglas.forEach((sigla) => {
      const s = sigla.trim().toUpperCase();
      if (s && !map.has(s)) {
        map.set(s, { sigla: s, nome: 'Órgão registrado no sistema' });
      }
    });

    // 3. Siglas customizadas locais
    customSiglas.forEach((sigla) => {
      const s = sigla.trim().toUpperCase();
      if (s && !map.has(s)) {
        map.set(s, { sigla: s, nome: 'Sigla adicionada pelo usuário' });
      }
    });

    return map;
  }, [apiSiglas, customSiglas]);

  const listaCompleta = useMemo(() => {
    return Array.from(todasSiglasMap.values());
  }, [todasSiglasMap]);

  // Persiste nova sigla no localStorage para próximas utilizações
  const registrarNovaSigla = (nova: string) => {
    const siglaLimpa = nova.trim().toUpperCase();
    if (!siglaLimpa) return;

    if (!todasSiglasMap.has(siglaLimpa) && !customSiglas.includes(siglaLimpa)) {
      const atualizadas = [...customSiglas, siglaLimpa];
      setCustomSiglas(atualizadas);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atualizadas));
      } catch (err) {
        console.error('Erro ao salvar nova sigla:', err);
      }
    }
  };

  // Filtragem inteligente de sugestões conforme o que o usuário digita
  const termo = (value || '').trim().toUpperCase();

  const sugestoesFiltradas = useMemo(() => {
    if (!termo) {
      // Exibe catálogo principal ordenado alfabeticamente
      return listaCompleta.slice().sort((a, b) => a.sigla.localeCompare(b.sigla));
    }

    return listaCompleta
      .filter((o) => {
        const siglaMatch = o.sigla.includes(termo);
        const nomeMatch = o.nome ? o.nome.toUpperCase().includes(termo) : false;
        return siglaMatch || nomeMatch;
      })
      .sort((a, b) => {
        // Prioriza quem começa exatamente com o termo pesquisado
        const aStart = a.sigla.startsWith(termo);
        const bStart = b.sigla.startsWith(termo);
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        return a.sigla.localeCompare(b.sigla);
      });
  }, [listaCompleta, termo]);

  const termoJaExiste = useMemo(() => {
    if (!termo) return true;
    return todasSiglasMap.has(termo);
  }, [todasSiglasMap, termo]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Força uppercase em tempo real na digitação
    const valorEmMaiusculo = e.target.value.toUpperCase();
    onChange(valorEmMaiusculo);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectSigla = (siglaEscolhida: string) => {
    const s = siglaEscolhida.trim().toUpperCase();
    onChange(s);
    registrarNovaSigla(s);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    const totalOpcoes = sugestoesFiltradas.length + (!termoJaExiste && termo ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < totalOpcoes ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalOpcoes - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < sugestoesFiltradas.length) {
        handleSelectSigla(sugestoesFiltradas[highlightedIndex].sigla);
      } else if (!termoJaExiste && termo) {
        handleSelectSigla(termo);
      } else if (termo) {
        handleSelectSigla(termo);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleBlur = () => {
    if (termo) {
      registrarNovaSigla(termo);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Input
          id={id}
          type="text"
          value={value ?? ''}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className={`uppercase font-semibold tracking-wide pr-9 ${className}`}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          className="absolute right-2.5 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Menu Flutuante de Sugestões */}
      {isOpen && !disabled && (
        <div
          ref={listRef}
          className="absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl py-1 text-sm animate-in fade-in-50 zoom-in-95 duration-100"
        >
          {/* Opção de adicionar nova sigla digitada (caso não esteja no catálogo) */}
          {!termoJaExiste && termo.length > 0 && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectSigla(termo);
              }}
              className={`px-3 py-2 cursor-pointer flex items-center justify-between border-b border-slate-100 dark:border-slate-800 transition-colors ${
                highlightedIndex === sugestoesFiltradas.length
                  ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-950 dark:text-blue-100'
                  : 'bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-semibold text-xs">
                  Adicionar &ldquo;<strong className="text-blue-900 dark:text-blue-200 font-extrabold">{termo}</strong>&rdquo; como nova sigla
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-blue-300 dark:border-blue-700 bg-white/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                Nova
              </span>
            </div>
          )}

          {/* Lista de Sugestões Filtradas */}
          {sugestoesFiltradas.length > 0 ? (
            <div className="py-1">
              {sugestoesFiltradas.map((item, index) => {
                const isSelected = item.sigla === termo;
                const isHighlighted = index === highlightedIndex;

                return (
                  <div
                    key={item.sigla}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSigla(item.sigla);
                    }}
                    className={`px-3 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                      isHighlighted
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                        : isSelected
                        ? 'bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <Building2 className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                      <div className="flex flex-col truncate">
                        <span className="font-bold text-xs tracking-wider uppercase">
                          {item.sigla}
                        </span>
                        {item.nome && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {item.nome}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : termoJaExiste ? null : (
            <div className="px-3 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
              Nenhuma sigla conhecida encontrada para &ldquo;{termo}&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

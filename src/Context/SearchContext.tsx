import { createContext, useState, ReactNode } from 'react';

interface SearchContextType {
    query: { conteudo: string; descritores: string; numero: string; ano: string; tipo: string };
    setQuery: React.Dispatch<React.SetStateAction<{ conteudo: string; descritores: string; numero: string; ano: string; tipo: string }>>;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState<{ conteudo: string; descritores: string; numero: string; ano: string; tipo: string }>({
    conteudo: '',
    descritores: '',
    numero: '',
    ano: '',
    tipo: '', 
  });

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

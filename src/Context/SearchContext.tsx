import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Definição do tipo para a query
export interface QueryType {
    conteudo: string;
    descritores: string;
    numero: string;
    ano: string;
    tipo: string;
    texto_compilado: boolean;
}

// Tipo do contexto
interface SearchContextType {
    query: QueryType;
    setQuery: Dispatch<SetStateAction<QueryType>>;
}

// Criação do contexto
export const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider do contexto
export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [query, setQuery] = useState<QueryType>({
        conteudo: '',
        descritores: '',
        numero: '',
        ano: '',
        tipo: '',
        texto_compilado: false,
    });

    return (
        <SearchContext.Provider value={{ query, setQuery }}>
            {children}
        </SearchContext.Provider>
    );
};

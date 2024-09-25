import { Helmet } from 'react-helmet-async';
import logo from '@/assets/logo.svg';

export const Sobre = () => (
  <>
    <Helmet title="Sobre" />
    <div className="flex flex-col items-center px-4 sm:px-6">
      <div className="shadow-lg rounded-lg p-6 max-w-5xl w-full">
        <img className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" src={logo} alt="Logo" />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-50 text-center mb-4">
          Base de Atos Normativos - LEXPGE
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground text-justify">
          O LexPGE iniciou os trabalhos em novembro de 2020, com a inserção de atos normativos publicados diariamente no Diário Oficial do Estado (DOE). 
          Os atos normativos de anos anteriores estão sendo tratados e inseridos retrospectivamente. Atualmente o sistema disponibiliza os atos normativos de 2004 a 2024. 
          Alguns atos normativos de anos anteriores a 2004 podem ser encontrados no LexPGE devido a correlação com atos já inseridos no sistema.
        </p>
      </div>
    </div>
  </>
);

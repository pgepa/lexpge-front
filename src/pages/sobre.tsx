import { Helmet } from 'react-helmet-async';

import logo from '@/assets/logo.svg';

export const Sobre = () => (
  <>
    <Helmet title="Sobre"/>
    <div className="flex flex-col gap-4 items-center">
      <img className="w-24 h-24" src={logo} alt="Logo" />
      <h1 className="text-3xl font-bold tracking-tight text-justify" >Base de Atos Normativos - LEXPGE</h1>
      <p className="text-muted-foreground">
          O LexPGE iniciou os trabalhos em novembro de 2020, com a inserção de atos normativos publicados diariamente no Diário Oficial do Estado (DOE). 
          Os atos normativos de anos anteriores estão sendo tratados e inseridos retrospectivamente. Atualmente o sistema disponibiliza os atos normativos de 2004 a 2024. 
          Alguns atos normativos de anos anteriores a 2004 podem ser encontrados no LexPGE devido a correlação com atos já inseridos no sistema.
      </p>
    </div>
  </>
);

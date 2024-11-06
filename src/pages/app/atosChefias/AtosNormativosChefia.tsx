
import React from 'react';
import SearchFilter from '@/pages/app/atosChefias/SearchFilterChefia';
import ResultsList from '@/pages/app/atosChefias/ResultListChefia';

const AtosNormativosChefia: React.FC = () => {
  return (
    <div>
      <SearchFilter />
      <ResultsList />
    </div>
  );
};

export default AtosNormativosChefia;

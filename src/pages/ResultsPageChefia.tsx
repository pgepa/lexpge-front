import React from 'react';
import SearchFilter from '@/components/SearchFilterEstagiarioChefia';
import ResultsList from '@/components/ResultsListChefia';

const ResultsPage: React.FC = () => {
  return (
    <div>
      <SearchFilter />
      <ResultsList />
    </div>
  );
};

export default ResultsPage;

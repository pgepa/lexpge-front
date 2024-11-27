import React from 'react';
import SearchFilter from '@/components/SearchFilterEstagiario';
import ResultsList from '@/components/ResultsListEstagiario';

const ResultsPage: React.FC = () => {
  return (
    <div>
      <SearchFilter />
      <ResultsList />
    </div>
  );
};

export default ResultsPage;

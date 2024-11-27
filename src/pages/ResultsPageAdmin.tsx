import React from 'react';
import SearchFilter from '@/components/SearchFilterAdmin';
import ResultsList from '@/components/ResultsListAdmin';

const ResultsPage: React.FC = () => {
  return (
    <div>
      <SearchFilter />
      <ResultsList />
    </div>
  );
};

export default ResultsPage;

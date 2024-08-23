import React from 'react';
import SearchFilter from '@/components/SearchFilter';
import ResultsList from '@/components/ResultsList';

const ResultsPage: React.FC = () => {
  return (
    <div>
      <SearchFilter />
      <ResultsList />
    </div>
  );
};

export default ResultsPage;

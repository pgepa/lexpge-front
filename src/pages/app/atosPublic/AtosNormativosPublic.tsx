
import React from 'react';
import SearchFilter from '@/pages/app/atosPublic/SearchFilterPublic';
import ResultsList from '@/pages/app/atosPublic/AtosCardPublic';

const AtosNormativosPublic: React.FC = () => {
  return (
    <div>
      <SearchFilter />
      <ResultsList />
    </div>
  );
};

export default AtosNormativosPublic;

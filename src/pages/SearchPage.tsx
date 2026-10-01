import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '@/components/SearchForm';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userProfile = (() => {
      try {
        return JSON.parse(localStorage.getItem('userProfile') || 'null') as number | null;
      } catch {
        return null;
      }
    })();

    if (token && userProfile) {
      switch (userProfile) {
        case 1:
          navigate('/admin', { replace: true });
          break;
        case 2:
          navigate('/chefia', { replace: true });
          break;
        case 3:
          navigate('/estagiario', { replace: true });
          break;
        default:
          break;
      }
    }
  }, [navigate]);

  return (
    <div>
      <SearchForm />
    </div>
  );
};

export default SearchPage;

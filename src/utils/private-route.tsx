import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
  allowedProfiles?: number[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedProfiles }) => {
  const token = localStorage.getItem('token');
  const userProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem('userProfile') || 'null') as number | null;
    } catch (error) {
      console.error('Erro ao analisar o perfil do usuário:', error);
      return null;
    }
  })();

  if (!token || userProfile === null) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedProfiles && !allowedProfiles.includes(userProfile)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

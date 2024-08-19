import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { api } from '@/lib/axios';
import axios from 'axios';

interface UserAtivoProps {
  userId: number;
  ativo: boolean;
  onStatusChange: () => void; // Adiciona a prop onStatusChange
}

export function UserAtivo({ userId, ativo, onStatusChange }: UserAtivoProps) {
  const [isActive, setIsActive] = useState(ativo);

  const handleToggle = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token não encontrado. Redirecionando para a página de login...');
      // Redirecione para a página de login ou exiba uma mensagem de erro
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    const url = isActive
      ? `/auth/disable_user/${userId}`  // URL para desabilitar o usuário
      : `/auth/enable_user/${userId}`;  // URL para habilitar o usuário

    try {
      const response = await api.put(url, {}, config);

      if (response.status === 200) {
        setIsActive((prev) => !prev);
        onStatusChange(); // Chama a função onStatusChange após a atualização do status
      } else {
        console.error('Erro na resposta da API:', response.statusText);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao alterar o status do usuário:', error.response?.data || error.message);
      } else {
        console.error('Erro desconhecido:', error);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch id="ativo" checked={isActive} onCheckedChange={handleToggle} />
      <Label htmlFor="ativo">
        {isActive ? 'Ativo' : 'Inativo'}
      </Label>
    </div>
  );
}

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from "react";

export function UserAtivo() {
    const [isActive, setIsActive] = useState(true); // Default como true (Ativo)
  
    const handleToggle = () => {
      setIsActive((prev) => !prev); // Alterna entre true e false
    };
  
    return (
      <div className="flex items-center space-x-2">
        <Switch id="user-status" checked={isActive} onCheckedChange={handleToggle} />
        <Label htmlFor="user-status">
          {isActive ? "Ativo" : "Inativo"}
        </Label>
      </div>
    );
  }
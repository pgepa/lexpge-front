import { Outlet } from "react-router-dom";
import { Printer } from 'lucide-react';

export function TextoIntegralLayout() {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <button
        onClick={handlePrint}
        className="absolute top-4 left-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        title="Imprimir"
      >
        <Printer size={24} />
      </button>
      <Outlet />
    </div>
  );
}

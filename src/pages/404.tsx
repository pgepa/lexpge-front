import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="flex h-screen flex-col items-center justify-center gap-2">
    <h1 className="text-4xl font-bold">Página não encontrada</h1>
    <p className="text-accent-foreground">
      Voltar para a página <Link to="/" className="text-violet-600 dark:text-violet-400">Inicial</Link>
    </p>
  </div>
);

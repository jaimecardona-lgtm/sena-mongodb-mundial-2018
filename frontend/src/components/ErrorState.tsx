import { AlertCircle } from 'lucide-react';

export function ErrorState({ message = 'Error al cargar los datos' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div>
          <p className="text-red-500 font-semibold mb-1">Error</p>
          <p className="text-slate-400">{message}</p>
        </div>
      </div>
    </div>
  );
}

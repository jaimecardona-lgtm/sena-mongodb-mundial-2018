export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full loading-spinner"></div>
        <p className="text-slate-400">Cargando datos...</p>
      </div>
    </div>
  );
}

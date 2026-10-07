interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        {icon && <div className="text-blue-500">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

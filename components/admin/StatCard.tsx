import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  borderColor?: string;
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-white',
  iconBgColor = 'bg-amber-500',
  borderColor = 'border-amber-500',
  subtitle,
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg border-b-4 ${borderColor} p-3.5 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-xs text-gray-600 font-medium mb-1.5">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${iconBgColor} p-2 rounded-lg`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}


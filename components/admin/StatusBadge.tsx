import type { QuoteStatus } from '@/types/admin';

interface StatusBadgeProps {
  status: QuoteStatus | null;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (status: QuoteStatus | null) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'quoted':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const displayStatus = status || 'pending';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
        status
      )}`}
    >
      {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
    </span>
  );
}


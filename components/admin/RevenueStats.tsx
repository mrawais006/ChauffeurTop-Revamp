'use client';

import { useMemo } from 'react';
import type { Quote } from '@/types/admin';
import { calculateRevenueStats, formatCurrency } from '@/lib/revenue';
import StatCard from './StatCard';
import { Clock, Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface RevenueStatsProps {
  quotes: Quote[];
}

export default function RevenueStats({ quotes }: RevenueStatsProps) {
  const stats = useMemo(() => calculateRevenueStats(quotes), [quotes]);

  const statCards = [
    {
      title: 'Today',
      value: formatCurrency(stats.today),
      icon: Clock,
      iconColor: 'text-white',
      iconBgColor: 'bg-blue-500',
      borderColor: 'border-blue-500',
    },
    {
      title: 'This Week',
      value: formatCurrency(stats.thisWeek),
      icon: Calendar,
      iconColor: 'text-white',
      iconBgColor: 'bg-green-500',
      borderColor: 'border-green-500',
    },
    {
      title: 'This Month',
      value: formatCurrency(stats.thisMonth),
      icon: TrendingUp,
      iconColor: 'text-white',
      iconBgColor: 'bg-purple-500',
      borderColor: 'border-purple-500',
    },
    {
      title: 'All Time',
      value: formatCurrency(stats.allTime),
      icon: DollarSign,
      iconColor: 'text-white',
      iconBgColor: 'bg-amber-500',
      borderColor: 'border-amber-500',
    },
  ];

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">💵</span>
        <h2 className="text-base font-bold text-gray-900">
          Revenue Overview{' '}
          <span className="text-xs font-normal text-gray-500">
            ({stats.confirmedCount} confirmed bookings)
          </span>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            iconColor={card.iconColor}
            iconBgColor={card.iconBgColor}
            borderColor={card.borderColor}
          />
        ))}
      </div>
    </div>
  );
}


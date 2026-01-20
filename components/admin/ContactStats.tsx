'use client';

import StatCard from './StatCard';
import { Mail, Clock, CheckCircle2 } from 'lucide-react';

interface ContactStatsProps {
  stats: {
    today: number;
    week: number;
    month: number;
    allTime: number;
    newCount: number;
    contactedCount: number;
    resolvedCount: number;
  };
}

export function ContactStats({ stats }: ContactStatsProps) {
  return (
    <div className="space-y-6">
      {/* Time Period Cards */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Contact Overview</h2>
          <p className="text-sm text-gray-600">Track incoming customer inquiries</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today"
            value={stats.today}
            icon={Mail}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-50"
            subtitle="New today"
          />
          <StatCard
            title="This Week"
            value={stats.week}
            icon={Mail}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-50"
            subtitle="Past 7 days"
          />
          <StatCard
            title="This Month"
            value={stats.month}
            icon={Mail}
            iconColor="text-indigo-600"
            iconBgColor="bg-indigo-50"
            subtitle="Past 30 days"
          />
          <StatCard
            title="All Time"
            value={stats.allTime}
            icon={Mail}
            iconColor="text-cyan-600"
            iconBgColor="bg-cyan-50"
            subtitle="Total contacts"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">New</p>
              <p className="text-2xl font-bold text-blue-700">{stats.newCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Contacted</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.contactedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Resolved</p>
              <p className="text-2xl font-bold text-green-700">{stats.resolvedCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


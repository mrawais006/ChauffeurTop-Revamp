'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getEmailSubscribers, unsubscribeEmail } from '@/actions/emailSubscription';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Mail, 
  Loader2, 
  RefreshCw, 
  Download, 
  CheckCircle, 
  XCircle,
  Gift,
  Calendar,
  Tag
} from 'lucide-react';

interface EmailSubscriber {
  id: string;
  email: string;
  source: string;
  discount_code: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  is_active: boolean;
}

export function EmailSubscribersTable() {
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const loadSubscribers = async () => {
    setIsLoading(true);
    try {
      const result = await getEmailSubscribers();
      if (result.success) {
        setSubscribers(result.data);
      } else {
        toast.error(result.error || 'Failed to load subscribers');
      }
    } catch (error) {
      toast.error('Failed to load subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleUnsubscribe = async (email: string) => {
    if (!confirm(`Are you sure you want to unsubscribe ${email}?`)) return;

    try {
      const result = await unsubscribeEmail(email);
      if (result.success) {
        toast.success('Email unsubscribed successfully');
        loadSubscribers();
      } else {
        toast.error(result.error || 'Failed to unsubscribe');
      }
    } catch (error) {
      toast.error('Failed to unsubscribe');
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const activeSubscribers = subscribers.filter(s => s.is_active);
      const csvContent = [
        ['Email', 'Source', 'Discount Code', 'Subscribed At', 'Status'].join(','),
        ...activeSubscribers.map(s => [
          s.email,
          s.source,
          s.discount_code || '',
          format(new Date(s.subscribed_at), 'yyyy-MM-dd HH:mm'),
          s.is_active ? 'Active' : 'Inactive'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Exported successfully!');
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const activeCount = subscribers.filter(s => s.is_active).length;
  const inactiveCount = subscribers.filter(s => !s.is_active).length;

  const getSourceBadge = (source: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      'exit_popup': { color: 'bg-purple-100 text-purple-700', label: 'Exit Popup' },
      'landing_page': { color: 'bg-blue-100 text-blue-700', label: 'Landing Page' },
      'homepage': { color: 'bg-green-100 text-green-700', label: 'Homepage' },
      'footer': { color: 'bg-gray-100 text-gray-700', label: 'Footer' },
    };
    return badges[source] || { color: 'bg-gray-100 text-gray-600', label: source };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-luxury-gold" />
            Email Subscribers
          </h2>
          <p className="text-gray-500 mt-1">Manage your marketing email list</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadSubscribers}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExportCSV}
            disabled={isExporting || subscribers.length === 0}
            className="gap-2 bg-luxury-gold hover:bg-luxury-gold-dark text-black"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700">Active Subscribers</p>
              <p className="text-2xl font-bold text-green-800">{activeCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-700">Unsubscribed</p>
              <p className="text-2xl font-bold text-red-800">{inactiveCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700">Discount Codes Issued</p>
              <p className="text-2xl font-bold text-purple-800">
                {subscribers.filter(s => s.discount_code).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No subscribers yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Subscribers will appear here when users sign up via the popup
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Source</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Discount Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Subscribed</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map((subscriber) => {
                  const sourceBadge = getSourceBadge(subscriber.source);
                  return (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sourceBadge.color}`}>
                          {sourceBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {subscriber.discount_code ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-luxury-gold/10 text-luxury-gold rounded font-mono text-sm">
                            <Tag className="w-3 h-3" />
                            {subscriber.discount_code}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(subscriber.subscribed_at), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {subscriber.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {subscriber.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnsubscribe(subscriber.email)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Unsubscribe
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

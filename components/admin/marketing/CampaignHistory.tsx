'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  History,
  Loader2,
  RefreshCw,
  Send,
  Eye,
  Mail,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface Campaign {
  id: string;
  audience_id: string | null;
  subject: string;
  template_type: string;
  html_content: string;
  resend_broadcast_id: string | null;
  status: string;
  sent_count: number;
  open_count: number;
  click_count: number;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  marketing_audiences?: { name: string } | null;
}

export function CampaignHistory() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/marketing/campaigns');
      const data = await res.json();
      if (data.campaigns) setCampaigns(data.campaigns);
    } catch {
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const sendDraft = async (campaign: Campaign) => {
    if (!campaign.audience_id) {
      toast.error('This campaign has no audience assigned');
      return;
    }
    if (!confirm(`Send campaign "${campaign.subject}"?`)) return;

    setSendingId(campaign.id);
    try {
      const res = await fetch('/api/marketing/campaigns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: campaign.id, action: 'send' }),
      });

      const data = await res.json();
      if (data.campaign) {
        toast.success('Campaign sent!');
        loadCampaigns();
      } else {
        toast.error(data.error || 'Failed to send campaign');
      }
    } catch {
      toast.error('Failed to send campaign');
    } finally {
      setSendingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> = {
      draft: { color: 'bg-gray-100 text-gray-700', icon: Clock, label: 'Draft' },
      sending: { color: 'bg-blue-100 text-blue-700', icon: Loader2, label: 'Sending' },
      sent: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Sent' },
      failed: { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Failed' },
      scheduled: { color: 'bg-purple-100 text-purple-700', icon: Clock, label: 'Scheduled' },
    };
    return badges[status] || badges.draft;
  };

  const getTemplateLabel = (type: string) => {
    const labels: Record<string, string> = {
      reengagement: 'Re-engagement',
      seasonal: 'Seasonal Promo',
      repeat_customer: 'Repeat Customer',
      new_service: 'New Service',
      event_based: 'Event-Based',
      custom: 'Custom',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Campaign History</h2>
          <p className="text-sm text-gray-500">View and manage past campaigns</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadCampaigns} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="p-12 text-center">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No campaigns yet</p>
          <p className="text-sm text-gray-400 mt-1">Create your first campaign in the Compose tab</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const status = getStatusBadge(campaign.status);
            const StatusIcon = status.icon;

            return (
              <Card key={campaign.id} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left side */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className={`w-3 h-3 ${campaign.status === 'sending' ? 'animate-spin' : ''}`} />
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        {getTemplateLabel(campaign.template_type)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{campaign.subject}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      {campaign.marketing_audiences?.name && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {campaign.marketing_audiences.name}
                        </span>
                      )}
                      <span>
                        {campaign.sent_at
                          ? `Sent ${format(new Date(campaign.sent_at), 'MMM dd, yyyy h:mm a')}`
                          : `Created ${format(new Date(campaign.created_at), 'MMM dd, yyyy')}`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  {campaign.status === 'sent' && (
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{campaign.sent_count}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Sent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-blue-600">{campaign.open_count}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Opens</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-green-600">{campaign.click_count}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Clicks</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewId(previewId === campaign.id ? null : campaign.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {campaign.status === 'draft' && (
                      <Button
                        size="sm"
                        className="bg-luxury-gold hover:bg-luxury-gold/90 text-black"
                        onClick={() => sendDraft(campaign)}
                        disabled={sendingId === campaign.id}
                      >
                        {sendingId === campaign.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Preview */}
                {previewId === campaign.id && campaign.html_content && (
                  <div className="mt-4 pt-4 border-t">
                    <div
                      className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: campaign.html_content }}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

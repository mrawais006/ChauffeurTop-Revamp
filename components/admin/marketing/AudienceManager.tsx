'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Users,
  Plus,
  Loader2,
  RefreshCw,
  Trash2,
  Eye,
  UserPlus,
} from 'lucide-react';

interface Segment {
  id: string;
  name: string;
  description: string;
  count: number;
  query: { segment: string };
}

interface Audience {
  id: string;
  name: string;
  description: string;
  filter_criteria: any;
  contact_count: number;
  resend_audience_id: string | null;
  created_at: string;
}

export function AudienceManager() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [isLoadingSegments, setIsLoadingSegments] = useState(true);
  const [isLoadingAudiences, setIsLoadingAudiences] = useState(true);
  const [creatingAudience, setCreatingAudience] = useState<string | null>(null);
  const [previewContacts, setPreviewContacts] = useState<any[]>([]);
  const [previewSegment, setPreviewSegment] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const loadSegments = async () => {
    setIsLoadingSegments(true);
    try {
      const res = await fetch('/api/marketing/segments');
      const data = await res.json();
      if (data.segments) setSegments(data.segments);
    } catch (error) {
      toast.error('Failed to load segments');
    } finally {
      setIsLoadingSegments(false);
    }
  };

  const loadAudiences = async () => {
    setIsLoadingAudiences(true);
    try {
      const res = await fetch('/api/marketing/audiences');
      const data = await res.json();
      if (data.audiences) setAudiences(data.audiences);
    } catch (error) {
      toast.error('Failed to load audiences');
    } finally {
      setIsLoadingAudiences(false);
    }
  };

  useEffect(() => {
    loadSegments();
    loadAudiences();
  }, []);

  const createAudienceFromSegment = async (segment: Segment) => {
    setCreatingAudience(segment.id);
    try {
      const res = await fetch('/api/marketing/audiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: segment.name,
          description: segment.description,
          filter_criteria: segment.query,
        }),
      });

      const data = await res.json();
      if (data.audience) {
        toast.success(`Audience "${segment.name}" created`);
        loadAudiences();
      } else {
        toast.error(data.error || 'Failed to create audience');
      }
    } catch (error) {
      toast.error('Failed to create audience');
    } finally {
      setCreatingAudience(null);
    }
  };

  const deleteAudience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this audience?')) return;

    try {
      const res = await fetch(`/api/marketing/audiences?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Audience deleted');
        loadAudiences();
      } else {
        toast.error('Failed to delete audience');
      }
    } catch (error) {
      toast.error('Failed to delete audience');
    }
  };

  const previewSegmentContacts = async (segmentId: string) => {
    if (previewSegment === segmentId) {
      setPreviewSegment(null);
      setPreviewContacts([]);
      return;
    }

    setIsPreviewLoading(true);
    setPreviewSegment(segmentId);
    try {
      const res = await fetch('/api/marketing/segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment: segmentId, limit: 20 }),
      });
      const data = await res.json();
      setPreviewContacts(data.contacts || []);
    } catch (error) {
      toast.error('Failed to load preview');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const isSegmentAlreadyAudience = (segmentId: string) => {
    return audiences.some(a => a.filter_criteria?.segment === segmentId);
  };

  return (
    <div className="space-y-8">
      {/* Available Segments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Available Segments</h2>
            <p className="text-sm text-gray-500">Pre-built segments from your quotes database</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadSegments} disabled={isLoadingSegments}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingSegments ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isLoadingSegments ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segments.map((segment) => (
              <Card key={segment.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{segment.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{segment.description}</p>
                  </div>
                  <span className="bg-luxury-gold/10 text-luxury-gold font-bold text-sm px-2 py-0.5 rounded">
                    {segment.count}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => previewSegmentContacts(segment.id)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    {previewSegment === segment.id ? 'Hide' : 'Preview'}
                  </Button>
                  {isSegmentAlreadyAudience(segment.id) ? (
                    <Button variant="outline" size="sm" disabled className="flex-1 text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      Added
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1 text-xs bg-luxury-gold hover:bg-luxury-gold/90 text-black"
                      onClick={() => createAudienceFromSegment(segment)}
                      disabled={creatingAudience === segment.id}
                    >
                      {creatingAudience === segment.id ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <UserPlus className="w-3 h-3 mr-1" />
                      )}
                      Create
                    </Button>
                  )}
                </div>

                {/* Preview Panel */}
                {previewSegment === segment.id && (
                  <div className="mt-3 pt-3 border-t">
                    {isPreviewLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      </div>
                    ) : previewContacts.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-2">No contacts in this segment</p>
                    ) : (
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {previewContacts.map((contact, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-1">
                            <span className="text-gray-700 truncate max-w-[160px]">
                              {contact.name || contact.email}
                            </span>
                            <span className="text-gray-400 truncate max-w-[120px]">{contact.email}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Saved Audiences */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Saved Audiences</h2>
            <p className="text-sm text-gray-500">Audiences ready for campaigns</p>
          </div>
        </div>

        {isLoadingAudiences ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-luxury-gold" />
          </div>
        ) : audiences.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No audiences created yet</p>
            <p className="text-gray-400 text-xs mt-1">Click "Create" on any segment above to get started</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audiences.map((audience) => (
              <Card key={audience.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{audience.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{audience.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-bold text-luxury-gold">{audience.contact_count} contacts</span>
                      {audience.resend_audience_id && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Synced with Resend</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => deleteAudience(audience.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

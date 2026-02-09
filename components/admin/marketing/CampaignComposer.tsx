'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Send, Loader2, Eye, Users, FileText } from 'lucide-react';
import { CAMPAIGN_TEMPLATES, type CampaignTemplate } from './campaignTemplates';

interface Audience {
  id: string;
  name: string;
  contact_count: number;
}

export function CampaignComposer() {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [isLoadingAudiences, setIsLoadingAudiences] = useState(true);
  const [selectedAudience, setSelectedAudience] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAudiences();
  }, []);

  const loadAudiences = async () => {
    setIsLoadingAudiences(true);
    try {
      const res = await fetch('/api/marketing/audiences');
      const data = await res.json();
      if (data.audiences) setAudiences(data.audiences);
    } catch {
      toast.error('Failed to load audiences');
    } finally {
      setIsLoadingAudiences(false);
    }
  };

  const selectTemplate = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setSubject(template.defaultSubject);
    setHtmlContent(template.html);
  };

  const handleSaveDraft = async () => {
    if (!subject || !htmlContent) {
      toast.error('Subject and content are required');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience_id: selectedAudience || null,
          subject,
          template_type: selectedTemplate?.id || 'custom',
          html_content: htmlContent,
          action: 'save',
        }),
      });

      const data = await res.json();
      if (data.campaign) {
        toast.success('Campaign saved as draft');
      } else {
        toast.error(data.error || 'Failed to save campaign');
      }
    } catch {
      toast.error('Failed to save campaign');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = async () => {
    if (!selectedAudience) {
      toast.error('Please select an audience');
      return;
    }
    if (!subject || !htmlContent) {
      toast.error('Subject and content are required');
      return;
    }

    const audience = audiences.find(a => a.id === selectedAudience);
    if (!confirm(`Send this campaign to ${audience?.contact_count || 0} contacts in "${audience?.name}"?`)) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience_id: selectedAudience,
          subject,
          template_type: selectedTemplate?.id || 'custom',
          html_content: htmlContent,
          action: 'send',
        }),
      });

      const data = await res.json();
      if (data.campaign) {
        toast.success('Campaign sent successfully!');
        // Reset form
        setSubject('');
        setHtmlContent('');
        setSelectedTemplate(null);
        setSelectedAudience('');
      } else {
        toast.error(data.error || 'Failed to send campaign');
      }
    } catch {
      toast.error('Failed to send campaign');
    } finally {
      setIsSending(false);
    }
  };

  const selectedAudienceData = audiences.find(a => a.id === selectedAudience);

  return (
    <div className="space-y-6">
      {/* Step 1: Select Template */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">1. Choose a Template</h2>
        <p className="text-sm text-gray-500 mb-4">Select a pre-built template or start from scratch</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CAMPAIGN_TEMPLATES.map((template) => (
            <Card
              key={template.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate?.id === template.id
                  ? 'border-luxury-gold ring-2 ring-luxury-gold/20'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => selectTemplate(template)}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{template.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
              </div>
              <p className="text-xs text-gray-500">{template.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Step 2: Select Audience */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">2. Select Audience</h2>
        <p className="text-sm text-gray-500 mb-4">Choose who will receive this campaign</p>

        {isLoadingAudiences ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading audiences...
          </div>
        ) : audiences.length === 0 ? (
          <Card className="p-4 text-center">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No audiences yet. Create one in the Audiences tab first.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {audiences.map((audience) => (
              <Card
                key={audience.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedAudience === audience.id
                    ? 'border-luxury-gold ring-2 ring-luxury-gold/20'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedAudience(audience.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">{audience.name}</h3>
                  <span className="text-luxury-gold font-bold text-sm">{audience.contact_count}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Step 3: Customise */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">3. Customise & Send</h2>
        <p className="text-sm text-gray-500 mb-4">Edit the subject line and content, then send or save</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Subject Line</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="text-base"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Email Content (HTML)</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
            </div>
            
            {showPreview ? (
              <Card className="p-0 overflow-hidden">
                <div
                  className="p-4"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </Card>
            ) : (
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Paste your HTML email content here..."
                className="w-full h-64 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:border-luxury-gold resize-y"
              />
            )}
          </div>

          {/* Summary */}
          {selectedAudienceData && subject && htmlContent && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                <Send className="w-4 h-4" />
                Ready to send to <strong>{selectedAudienceData.contact_count}</strong> contacts in "{selectedAudienceData.name}"
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving || !subject || !htmlContent}
              className="gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Save Draft
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || !selectedAudience || !subject || !htmlContent}
              className="gap-2 bg-luxury-gold hover:bg-luxury-gold/90 text-black"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

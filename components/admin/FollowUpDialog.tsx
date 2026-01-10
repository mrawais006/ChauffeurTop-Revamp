'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Mail, Phone, MessageSquare, Ban } from 'lucide-react';
import type { Quote } from '@/types/admin';

interface FollowUpDialogProps {
  quote: Quote | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (updates: Partial<Quote>) => void;
}

export function FollowUpDialog({ quote, open, onClose, onSuccess }: FollowUpDialogProps) {
  const [followUpType, setFollowUpType] = useState<'reminder' | 'discount' | 'personal' | 'call' | 'lost'>('reminder');
  const [customMessage, setCustomMessage] = useState('');
  const [discountValue, setDiscountValue] = useState('10');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [loading, setLoading] = useState(false);

  if (!quote) return null;

  const handleSendFollowUp = async () => {
    if (!quote.email && followUpType !== 'call' && followUpType !== 'lost') {
      toast.error('No email address available for this lead');
      return;
    }

    setLoading(true);

    try {
      // Generate new confirmation token for discount follow-ups
      let newConfirmationToken = quote.confirmation_token;
      let newQuotedPrice = quote.quoted_price;

      if (followUpType === 'discount' && quote.quoted_price) {
        newConfirmationToken = crypto.randomUUID();

        // Calculate new price with discount
        if (discountType === 'percentage') {
          newQuotedPrice = quote.quoted_price * (1 - parseFloat(discountValue) / 100);
        } else {
          newQuotedPrice = quote.quoted_price - parseFloat(discountValue);
        }
      }

      // Call the Edge Function to send follow-up
      const { error: emailError } = await supabase.functions.invoke('send-follow-up', {
        body: {
          lead: { ...quote, confirmation_token: newConfirmationToken },
          type: 'quote',
          followUpType,
          customMessage: followUpType === 'personal' ? customMessage : undefined,
          discount: followUpType === 'discount' ? {
            value: parseFloat(discountValue),
            type: discountType
          } : undefined
        }
      });

      if (emailError) throw emailError;

      // Log the activity
      const activityType = followUpType === 'reminder' ? 'reminder_sent'
        : followUpType === 'discount' ? 'discount_sent'
          : followUpType === 'personal' ? 'personal_email_sent'
            : followUpType === 'call' ? 'customer_called'
              : 'marked_lost';

      // Calculate discount details for activity log
      const discountDetails = followUpType === 'discount' && quote.quoted_price ? {
        value: parseFloat(discountValue),
        type: discountType,
        original_price: quote.quoted_price,
        discount_amount: discountType === 'percentage'
          ? (quote.quoted_price * parseFloat(discountValue) / 100)
          : parseFloat(discountValue),
        new_price: newQuotedPrice
      } : undefined;

      await supabase.from('quote_activities').insert({
        quote_id: quote.id,
        action_type: activityType as any,
        details: {
          followUpType,
          discount: discountDetails,
          customMessage: followUpType === 'personal' ? customMessage : undefined
        }
      });

      // Update quote in database
      const updateData: any = {
        last_follow_up_at: new Date().toISOString(),
        follow_up_count: (quote.follow_up_count || 0) + 1,
      };

      // For discount follow-ups, update price and token
      if (followUpType === 'discount') {
        updateData.quoted_price = newQuotedPrice;
        updateData.confirmation_token = newConfirmationToken;
        updateData.status = 'contacted'; // Reset to contacted with new offer
      }

      // For lost leads, update status
      if (followUpType === 'lost') {
        updateData.status = 'lost';
      }

      await supabase
        .from('quotes')
        .update(updateData)
        .eq('id', quote.id);

      toast.success(
        followUpType === 'call' ? 'Call logged successfully' :
          followUpType === 'lost' ? 'Lead marked as lost' :
            'Follow-up sent successfully'
      );

      // Pass the updates back to parent to update UI immediately
      const updates: Partial<Quote> = {
        last_follow_up_at: new Date().toISOString(),
        follow_up_count: (quote.follow_up_count || 0) + 1
      };

      if (followUpType === 'discount') {
        updates.quoted_price = newQuotedPrice;
        updates.confirmation_token = newConfirmationToken;
        updates.status = 'contacted';
      }

      if (followUpType === 'lost') {
        updates.status = 'lost';
      }

      onSuccess(updates);
      onClose();
    } catch (error: any) {
      console.error('Follow-up error:', error);
      toast.error(error.message || 'Failed to send follow-up');
    } finally {
      setLoading(false);
    }
  };

  const getFollowUpDescription = () => {
    switch (followUpType) {
      case 'reminder':
        return 'Send a friendly reminder email about their pending quote.';
      case 'discount':
        return 'Offer a special discount to encourage booking.';
      case 'personal':
        return 'Send a personalized message to the customer.';
      case 'call':
        return 'Log that you called the customer (no email will be sent).';
      case 'lost':
        return 'Mark this lead as lost (no longer pursuing).';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Follow Up with {quote.name}</DialogTitle>
          <DialogDescription className="text-gray-700">
            Choose how you'd like to follow up with this customer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Info */}
          <div className="bg-gray-100 p-4 rounded-lg space-y-2 border border-gray-300">
            <p className="text-sm text-gray-900"><strong className="text-gray-900">Email:</strong> {quote.email || 'Not provided'}</p>
            <p className="text-sm text-gray-900"><strong className="text-gray-900">Phone:</strong> {quote.phone || 'Not provided'}</p>
            <p className="text-sm text-gray-900"><strong className="text-gray-900">Date:</strong> {quote.date}</p>
            {quote.quoted_price && (
              <p className="text-sm text-gray-900"><strong className="text-gray-900">Quoted Price:</strong> ${quote.quoted_price.toFixed(2)}</p>
            )}
            {quote.follow_up_count && quote.follow_up_count > 0 && (
              <p className="text-sm text-orange-600 font-semibold">
                <strong>Previous Follow-ups:</strong> {quote.follow_up_count}
              </p>
            )}
          </div>

          {/* Follow-up Type Selection */}
          <div className="space-y-3">
            <Label className="text-base text-gray-900 font-semibold">Follow-up Action</Label>
            <RadioGroup value={followUpType} onValueChange={(value: any) => setFollowUpType(value)}>
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer bg-white">
                <RadioGroupItem value="reminder" id="reminder" />
                <Label htmlFor="reminder" className="flex-1 cursor-pointer text-gray-900">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Send Reminder</div>
                      <div className="text-xs text-gray-600">Gentle follow-up about their quote</div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer bg-white">
                <RadioGroupItem value="discount" id="discount" />
                <Label htmlFor="discount" className="flex-1 cursor-pointer text-gray-900">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Offer Discount</div>
                      <div className="text-xs text-gray-600">Send special pricing offer</div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer bg-white">
                <RadioGroupItem value="personal" id="personal" />
                <Label htmlFor="personal" className="flex-1 cursor-pointer text-gray-900">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Personal Message</div>
                      <div className="text-xs text-gray-600">Custom email message</div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer bg-white">
                <RadioGroupItem value="call" id="call" />
                <Label htmlFor="call" className="flex-1 cursor-pointer text-gray-900">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="font-medium text-gray-900">Log Phone Call</div>
                      <div className="text-xs text-gray-600">Record that you called them</div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer bg-white">
                <RadioGroupItem value="lost" id="lost" />
                <Label htmlFor="lost" className="flex-1 cursor-pointer text-gray-900">
                  <div className="flex items-center gap-2">
                    <Ban className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-medium text-gray-900">Mark as Lost</div>
                      <div className="text-xs text-gray-600">No longer pursuing this lead</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
            <p className="text-sm text-blue-900 font-medium">{getFollowUpDescription()}</p>
          </div>

          {/* Discount Options */}
          {followUpType === 'discount' && (
            <div className="space-y-4 p-4 border border-green-300 rounded-lg bg-green-50">
              <Label className="text-gray-900 font-semibold">Discount Details</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType" className="text-sm text-gray-900 font-semibold">Type</Label>
                  <RadioGroup value={discountType} onValueChange={(value: any) => setDiscountType(value)} className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage" className="cursor-pointer text-gray-900 font-medium">Percentage (%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed" className="cursor-pointer text-gray-900 font-medium">Fixed Amount ($)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="discountValue" className="text-sm text-gray-900 font-semibold">Value</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="10"
                    min="0"
                    className="mt-2 text-gray-900 bg-white border-gray-300 placeholder:text-gray-400"
                  />
                </div>
              </div>
              {quote.quoted_price && (
                <div className="bg-white p-3 rounded border border-gray-300">
                  <p className="text-sm text-gray-900">
                    <strong className="text-gray-900">Original:</strong> ${quote.quoted_price.toFixed(2)}
                  </p>
                  <p className="text-sm text-green-700 font-semibold">
                    <strong>New Price:</strong> $
                    {discountType === 'percentage'
                      ? (quote.quoted_price * (1 - parseFloat(discountValue) / 100)).toFixed(2)
                      : (quote.quoted_price - parseFloat(discountValue)).toFixed(2)}
                  </p>
                </div>
              )}
              <div className="bg-amber-50 border border-amber-300 rounded p-2 mt-2">
                <p className="text-xs text-amber-900 font-medium">
                  <strong>Note:</strong> The quoted price will be permanently updated to the discounted price.
                  When the customer confirms, they will see and be charged the discounted amount.
                </p>
              </div>
            </div>
          )}

          {/* Personal Message */}
          {followUpType === 'personal' && (
            <div className="space-y-2">
              <Label htmlFor="customMessage" className="text-base text-gray-900 font-semibold">Your Message</Label>
              <Textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Write your personalized message here..."
                rows={6}
                className="resize-none text-gray-900 bg-white border-gray-300 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-600 font-medium">
                This message will be included in the email along with their quote details.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 text-gray-900 border-gray-300"
              disabled={loading}
            >
              <span className="text-gray-900">Cancel</span>
            </Button>
            <Button
              onClick={handleSendFollowUp}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading || (followUpType === 'personal' && !customMessage.trim())}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                  <span className="text-white">Processing...</span>
                </>
              ) : (
                <span className="text-white">
                  {followUpType === 'call' ? 'Log Call' :
                    followUpType === 'lost' ? 'Mark as Lost' :
                      'Send Follow-up'}
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


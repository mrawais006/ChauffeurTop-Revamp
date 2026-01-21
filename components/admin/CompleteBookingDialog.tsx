'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CheckCircle2, Loader2, Star } from 'lucide-react';
import type { Quote } from '@/types/admin';

interface CompleteBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Quote;
  onSuccess: (updates: Partial<Quote>) => void;
}

export function CompleteBookingDialog({ 
  open, 
  onOpenChange, 
  booking,
  onSuccess 
}: CompleteBookingDialogProps) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendReviewRequest, setSendReviewRequest] = useState(true); // Checked by default

  const handleComplete = async () => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('quotes')
        .update({ 
          status: 'completed',
          admin_comments: notes ? `Completed: ${notes}` : 'Booking completed'
        })
        .eq('id', booking.id);

      if (error) throw error;

      // Send review request if checkbox is checked
      if (sendReviewRequest && booking.email) {
        try {
          const { error: reviewError } = await supabase.functions.invoke('send-review-request', {
            body: {
              customerEmail: booking.email,
              customerName: booking.name,
              customerPhone: booking.phone,
              bookingDate: booking.date,
              vehicleType: booking.vehicle_name || booking.vehicle_type,
              pickupLocation: booking.pickup_location,
            },
          });

          if (reviewError) {
            console.error('Review request error:', reviewError);
            toast.warning('Booking completed but review request failed to send');
          } else {
            toast.success('Booking completed & review request sent! 🎉⭐');
          }
        } catch (reviewErr) {
          console.error('Error sending review request:', reviewErr);
          toast.warning('Booking completed but review request failed');
        }
      } else {
        toast.success('Booking marked as complete! 🎉');
      }

      onSuccess({ 
        status: 'completed',
        admin_comments: notes ? `Completed: ${notes}` : 'Booking completed'
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error('Failed to complete booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Complete Booking
          </DialogTitle>
          <DialogDescription>
            Mark {booking.name}'s booking as completed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-emerald-50 p-4 rounded-lg space-y-2 border border-emerald-300">
            <p className="text-sm text-gray-900"><strong className="text-gray-900">Customer:</strong> {booking.name}</p>
            <p className="text-sm text-gray-900"><strong className="text-gray-900">Date:</strong> {booking.date} at {booking.time}</p>
            <p className="text-sm text-gray-900"><strong className="text-gray-900">Price:</strong> ${booking.quoted_price?.toFixed(2) || '0.00'}</p>
          </div>

          <div>
            <Label htmlFor="completionNotes" className="text-gray-900 font-semibold">Completion Notes (Optional)</Label>
            <Textarea
              id="completionNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this completed booking..."
              rows={3}
              className="mt-2 text-gray-900"
            />
          </div>

          {/* Review Request Checkbox */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="sendReviewRequest"
                checked={sendReviewRequest}
                onCheckedChange={(checked) => setSendReviewRequest(checked === true)}
                disabled={!booking.email}
                className="mt-0.5 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
              />
              <div className="flex-1">
                <Label 
                  htmlFor="sendReviewRequest" 
                  className="text-sm font-semibold text-amber-900 cursor-pointer flex items-center gap-2"
                >
                  <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                  Send Google Review Request
                </Label>
                <p className="text-xs text-amber-700 mt-1">
                  {booking.email 
                    ? `An email will be sent to ${booking.email} requesting a Google review.`
                    : 'Cannot send - customer email not available.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              This booking will be moved to the History tab and marked as completed.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 w-4 mr-2" />
                  Mark as Complete
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


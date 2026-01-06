'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CheckCircle2, Loader2 } from 'lucide-react';
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

      toast.success('Booking marked as complete! 🎉');
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


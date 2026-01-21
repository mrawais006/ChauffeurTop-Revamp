'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Star, Loader2, Send, X, ExternalLink } from 'lucide-react';
import type { Quote } from '@/types/admin';

interface ReviewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Quote;
  onSuccess?: () => void;
}

export function ReviewRequestDialog({ 
  open, 
  onOpenChange, 
  booking,
  onSuccess 
}: ReviewRequestDialogProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSendReviewRequest = async () => {
    if (!booking.email) {
      toast.error('Customer email is required to send review request');
      return;
    }

    setIsSending(true);

    try {
      // Call the send-review-request edge function
      const { error } = await supabase.functions.invoke('send-review-request', {
        body: {
          customerEmail: booking.email,
          customerName: booking.name,
          customerPhone: booking.phone,
          bookingDate: booking.date,
          vehicleType: booking.vehicle_name || booking.vehicle_type,
          pickupLocation: booking.pickup_location,
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Review request sent successfully! 🌟', {
        description: `Email sent to ${booking.email}`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending review request:', error);
      toast.error('Failed to send review request', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
            </div>
            Request Google Review?
          </DialogTitle>
          <DialogDescription className="text-gray-600 pt-2">
            Would you like to send a review request to <span className="font-semibold text-gray-900">{booking.name}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Customer Info Card */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium text-gray-900">{booking.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{booking.email || 'Not provided'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Date:</span>
                <span className="font-medium text-gray-900">
                  {booking.date ? new Date(booking.date).toLocaleDateString('en-AU') : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* What will be sent */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Send className="w-4 h-4" />
              What will be sent:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Personalized thank you email
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Direct link to Google Reviews
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Professional review request
              </li>
            </ul>
          </div>

          {!booking.email && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              <strong>Note:</strong> Customer email is not available. Cannot send review request.
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={isSending}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Skip
            </Button>
            <Button
              onClick={handleSendReviewRequest}
              disabled={isSending || !booking.email}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Quote } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Bell, Mail, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface SendReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Quote;
  onSuccess: () => void;
}

export function SendReminderDialog({
  open,
  onOpenChange,
  booking,
  onSuccess,
}: SendReminderDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  // Format pickup time
  const pickupTime = booking.melbourne_datetime
    ? format(new Date(booking.melbourne_datetime), 'MMMM do, yyyy at h:mm a')
    : booking.date && booking.time
    ? `${format(new Date(booking.date), 'MMMM do, yyyy')} at ${booking.time}`
    : 'TBD';

  const defaultMessage = `Hi ${booking.name},\n\nThis is a friendly reminder about your upcoming chauffeur service.\n\nPickup Details:\n📅 ${pickupTime}\n📍 ${booking.pickup_location}\n🚗 ${booking.vehicle_type}\n\nOur driver will arrive 5-10 minutes before the scheduled time. Please be ready!\n\nIf you need to make any changes, please contact us immediately.\n\nThank you,\nChauffeur Top Melbourne`;

  const handleSendReminder = async () => {
    try {
      setIsSending(true);

      // Send the actual reminder via API
      const response = await fetch('/api/send-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking,
          customMessage: customMessage || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reminder');
      }

      // Update reminder count in database
      const newReminderCount = (booking.reminder_count || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('quotes')
        .update({
          reminder_count: newReminderCount,
          last_reminder_sent: new Date().toISOString(),
        })
        .eq('id', booking.id);

      if (updateError) {
        console.error('Error updating reminder count:', updateError);
      }

      // Show success message with details
      if (result.emailSent && result.smsSent) {
        toast.success('Reminder sent via Email & SMS! 📧📱');
      } else if (result.emailSent) {
        toast.success('Reminder sent via Email! 📧');
      } else if (result.smsSent) {
        toast.success('Reminder sent via SMS! 📱');
      } else {
        toast.warning('Reminder recorded but delivery may have failed');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" />
            Send Booking Reminder
          </DialogTitle>
          <DialogDescription>
            Send a reminder email to {booking.name} ({booking.email})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Booking Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Booking Details</h4>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Customer:</span> {booking.name}</p>
              <p><span className="font-medium">Pickup:</span> {pickupTime}</p>
              <p><span className="font-medium">Location:</span> {booking.pickup_location}</p>
              <p><span className="font-medium">Vehicle:</span> {booking.vehicle_type}</p>
              {booking.reminder_count && booking.reminder_count > 0 && (
                <p className="text-amber-600">
                  <span className="font-medium">Previous reminders sent:</span> {booking.reminder_count}
                </p>
              )}
            </div>
          </div>

          {/* Delivery Method Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full text-blue-700 text-xs font-medium">
                <Mail className="w-3 h-3" />
                Email
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full text-green-700 text-xs font-medium">
                <MessageSquare className="w-3 h-3" />
                SMS
              </div>
            </div>
            <span className="text-sm text-blue-900">
              Reminder will be sent via both channels
            </span>
          </div>

          {/* Message Editor */}
          <div className="space-y-2">
            <Label htmlFor="message">Custom Message (optional)</Label>
            <Textarea
              id="message"
              placeholder={defaultMessage}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Leave empty to use the default reminder message. Email will include professional formatting.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendReminder}
              disabled={isSending}
              className="gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  Send Reminder
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

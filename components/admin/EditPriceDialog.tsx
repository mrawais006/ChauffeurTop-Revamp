'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { DollarSign, Loader2 } from 'lucide-react';

interface EditPriceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  currentPrice: number | null;
  customerName: string;
  onSuccess: (updates: { quoted_price: number }) => void;
}

export function EditPriceDialog({ 
  open, 
  onOpenChange, 
  bookingId, 
  currentPrice, 
  customerName,
  onSuccess 
}: EditPriceDialogProps) {
  const [newPrice, setNewPrice] = useState<number>(currentPrice || 0);
  const [loading, setLoading] = useState(false);

  const handleUpdatePrice = async () => {
    if (newPrice <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('quotes')
        .update({ quoted_price: newPrice })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Price updated successfully');
      onSuccess({ quoted_price: newPrice });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error('Failed to update price');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-amber-600" />
            Edit Booking Price
          </DialogTitle>
          <DialogDescription>
            Update the quoted price for {customerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
            <p className="text-sm text-gray-700 font-medium">Current Price</p>
            <p className="text-2xl font-bold text-gray-900">
              ${currentPrice?.toFixed(2) || '0.00'}
            </p>
          </div>

          <div>
            <Label htmlFor="newPrice" className="text-gray-900 font-semibold">New Price ($)</Label>
            <Input
              id="newPrice"
              type="number"
              min="0"
              step="0.01"
              value={newPrice || ''}
              onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
              placeholder="Enter new price"
              className="text-lg mt-2 text-gray-900"
            />
          </div>

          {newPrice > 0 && newPrice !== currentPrice && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>Change:</strong> {newPrice > (currentPrice || 0) ? '+' : ''}
                ${(newPrice - (currentPrice || 0)).toFixed(2)}
              </p>
            </div>
          )}

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
              onClick={handleUpdatePrice}
              disabled={loading || newPrice <= 0 || newPrice === currentPrice}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Price'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


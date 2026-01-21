'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Send, Plus, Trash2, DollarSign, Percent, Tag, Zap, RefreshCw } from 'lucide-react';
import type { Quote, PriceItem } from '@/types/admin';

interface QuoteResponseDialogProps {
  quote: Quote | null;
  onClose: () => void;
  onSuccess: (updates: Partial<Quote>) => void;
}

export function QuoteResponseDialog({ quote, onClose, onSuccess }: QuoteResponseDialogProps) {
  const [basePrice, setBasePrice] = useState<number>(0);
  const [returnBasePrice, setReturnBasePrice] = useState<number>(0);
  const [additionalItems, setAdditionalItems] = useState<PriceItem[]>([]);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState('');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);

  if (!quote) return null;

  // Check if this is a return trip
  const isReturnTrip = useMemo(() => {
    return quote.destinations && 
      typeof quote.destinations === 'object' && 
      !Array.isArray(quote.destinations) &&
      (quote.destinations as any).type === 'return_trip';
  }, [quote.destinations]);

  const addPriceItem = () => {
    setAdditionalItems([...additionalItems, { description: '', amount: 0 }]);
  };

  const removePriceItem = (index: number) => {
    setAdditionalItems(additionalItems.filter((_, i) => i !== index));
  };

  const updatePriceItem = (index: number, field: keyof PriceItem, value: string | number) => {
    const updated = [...additionalItems];
    updated[index] = { ...updated[index], [field]: value };
    setAdditionalItems(updated);
  };

  // Calculate subtotal (before discount)
  const subtotal = useMemo(() => {
    const baseFares = isReturnTrip ? (basePrice + returnBasePrice) : basePrice;
    const additionalTotal = additionalItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    return baseFares + additionalTotal;
  }, [basePrice, returnBasePrice, additionalItems, isReturnTrip]);

  // Calculate discount amount
  const discountAmount = useMemo(() => {
    if (discountValue <= 0) return 0;
    if (discountType === 'percentage') {
      return (subtotal * discountValue) / 100;
    }
    return discountValue;
  }, [discountType, discountValue, subtotal]);

  // Calculate final total
  const totalPrice = subtotal - discountAmount;

  const handleSendQuote = async () => {
    if (!quote.email) {
      toast.error('Customer email is required to send quote');
      return;
    }

    if (basePrice <= 0) {
      toast.error('Please enter a valid base price');
      return;
    }

    if (isReturnTrip && returnBasePrice <= 0) {
      toast.error('Please enter a valid return base price');
      return;
    }

    setSending(true);

    try {
      // Generate unique confirmation token
      const confirmationToken = crypto.randomUUID();

      // Prepare price breakdown
      const priceBreakdown = {
        base_price: basePrice,
        return_base_price: isReturnTrip ? returnBasePrice : null,
        additional_items: additionalItems.filter(item => item.description && item.amount > 0),
        subtotal: subtotal,
        discount: discountValue > 0 ? {
          type: discountType,
          value: discountValue,
          amount: discountAmount,
          reason: discountReason || (isReturnTrip ? 'Return booking discount' : 'Special discount')
        } : null,
        total: totalPrice,
        notes: notes,
        is_return_trip: isReturnTrip
      };

      // Update quote in database with token
      const { error: updateError } = await supabase
        .from('quotes')
        .update({
          quoted_price: totalPrice,
          price_breakdown: priceBreakdown,
          quote_sent_at: new Date().toISOString(),
          status: 'contacted',
          confirmation_token: confirmationToken
        })
        .eq('id', quote.id);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error('Failed to save quote details. Please try again.');
      }

      // Log activity
      await supabase.from('quote_activities').insert({
        quote_id: quote.id,
        action_type: 'quote_sent',
        details: {
          price: totalPrice,
          discount: priceBreakdown.discount,
          sent_to: quote.email
        }
      });

      // Send email via Supabase Edge Function
      const { error: emailError } = await supabase.functions.invoke('send-quote-response', {
        body: {
          quote: { ...quote, confirmation_token: confirmationToken },
          priceBreakdown: priceBreakdown,
          type: 'quotes'
        }
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        toast.warning('Quote saved but email may be delayed. Customer will receive it shortly.');
      } else {
        toast.success('Quote sent successfully!');
      }

      // Pass the updates back to parent to update UI immediately
      onSuccess({
        quoted_price: totalPrice,
        price_breakdown: priceBreakdown,
        quote_sent_at: new Date().toISOString(),
        status: 'contacted',
        confirmation_token: confirmationToken
      });
      onClose();
    } catch (error) {
      console.error('Error sending quote:', error);
      toast.error('Failed to send quote. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={!!quote} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <DollarSign className="h-6 w-6 text-amber-600" />
            <span className="text-gray-900">Send Quote to {quote.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-300">
            <h3 className="font-semibold mb-2 text-amber-900">Customer Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-900">
              <p className="text-gray-900"><strong className="text-gray-900">Name:</strong> {quote.name}</p>
              <p className="text-gray-900"><strong className="text-gray-900">Phone:</strong> {quote.phone}</p>
              <p className="col-span-2 text-gray-900"><strong className="text-gray-900">Email:</strong> {quote.email || 'No email provided'}</p>
              <p className="text-gray-900"><strong className="text-gray-900">Vehicle:</strong> {quote.vehicle_name}</p>
              <p className="text-gray-900"><strong className="text-gray-900">Passengers:</strong> {quote.passengers}</p>
            </div>
          </div>

          {/* Return Trip Indicator */}
          {isReturnTrip && (
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
              <p className="text-sm font-semibold text-blue-900">
                🔄 Return Trip Detected - Please enter pricing for both journeys
              </p>
            </div>
          )}

          {/* Quick Pricing Buttons */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-amber-600" />
              <Label className="text-sm font-semibold text-gray-700">Quick Price Suggestions</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {[89, 120, 150, 180, 220, 280, 350, 450].map((price) => (
                <Button
                  key={price}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBasePrice(price)}
                  className={`${basePrice === price ? 'bg-amber-100 border-amber-500 text-amber-700' : 'hover:bg-amber-50 hover:border-amber-300'}`}
                >
                  ${price}
                </Button>
              ))}
            </div>
            {quote.quoted_price && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBasePrice(Number(quote.quoted_price))}
                  className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <RefreshCw className="h-3 h-3" />
                  Use Previous: ${Number(quote.quoted_price).toFixed(2)}
                </Button>
              </div>
            )}
          </div>

          {/* Base Price(s) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="basePrice" className="text-base font-semibold text-gray-900">
                {isReturnTrip ? 'Outbound Base Fare ($) *' : 'Base Fare ($) *'}
              </Label>
              <Input
                id="basePrice"
                type="number"
                min="0"
                step="0.01"
                value={basePrice || ''}
                onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                placeholder="Enter base fare"
                className="mt-2 text-lg text-gray-900 bg-white border-gray-300 placeholder:text-gray-400"
              />
              {/* Quick adjust buttons */}
              <div className="flex gap-1 mt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setBasePrice(Math.max(0, basePrice - 10))} className="text-xs">-$10</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setBasePrice(basePrice + 10)} className="text-xs">+$10</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setBasePrice(basePrice + 20)} className="text-xs">+$20</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setBasePrice(Math.round(basePrice / 10) * 10)} className="text-xs">Round</Button>
              </div>
            </div>

            {isReturnTrip && (
              <div>
                <Label htmlFor="returnBasePrice" className="text-base font-semibold text-gray-900">
                  Return Base Fare ($) *
                </Label>
                <Input
                  id="returnBasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={returnBasePrice || ''}
                  onChange={(e) => setReturnBasePrice(parseFloat(e.target.value) || 0)}
                  placeholder="Enter return fare"
                  className="mt-2 text-lg text-gray-900 bg-white border-gray-300 placeholder:text-gray-400"
                />
                {/* Quick adjust buttons for return */}
                <div className="flex gap-1 mt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setReturnBasePrice(Math.max(0, returnBasePrice - 10))} className="text-xs">-$10</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setReturnBasePrice(returnBasePrice + 10)} className="text-xs">+$10</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setReturnBasePrice(basePrice)} className="text-xs">Same as Outbound</Button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Items */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <Label className="text-base font-semibold text-gray-900">Additional Charges (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPriceItem}
                className="text-amber-600 border-amber-300 hover:bg-amber-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            {additionalItems.map((item, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <Input
                  placeholder="Description (e.g., Airport fee, Tolls)"
                  value={item.description}
                  onChange={(e) => updatePriceItem(index, 'description', e.target.value)}
                  className="flex-1 text-gray-900 bg-white border-gray-300 placeholder:text-gray-400"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Amount"
                  value={item.amount || ''}
                  onChange={(e) => updatePriceItem(index, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-32 text-gray-900 bg-white border-gray-300 placeholder:text-gray-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePriceItem(index)}
                  className="hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          {/* Discount Section */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-5 w-5 text-green-600" />
              <Label className="text-base font-semibold text-gray-900">Discount (Optional)</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="discountType" className="text-sm text-gray-900 font-medium">Type</Label>
                <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Percent className="h-4 w-4" />
                        Percentage
                      </div>
                    </SelectItem>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2 text-gray-900">
                        <DollarSign className="h-4 w-4" />
                        Fixed Amount
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discountValue" className="text-sm text-gray-900 font-medium">
                  {discountType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  step={discountType === 'percentage' ? '1' : '0.01'}
                  max={discountType === 'percentage' ? '100' : undefined}
                  value={discountValue || ''}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  placeholder={discountType === 'percentage' ? 'e.g., 10' : 'e.g., 50'}
                  className="mt-1 text-gray-900 bg-white border-gray-300 placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="discountReason" className="text-sm text-gray-900 font-medium">Reason (Optional)</Label>
                <Input
                  id="discountReason"
                  type="text"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  placeholder="e.g., Return booking"
                  className="mt-1 text-gray-900 bg-white border-gray-300 placeholder:text-gray-400"
                />
              </div>
            </div>

            {discountValue > 0 && (
              <div className="mt-3 p-3 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-sm text-green-900 font-medium">
                  <strong>Discount Applied:</strong> {discountType === 'percentage' ? `${discountValue}%` : `$${discountValue.toFixed(2)}`} = 
                  <span className="font-bold"> -${discountAmount.toFixed(2)}</span>
                </p>
              </div>
            )}
          </div>

          {/* Total Summary */}
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-5 rounded-lg border-2 border-amber-400 shadow-md space-y-2">
            {discountValue > 0 && (
              <>
                <div className="flex justify-between items-center text-amber-900">
                  <span className="text-base font-semibold">Subtotal:</span>
                  <span className="text-xl font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-green-700">
                  <span className="text-base font-semibold">Discount:</span>
                  <span className="text-xl font-semibold">-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-amber-300 pt-2"></div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-amber-900">Total Quote:</span>
              <span className="text-3xl font-bold text-amber-700">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Personal Message for Email */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Send className="h-4 w-4 text-blue-600" />
              <Label htmlFor="notes" className="text-base font-semibold text-gray-900">
                Personal Message (Included in Email)
              </Label>
            </div>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a personal touch to your quote email...&#10;&#10;Example: Thank you for choosing ChauffeurTop! I've applied a special discount for your return booking. Please don't hesitate to reach out if you have any questions."
              rows={4}
              className="mt-2 text-gray-900 bg-white border-gray-300 placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will appear at the top of the quote email before the price breakdown.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={sending}
              className="min-w-[100px] text-gray-900 border-gray-300"
            >
              <span className="text-gray-900">Cancel</span>
            </Button>
            <Button 
              onClick={handleSendQuote} 
              disabled={sending || !quote.email || basePrice <= 0 || (isReturnTrip && returnBasePrice <= 0)}
              className="min-w-[120px] bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Send className="h-4 w-4 mr-2 text-white" />
              <span className="text-white">{sending ? 'Sending...' : 'Send Quote'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


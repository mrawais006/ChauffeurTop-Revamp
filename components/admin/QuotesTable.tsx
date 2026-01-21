'use client';

import { useState, memo } from 'react';
import type { Quote } from '@/types/admin';
import QuoteRow from './QuoteRow';
import QuoteCard from './QuoteCard';
import QuoteDetailsDialog from './QuoteDetailsDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface QuotesTableProps {
  quotes: Quote[];
  showReminder?: boolean;
  onQuoteUpdate?: (quoteId: string, updates: Partial<Quote>) => void;
  onQuoteDelete?: (quoteId: string) => void;
}

function QuotesTable({ quotes, showReminder = false, onQuoteUpdate, onQuoteDelete }: QuotesTableProps) {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (quote) {
      setQuoteToDelete(quote);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!quoteToDelete) return;

    setIsDeleting(true);
    const deletedId = quoteToDelete.id;
    
    try {
      // Optimistically remove from UI immediately
      if (onQuoteDelete) {
        onQuoteDelete(deletedId);
      }
      
      // Delete from Supabase in background
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', deletedId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      toast.success('Quote deleted successfully');
      
    } catch (error: any) {
      console.error('Failed to delete quote:', error);
      toast.error('Failed to delete quote. Please try again.');
      // TODO: Could restore the item in the list if delete fails
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    }
  };

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No quotes found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-white border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Pickup Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote, index) => (
                <QuoteRow
                  key={quote.id}
                  quote={quote}
                  index={index}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteClick}
                  showReminder={showReminder}
                  onQuoteUpdate={onQuoteUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (hidden on desktop) */}
      <div className="md:hidden space-y-3">
        {quotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onViewDetails={() => handleViewDetails(quote)}
            onDelete={() => handleDeleteClick(quote.id)}
            onQuoteUpdate={onQuoteUpdate}
          />
        ))}
      </div>

      {/* Details Dialog */}
      <QuoteDetailsDialog
        quote={selectedQuote}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onSuccess={(updates) => {
          if (onQuoteUpdate && selectedQuote?.id && updates) {
            onQuoteUpdate(selectedQuote.id, updates);
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        itemName={quoteToDelete?.name}
        itemType="quote"
        isDeleting={isDeleting}
      />
    </>
  );
}

// Memoize to prevent unnecessary re-renders
// Only re-render when quotes array actually changes
export default memo(QuotesTable, (prevProps, nextProps) => {
  // Custom comparison: check if quotes array content has changed
  if (prevProps.quotes.length !== nextProps.quotes.length) return false;
  if (prevProps.showReminder !== nextProps.showReminder) return false;
  
  // Check if any quote in the array has changed
  for (let i = 0; i < prevProps.quotes.length; i++) {
    if (prevProps.quotes[i].id !== nextProps.quotes[i].id) return false;
    if (prevProps.quotes[i].status !== nextProps.quotes[i].status) return false;
    if (prevProps.quotes[i].quoted_price !== nextProps.quotes[i].quoted_price) return false;
    if (prevProps.quotes[i].follow_up_count !== nextProps.quotes[i].follow_up_count) return false;
    if (prevProps.quotes[i].last_follow_up_at !== nextProps.quotes[i].last_follow_up_at) return false;
  }
  
  return true; // Props are equal, skip re-render
});

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminHeader from '@/components/admin/AdminHeader';
import QuotesTable from '@/components/admin/QuotesTable';
import { ContactsTable } from '@/components/admin/ContactsTable';
import SearchBar from '@/components/admin/SearchBar';
import RevenueStats from '@/components/admin/RevenueStats';
import { fetchQuotes } from '@/lib/admin';
import { fetchContacts } from '@/lib/contacts';
import {
  getUpcomingBookings,
  getQuotes as getQuotesByStatus,
  getBookings,
  getHistory,
} from '@/lib/bookings';
import type { Quote, Contact } from '@/types/admin';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminPage() {
  const { user, signOut } = useAuth(true);
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // Controlled tab state

  // Load data
  useEffect(() => {
    loadQuotes();
    loadContacts();
  }, []);

  // Background polling for new data (silent updates without page refresh)
  useEffect(() => {
    // Poll every 30 seconds for new quotes and contacts
    const pollInterval = setInterval(async () => {
      console.log('🔄 [Background Poll] Silently checking for new data...');
      
      try {
        // Fetch latest data silently
        const [latestQuotes, latestContacts] = await Promise.all([
          fetchQuotes(),
          fetchContacts()
        ]);
        
        // Process quotes
        const processedQuotes = latestQuotes.map(quote => {
          if (!quote.timezone) {
            quote.timezone = 'Australia/Melbourne';
          }
          if (!quote.melbourne_datetime && quote.date && quote.time) {
            const dateStr = new Date(quote.date).toISOString().split('T')[0];
            quote.melbourne_datetime = `${dateStr}T${quote.time}`;
          }
          return quote;
        });
        
        // Check if there are new quotes
        const currentIds = new Set(allQuotes.map(q => q.id));
        const newQuotes = processedQuotes.filter(q => !currentIds.has(q.id));
        
        if (newQuotes.length > 0) {
          console.log(`✨ [Background Poll] Found ${newQuotes.length} new quote(s)!`);
          toast.success(`${newQuotes.length} new quote(s) received!`, {
            description: `From ${newQuotes[0].name}`,
            duration: 4000
          });
        }
        
        // Update state silently (this won't change the active tab)
        setAllQuotes(processedQuotes);
        setContacts(latestContacts);
        
        console.log('✅ [Background Poll] Data updated silently');
      } catch (error) {
        console.error('❌ [Background Poll] Error:', error);
        // Silently fail - don't show error to user
      }
    }, 10000); // Every 30 seconds
    
    return () => clearInterval(pollInterval);
  }, [allQuotes]); // Depend on allQuotes to check for new items

  // Set up Supabase Realtime subscriptions for live updates
  // DISABLED - Using polling instead (see auto-refresh above)
  useEffect(() => {
    const USE_REALTIME = false; // Set to true if you enable Realtime on Supabase
    
    if (!USE_REALTIME) {
      console.log('ℹ️ [Info] Realtime disabled - using 15-second auto-refresh instead');
      return; // Skip Realtime setup
    }
    
    // Realtime code below (only runs if USE_REALTIME = true)
    console.log('🔌 [Realtime] Setting up live subscriptions...');
    
    // Subscribe to quotes table changes
    const quotesSubscription = supabase
      .channel('quotes-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quotes'
        },
        (payload) => {
          console.log('🎉 [Realtime] New quote INSERT event received!');
          console.log('📦 [Realtime] Payload:', payload);
          console.log('📝 [Realtime] New quote data:', payload.new);
          
          const newQuote = payload.new as Quote;
          
          // Process the new quote (add timezone info if missing)
          if (!newQuote.timezone) {
            newQuote.timezone = 'Australia/Melbourne';
          }
          if (!newQuote.melbourne_datetime && newQuote.date && newQuote.time) {
            const dateStr = new Date(newQuote.date).toISOString().split('T')[0];
            newQuote.melbourne_datetime = `${dateStr}T${newQuote.time}`;
          }
          
          // Add the new quote to the top of the list
          setAllQuotes(prevQuotes => {
            console.log('📊 [State Update] Previous quote count:', prevQuotes.length);
            console.log('📊 [State Update] Adding new quote to top...');
            const updated = [newQuote, ...prevQuotes];
            console.log('📊 [State Update] New quote count:', updated.length);
            return updated;
          });
          
          // Show a toast notification
          toast.success(`New quote from ${newQuote.name}! 🎉`, {
            description: `${newQuote.service_type || 'Quote'} - ${newQuote.vehicle_type}`
          });
          
          console.log('✅ [Realtime] Quote added to state successfully!');
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quotes'
        },
        (payload) => {
          console.log('🔄 [Realtime] Quote UPDATE event received!');
          console.log('📦 [Realtime] Update payload:', payload);
          console.log('📝 [Realtime] Updated quote data:', payload.new);
          
          const updatedQuote = payload.new as Quote;
          console.log('🆔 [Realtime] Updating quote ID:', updatedQuote.id);
          console.log('💰 [Realtime] New quoted_price:', updatedQuote.quoted_price);
          console.log('📊 [Realtime] New status:', updatedQuote.status);
          
          // Process the updated quote
          if (!updatedQuote.timezone) {
            updatedQuote.timezone = 'Australia/Melbourne';
          }
          if (!updatedQuote.melbourne_datetime && updatedQuote.date && updatedQuote.time) {
            const dateStr = new Date(updatedQuote.date).toISOString().split('T')[0];
            updatedQuote.melbourne_datetime = `${dateStr}T${updatedQuote.time}`;
          }
          
          // Update the quote in state
          setAllQuotes(prevQuotes => {
            console.log('📊 [State Update] Total quotes before update:', prevQuotes.length);
            const foundQuote = prevQuotes.find(q => q.id === updatedQuote.id);
            console.log('🔍 [State Update] Found quote to update:', foundQuote ? 'YES' : 'NO');
            
            if (foundQuote) {
              console.log('🔍 [State Update] Old quoted_price:', foundQuote.quoted_price);
              console.log('🔍 [State Update] Old status:', foundQuote.status);
            }
            
            const updated = prevQuotes.map(quote =>
              quote.id === updatedQuote.id ? updatedQuote : quote
            );
            
            console.log('📊 [State Update] Total quotes after update:', updated.length);
            console.log('✅ [Realtime] Quote state updated successfully!');
            
            return updated;
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'quotes'
        },
        (payload) => {
          console.log('[Realtime] Quote deleted:', payload.old);
          const deletedQuoteId = (payload.old as any).id;
          
          // Remove the quote from state
          setAllQuotes(prevQuotes =>
            prevQuotes.filter(quote => quote.id !== deletedQuoteId)
          );
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ [Realtime] Quotes subscription: CONNECTED');
          toast.success('Real-time updates connected! 🎉', {
            description: 'You will see new quotes instantly',
            duration: 3000
          });
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ [Realtime] Quotes subscription ERROR:', err);
          toast.error('Real-time connection failed', {
            description: 'Please enable Realtime in Supabase Dashboard'
          });
        } else if (status === 'TIMED_OUT') {
          console.warn('⚠️ [Realtime] Quotes subscription TIMED OUT');
          toast.warning('Real-time connection timeout', {
            description: 'Check your internet connection'
          });
        } else {
          console.log('[Realtime] Quotes subscription status:', status);
        }
      });

    // Subscribe to contacts table changes
    const contactsSubscription = supabase
      .channel('contacts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contacts'
        },
        (payload) => {
          console.log('[Realtime] New contact received:', payload.new);
          const newContact = payload.new as Contact;
          
          // Add the new contact to the top of the list
          setContacts(prevContacts => [newContact, ...prevContacts]);
          
          // Show a toast notification
          toast.success(`New contact from ${newContact.name}! 📧`, {
            description: newContact.email
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contacts'
        },
        (payload) => {
          console.log('[Realtime] Contact updated:', payload.new);
          const updatedContact = payload.new as Contact;
          
          // Update the contact in state
          setContacts(prevContacts =>
            prevContacts.map(contact =>
              contact.id === updatedContact.id ? updatedContact : contact
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'contacts'
        },
        (payload) => {
          console.log('[Realtime] Contact deleted:', payload.old);
          const deletedContactId = (payload.old as any).id;
          
          // Remove the contact from state
          setContacts(prevContacts =>
            prevContacts.filter(contact => contact.id !== deletedContactId)
          );
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ [Realtime] Contacts subscription: CONNECTED');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ [Realtime] Contacts subscription ERROR:', err);
        } else if (status === 'TIMED_OUT') {
          console.warn('⚠️ [Realtime] Contacts subscription TIMED OUT');
        } else {
          console.log('[Realtime] Contacts subscription status:', status);
        }
      });

    // Cleanup subscriptions on unmount
    return () => {
      console.log('[Realtime] Cleaning up subscriptions');
      supabase.removeChannel(quotesSubscription);
      supabase.removeChannel(contactsSubscription);
    };
  }, []);

  const loadQuotes = async () => {
    try {
      setIsLoadingQuotes(true);
      const data = await fetchQuotes();
      
      // Process quotes - add timezone info for older records
      const processedQuotes = data.map(quote => {
        if (!quote.timezone) {
          quote.timezone = 'Australia/Melbourne';
        }
        if (!quote.melbourne_datetime && quote.date && quote.time) {
          const dateStr = new Date(quote.date).toISOString().split('T')[0];
          quote.melbourne_datetime = `${dateStr}T${quote.time}`;
        }
        return quote;
      });
      
      setAllQuotes(processedQuotes);
    } catch (error) {
      console.error('[Admin] Error loading quotes:', error);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  const loadContacts = async () => {
    try {
      setIsLoadingContacts(true);
      const data = await fetchContacts();
      setContacts(data);
    } catch (error) {
      console.error('[Admin] Error loading contacts:', error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleRefresh = async () => {
    console.log('🔄 [Manual Refresh] Refreshing data...');
    await Promise.all([loadQuotes(), loadContacts()]);
    console.log('✅ [Manual Refresh] Data refreshed successfully');
    toast.success('Data refreshed!', { duration: 2000 });
  };

  // Update a specific quote without reloading all data
  // This enables instant UI updates without page refresh
  const updateQuoteInState = (quoteId: string, updates: Partial<Quote>) => {
    console.log('🔄 [Optimistic Update] Updating quote:', quoteId);
    console.log('📝 [Optimistic Update] Updates:', updates);
    
    setAllQuotes(prevQuotes => {
      const quoteIndex = prevQuotes.findIndex(q => q.id === quoteId);
      
      if (quoteIndex === -1) {
        console.warn('⚠️ [Optimistic Update] Quote not found:', quoteId);
        return prevQuotes;
      }
      
      const oldQuote = prevQuotes[quoteIndex];
      const updatedQuote = { ...oldQuote, ...updates };
      
      console.log('✅ [Optimistic Update] Found quote, applying updates');
      console.log('📊 [Optimistic Update] Old:', {
        status: oldQuote.status,
        quoted_price: oldQuote.quoted_price
      });
      console.log('📊 [Optimistic Update] New:', {
        status: updatedQuote.status,
        quoted_price: updatedQuote.quoted_price
      });
      
      // Create new array with updated quote
      // This ensures React detects the change and re-renders
      const newQuotes = [...prevQuotes];
      newQuotes[quoteIndex] = updatedQuote;
      
      console.log('✅ [Optimistic Update] State updated - UI will refresh instantly');
      return newQuotes;
    });
  };

  // Delete a quote from state immediately (optimistic delete)
  const deleteQuoteFromState = (quoteId: string) => {
    console.log('🗑️ [Optimistic Delete] Removing quote:', quoteId);
    setAllQuotes(prevQuotes => {
      const filtered = prevQuotes.filter(q => q.id !== quoteId);
      console.log('✅ [Optimistic Delete] Quote removed from UI instantly');
      console.log(`📊 [Optimistic Delete] Quote count: ${prevQuotes.length} → ${filtered.length}`);
      return filtered;
    });
  };

  // Update a specific contact without reloading all data
  const updateContactInState = (contactId: string, updates: Partial<Contact>) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, ...updates }
          : contact
      )
    );
  };

  // Delete a contact from state immediately (optimistic delete)
  const deleteContactFromState = (contactId: string) => {
    console.log('🗑️ [Optimistic Delete] Removing contact:', contactId);
    setContacts(prevContacts => {
      const filtered = prevContacts.filter(c => c.id !== contactId);
      console.log('✅ [Optimistic Delete] Contact removed from UI instantly');
      return filtered;
    });
  };

  // Filter quotes by search query
  const filteredQuotes = useMemo(() => {
    if (!searchQuery.trim()) return allQuotes;
    const query = searchQuery.toLowerCase().trim();
    return allQuotes.filter(q => 
      q.name?.toLowerCase().includes(query) ||
      q.email?.toLowerCase().includes(query) ||
      q.phone?.toLowerCase().includes(query)
    );
  }, [allQuotes, searchQuery]);

  // Get different quote groups
  const upcomingBookings = useMemo(() => getUpcomingBookings(filteredQuotes), [filteredQuotes]);
  const quotes = useMemo(() => getQuotesByStatus(filteredQuotes), [filteredQuotes]);
  const bookings = useMemo(() => getBookings(filteredQuotes), [filteredQuotes]);
  const history = useMemo(() => getHistory(filteredQuotes), [filteredQuotes]);

  // Filter contacts
  const filteredContacts = useMemo(() => {
    if (!contactSearchQuery.trim()) return contacts;
    const query = contactSearchQuery.toLowerCase().trim();
    return contacts.filter(c =>
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone?.toLowerCase().includes(query)
    );
  }, [contacts, contactSearchQuery]);


  if (isLoadingQuotes && isLoadingContacts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-8xl mx-auto px-6">
          <AdminHeader
            userEmail={user?.email || null}
            onLogout={signOut}
            onRefresh={handleRefresh}
          />

          {/* Revenue Stats */}
          <RevenueStats quotes={allQuotes} />

          {/* Conditional Search Bar - Changes based on active tab */}
          <div className="mb-6">
            {activeTab === 'contacts' ? (
              <SearchBar
                value={contactSearchQuery}
                onChange={setContactSearchQuery}
                placeholder="Search contacts by name, email, or phone..."
              />
            ) : (
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search quotes/bookings by name, phone, or email..."
              />
            )}
          </div>

          {/* Tabs - Controlled state to preserve active tab during updates */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full bg-gray-50 p-2 rounded-xl h-auto gap-2">
              <TabsTrigger
                value="upcoming"
                className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm rounded-lg bg-gray-100 text-gray-600 data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
              >
                <span className="text-2xl md:text-xl md:mb-1">🚗</span>
                <span className="hidden md:block font-medium">Upcoming</span>
                <span className="hidden md:block text-[10px] opacity-70">({upcomingBookings.length})</span>
                <span className="md:hidden text-[10px] mt-1 opacity-70">({upcomingBookings.length})</span>
              </TabsTrigger>
              
              <TabsTrigger
                value="quotes"
                className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm rounded-lg bg-gray-100 text-gray-600 data-[state=active]:bg-slate-800 data-[state=active]:text-white transition-all"
              >
                <span className="text-2xl md:text-xl md:mb-1">📝</span>
                <span className="hidden md:block font-medium">Quotes</span>
                <span className="hidden md:block text-[10px] opacity-70">({quotes.length})</span>
                <span className="md:hidden text-[10px] mt-1 opacity-70">({quotes.length})</span>
              </TabsTrigger>
              
              <TabsTrigger
                value="bookings"
                className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm rounded-lg bg-gray-100 text-gray-600 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all"
              >
                <span className="text-2xl md:text-xl md:mb-1">✅</span>
                <span className="hidden md:block font-medium">Bookings</span>
                <span className="hidden md:block text-[10px] opacity-70">({bookings.length})</span>
                <span className="md:hidden text-[10px] mt-1 opacity-70">({bookings.length})</span>
              </TabsTrigger>
              
              <TabsTrigger
                value="history"
                className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm rounded-lg bg-gray-100 text-gray-600 data-[state=active]:bg-slate-700 data-[state=active]:text-white transition-all"
              >
                <span className="text-2xl md:text-xl md:mb-1">📋</span>
                <span className="hidden md:block font-medium">History</span>
                <span className="hidden md:block text-[10px] opacity-70">({history.length})</span>
                <span className="md:hidden text-[10px] mt-1 opacity-70">({history.length})</span>
              </TabsTrigger>
              
              <TabsTrigger
                value="contacts"
                className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm rounded-lg bg-gray-100 text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                <span className="text-2xl md:text-xl md:mb-1">💬</span>
                <span className="hidden md:block font-medium">Contacts</span>
                <span className="hidden md:block text-[10px] opacity-70">({filteredContacts.length})</span>
                <span className="md:hidden text-[10px] mt-1 opacity-70">({filteredContacts.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Tab */}
            <TabsContent value="upcoming">
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <span className="text-xl">📅</span>
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Bookings within the next 24 hours.
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Send reminders to customers before their pickup.
                  </p>
                </div>
              </div>
              <Card className="p-6">
                {isLoadingQuotes ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <QuotesTable 
                    quotes={upcomingBookings} 
                    onQuoteUpdate={updateQuoteInState}
                    onQuoteDelete={deleteQuoteFromState}
                    showReminder={true}
                  />
                )}
              </Card>
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes">
              <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                <span className="text-xl">📝</span>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Pending quotes (not yet confirmed).
                  </p>
                  <p className="text-xs text-slate-700 mt-1">
                    Send quotes, follow-ups, or convert to bookings.
                  </p>
                </div>
              </div>
              <Card className="p-6">
                {isLoadingQuotes ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <QuotesTable quotes={quotes} onQuoteUpdate={updateQuoteInState} onQuoteDelete={deleteQuoteFromState} />
                )}
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Confirmed bookings sorted by pickup date (soonest first).
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Manage confirmed reservations and send customer reminders.
                  </p>
                </div>
              </div>
              <Card className="p-6">
                {isLoadingQuotes ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <QuotesTable quotes={bookings} onQuoteUpdate={updateQuoteInState} onQuoteDelete={deleteQuoteFromState} />
                )}
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Completed and cancelled bookings (most recent first).
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    Review past trips and archived reservations.
                  </p>
                </div>
              </div>
              <Card className="p-6">
                {isLoadingQuotes ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <QuotesTable quotes={history} onQuoteUpdate={updateQuoteInState} onQuoteDelete={deleteQuoteFromState} />
                )}
              </Card>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <span className="text-xl">💬</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Contact form submissions and inquiries.
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Respond to customer messages and questions.
                  </p>
                </div>
              </div>
              <Card className="p-6">
                {isLoadingContacts ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ContactsTable contacts={filteredContacts} onContactUpdate={updateContactInState} onContactDelete={deleteContactFromState} />
                )}
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </>
  );
}

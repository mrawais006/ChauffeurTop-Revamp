'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

// Force dynamic rendering - don't pre-render this page at build time
export const dynamic = 'force-dynamic';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { BlogsTable } from '@/components/admin/BlogsTable';
import { BlogEditor } from '@/components/admin/BlogEditor';

export default function AdminPage() {
  const { user, signOut } = useAuth(true);
  
  // View State (Sidebar)
  const [view, setView] = useState<'bookings' | 'blogs' | 'blog-editor'>('bookings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Enforce Editor Role
  useEffect(() => {
    if (user?.role === 'editor' && view === 'bookings') {
      setView('blogs');
    }
  }, [user, view]);

  // Existing Dashboard State
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // Inner tabs for Bookings view

  // Load data - Only if NOT editor
  useEffect(() => {
    if (user?.role !== 'editor') {
      loadQuotes();
      loadContacts();
    } else {
        setIsLoadingQuotes(false);
        setIsLoadingContacts(false);
    }
  }, [user]);

  // Background polling for new data (silent updates without page refresh)
  useEffect(() => {
    // Poll every 30 seconds for new quotes and contacts
    const pollInterval = setInterval(async () => {
      // Only poll if we are viewing bookings to save resources AND user is not editor
      if (view !== 'bookings' || user?.role === 'editor') return;

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
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(pollInterval);
  }, [allQuotes, view]); // Depend on allQuotes to check for new items


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
    if (view === 'bookings') {
       await Promise.all([loadQuotes(), loadContacts()]);
       console.log('✅ [Manual Refresh] Data refreshed successfully');
       toast.success('Data refreshed!', { duration: 2000 });
    }
  };

  // Update a specific quote without reloading all data
  // This enables instant UI updates without page refresh
  const updateQuoteInState = (quoteId: string, updates: Partial<Quote>) => {
    // ... logic remains same ...
    setAllQuotes(prevQuotes => {
       const idx = prevQuotes.findIndex(q => q.id === quoteId);
       if (idx === -1) return prevQuotes;
       const newArr = [...prevQuotes];
       newArr[idx] = { ...newArr[idx], ...updates };
       return newArr;
    });
  };

  // Delete a quote from state immediately (optimistic delete)
  const deleteQuoteFromState = (quoteId: string) => {
    setAllQuotes(prevQuotes => prevQuotes.filter(q => q.id !== quoteId));
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
    setContacts(prevContacts => {
      const filtered = prevContacts.filter(c => c.id !== contactId);
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


  if (isLoadingQuotes && isLoadingContacts && view === 'bookings') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar 
        activeTab={view === 'blog-editor' ? 'blogs' : view} 
        onTabChange={(v) => {
           if (v === 'blogs') {
             setSelectedBlogId(null);
           }
           setView(v as any);
        }} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:pl-64 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
          
          <AdminHeader
            userEmail={user?.email || null}
            onLogout={signOut}
            onRefresh={handleRefresh}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />

          {/* BOOKINGS VIEW */}
          <div className={view === 'bookings' ? 'block' : 'hidden'}>
            
            {/* Revenue Stats */}
            <div className="flex justify-end mb-6">
               <Button 
                  onClick={() => setView('blogs')}
                  variant="outline" 
                  className="gap-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black"
                >
                  <span className="text-xl">📰</span>
                  Manage Blogs
               </Button>
            </div>
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
              <TabsList className="grid grid-cols-5 w-full bg-gray-50 p-2 rounded-xl h-auto gap-2 overflow-x-auto">
                 {/* ... Tabs Triggers (preserved) ... */}
                  <TabsTrigger
                    value="upcoming"
                    className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm rounded-lg bg-gray-100 text-gray-600 data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all min-w-[80px]"
                  >
                    <span className="text-2xl md:text-xl md:mb-1">🚗</span>
                    <span className="hidden md:block font-medium">Upcoming</span>
                    <span className="text-[10px] md:text-[10px] opacity-70 mt-1">({upcomingBookings.length})</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="quotes"
                    className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm rounded-lg bg-gray-100 text-gray-600 data-[state=active]:bg-slate-800 data-[state=active]:text-white transition-all min-w-[80px]"
                  >
                    <span className="text-2xl md:text-xl md:mb-1">📝</span>
                    <span className="hidden md:block font-medium">Quotes</span>
                    <span className="text-[10px] md:text-[10px] opacity-70 mt-1">({quotes.length})</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="bookings"
                    className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm rounded-lg bg-gray-100 text-gray-600 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all min-w-[80px]"
                  >
                    <span className="text-2xl md:text-xl md:mb-1">✅</span>
                    <span className="hidden md:block font-medium">Bookings</span>
                    <span className="text-[10px] md:text-[10px] opacity-70 mt-1">({bookings.length})</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="history"
                    className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm rounded-lg bg-gray-100 text-gray-600 data-[state=active]:bg-slate-700 data-[state=active]:text-white transition-all min-w-[80px]"
                  >
                    <span className="text-2xl md:text-xl md:mb-1">📋</span>
                    <span className="hidden md:block font-medium">History</span>
                    <span className="text-[10px] md:text-[10px] opacity-70 mt-1">({history.length})</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="contacts"
                    className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm rounded-lg bg-gray-100 text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all min-w-[80px]"
                  >
                    <span className="text-2xl md:text-xl md:mb-1">💬</span>
                    <span className="hidden md:block font-medium">Contacts</span>
                    <span className="text-[10px] md:text-[10px] opacity-70 mt-1">({filteredContacts.length})</span>
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
                    <p className="text-sm font-medium text-slate-900">Pending quotes (not yet confirmed).</p>
                    <p className="text-xs text-slate-700 mt-1">Send quotes, follow-ups, or convert to bookings.</p>
                  </div>
                </div>
                <Card className="p-6">
                  {isLoadingQuotes ? (
                     <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
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
                    <p className="text-sm font-medium text-green-900">Confirmed bookings sorted by pickup date.</p>
                    <p className="text-xs text-green-700 mt-1">Manage confirmed reservations.</p>
                  </div>
                </div>
                <Card className="p-6">
                  {isLoadingQuotes ? (
                     <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
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
                    <p className="text-sm font-medium text-gray-900">Completed and cancelled bookings.</p>
                  </div>
                </div>
                <Card className="p-6">
                   {isLoadingQuotes ? (
                     <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
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
                    <p className="text-sm font-medium text-blue-900">Contact form submissions.</p>
                  </div>
                </div>
                <Card className="p-6">
                  {isLoadingContacts ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
                  ) : (
                    <ContactsTable contacts={filteredContacts} onContactUpdate={updateContactInState} onContactDelete={deleteContactFromState} />
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* BLOGS VIEW */}
          {view === 'blogs' && (
            <div className="fade-in animate-in slide-in-from-bottom-2 duration-300">
              <BlogsTable 
                 onCreate={() => { setSelectedBlogId(null); setView('blog-editor'); }}
                 onEdit={(id) => { setSelectedBlogId(id); setView('blog-editor'); }}
              />
            </div>
          )}

          {/* BLOG EDITOR ACTIONS */}
          {view === 'blog-editor' && (
            <div className="fade-in animate-in slide-in-from-bottom-2 duration-300">
               <BlogEditor 
                  blogId={selectedBlogId} 
                  onBack={() => setView('blogs')} 
                  onSave={() => setView('blogs')} 
               />
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}

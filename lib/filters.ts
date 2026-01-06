import type { 
  Quote, 
  Contact, 
  QuoteFilters, 
  ContactFilters, 
  SortConfig 
} from '@/types/admin';

// Filter Quotes
export function filterQuotes(quotes: Quote[], filters: QuoteFilters): Quote[] {
  return quotes.filter(quote => {
    // Status filter
    if (filters.status !== 'all' && quote.status !== filters.status) {
      return false;
    }

    // Service type filter
    if (filters.serviceType !== 'all' && quote.service_type !== filters.serviceType) {
      return false;
    }

    // Vehicle type filter
    if (filters.vehicleType !== 'all' && quote.vehicle_type !== filters.vehicleType) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const quoteDate = new Date(quote.created_at);
      if (quoteDate < filters.dateFrom) return false;
    }
    if (filters.dateTo) {
      const quoteDate = new Date(quote.created_at);
      const endOfDay = new Date(filters.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      if (quoteDate > endOfDay) return false;
    }

    // Price range filter
    const price = quote.quoted_price || 0;
    if (filters.priceMin !== null && price < filters.priceMin) {
      return false;
    }
    if (filters.priceMax !== null && price > filters.priceMax) {
      return false;
    }

    return true;
  });
}

// Filter Contacts
export function filterContacts(contacts: Contact[], filters: ContactFilters): Contact[] {
  return contacts.filter(contact => {
    // Status filter
    if (filters.status !== 'all' && contact.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const contactDate = new Date(contact.created_at);
      if (contactDate < filters.dateFrom) return false;
    }
    if (filters.dateTo) {
      const contactDate = new Date(contact.created_at);
      const endOfDay = new Date(filters.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      if (contactDate > endOfDay) return false;
    }

    return true;
  });
}

// Sort Quotes
export function sortQuotes(quotes: Quote[], sortConfig: SortConfig): Quote[] {
  const sorted = [...quotes];
  
  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortConfig.field) {
      case 'date':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'name':
        comparison = (a.name || '').localeCompare(b.name || '');
        break;
      case 'price':
        comparison = (a.quoted_price || 0) - (b.quoted_price || 0);
        break;
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

// Sort Contacts
export function sortContacts(contacts: Contact[], sortConfig: SortConfig): Contact[] {
  const sorted = [...contacts];
  
  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortConfig.field) {
      case 'date':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'name':
        comparison = (a.name || '').localeCompare(b.name || '');
        break;
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

// Count active filters
export function countActiveQuoteFilters(filters: QuoteFilters): number {
  let count = 0;
  if (filters.status !== 'all') count++;
  if (filters.serviceType !== 'all') count++;
  if (filters.vehicleType !== 'all') count++;
  if (filters.dateFrom || filters.dateTo) count++;
  if (filters.priceMin !== null || filters.priceMax !== null) count++;
  return count;
}

export function countActiveContactFilters(filters: ContactFilters): number {
  let count = 0;
  if (filters.status !== 'all') count++;
  if (filters.dateFrom || filters.dateTo) count++;
  return count;
}

// Get default filters
export function getDefaultQuoteFilters(): QuoteFilters {
  return {
    status: 'all',
    serviceType: 'all',
    dateFrom: null,
    dateTo: null,
    priceMin: null,
    priceMax: null,
    vehicleType: 'all',
  };
}

export function getDefaultContactFilters(): ContactFilters {
  return {
    status: 'all',
    dateFrom: null,
    dateTo: null,
  };
}


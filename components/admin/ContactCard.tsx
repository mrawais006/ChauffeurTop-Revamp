'use client';

import { memo } from 'react';
import type { Contact } from '@/types/admin';
import { format } from 'date-fns';
import { Mail, Phone, Calendar } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onClick: () => void;
}

function ContactCard({ contact, onClick }: ContactCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateStr;
    }
  };

  const getCardBackground = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      case 'contacted': return 'bg-blue-50 border-blue-200';
      case 'resolved': return 'bg-green-50 border-green-200';
      case 'spam': return 'bg-red-50 border-red-200';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${getCardBackground(contact.status)}`}
    >
      {/* Date */}
      <div className="mb-3 pb-3 border-b border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Date:</p>
        <p className="text-sm font-semibold text-gray-900">{formatDate(contact.created_at)}</p>
      </div>

      {/* Name */}
      <div className="mb-2">
        <p className="text-base font-bold text-gray-900">{contact.name}</p>
      </div>

      {/* Email */}
      <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
        <Mail className="h-4 w-4" />
        <span className="truncate">{contact.email}</span>
      </div>

      {/* Phone */}
      {contact.phone && (
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{contact.phone}</span>
        </div>
      )}

      {/* Subject */}
      {contact.subject && (
        <div className="mb-2">
          <p className="text-xs text-gray-500">Subject:</p>
          <p className="text-sm text-gray-700 font-medium">{contact.subject}</p>
        </div>
      )}

      {/* Message Preview */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Message:</p>
        <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
      </div>

      {/* Status Badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        contact.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        contact.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
        contact.status === 'resolved' ? 'bg-green-100 text-green-800' :
        contact.status === 'spam' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {contact.status === 'pending' ? 'Pending' :
         contact.status === 'contacted' ? 'Contacted' :
         contact.status === 'resolved' ? 'Resolved' :
         contact.status === 'spam' ? 'Spam' :
         'Pending'}
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(ContactCard, (prevProps, nextProps) => {
  if (prevProps.contact.id !== nextProps.contact.id) return false;
  if (prevProps.contact.status !== nextProps.contact.status) return false;
  if (prevProps.contact.name !== nextProps.contact.name) return false;
  return true;
});


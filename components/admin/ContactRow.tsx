'use client';

import { useState } from 'react';
import type { Contact, ContactStatus } from '@/types/admin';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateContactStatus } from '@/lib/contacts';
import { toast } from 'sonner';

interface ContactRowProps {
  contact: Contact;
  onViewDetails: (contact: Contact) => void;
  onDelete?: (contactId: string) => void;
  onContactUpdate: (contactId: string, updates: Partial<Contact>) => void;
}

export function ContactRow({ 
  contact, 
  onViewDetails, 
  onDelete,
  onContactUpdate 
}: ContactRowProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = () => {
    try {
      const date = new Date(contact.created_at);
      const dateStr = format(date, 'dd/MM/yyyy');
      const timeStr = format(date, 'HH:mm');
      return `${dateStr}\n${timeStr}`;
    } catch {
      return contact.created_at;
    }
  };

  const truncateMessage = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    const previousStatus = contact.status;
    
    try {
      // Optimistically update in parent state immediately
      onContactUpdate(contact.id, { status: newStatus as ContactStatus });
      
      // Save to database in background
      await updateContactStatus(contact.id, newStatus as ContactStatus);
      toast.success('Status updated successfully');
      
    } catch (error) {
      // Revert on error
      onContactUpdate(contact.id, { status: previousStatus });
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: ContactStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300 shadow-sm';
      case 'spam':
        return 'bg-red-100 text-red-800 border-red-300 shadow-sm';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 shadow-sm';
    }
  };

  const getStatusLabel = (status: ContactStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'contacted':
        return 'Contacted';
      case 'resolved':
        return 'Resolved';
      case 'spam':
        return 'Spam';
      default:
        return 'Pending';
    }
  };

  return (
    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
      {/* Date */}
      <td className="px-4 py-4 text-sm text-gray-900 whitespace-pre-line">
        {formatDate()}
      </td>

      {/* Name */}
      <td className="px-4 py-4 text-sm">
        <div className="text-gray-900 font-medium">{contact.name}</div>
      </td>

      {/* Email */}
      <td className="px-4 py-4 text-sm">
        <div className="text-gray-900">{contact.email}</div>
      </td>

      {/* Subject */}
      <td className="px-4 py-4 text-sm">
        <div className="text-gray-900">{contact.subject || 'General Inquiry'}</div>
      </td>

      {/* Message */}
      <td className="px-4 py-4 text-sm">
        <div className="text-gray-600">{truncateMessage(contact.message)}</div>
      </td>

      {/* Status */}
      <td className="px-4 py-4 text-sm">
        <Select
          value={contact.status}
          onValueChange={handleStatusChange}
          disabled={isUpdating}
        >
          <SelectTrigger 
            className={`w-[130px] border-2 font-bold text-base px-4 py-2 ${getStatusColor(contact.status)}`}
          >
            <SelectValue className="font-bold">
              {getStatusLabel(contact.status)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">
              Pending
            </SelectItem>
            <SelectItem value="contacted">
              Contacted
            </SelectItem>
            <SelectItem value="resolved">
              Resolved
            </SelectItem>
            <SelectItem value="spam">
              Spam
            </SelectItem>
          </SelectContent>
        </Select>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(contact)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
          >
            View Details
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(contact.id)}
              className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

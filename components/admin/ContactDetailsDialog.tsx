'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Contact, ContactStatus } from '@/types/admin';
import { ContactStatusBadge } from './ContactStatusBadge';
import { format } from 'date-fns';
import { 
  Mail, 
  Phone, 
  User, 
  Clock, 
  Globe,
  MessageSquare,
  X,
  CheckCircle,
  AlertCircle,
  Send,
  Ban
} from 'lucide-react';

interface ContactDetailsDialogProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (contactId: string, status: ContactStatus) => Promise<void>;
}

export function ContactDetailsDialog({
  contact,
  isOpen,
  onClose,
  onStatusUpdate,
}: ContactDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!contact) return null;

  const handleStatusUpdate = async (status: ContactStatus) => {
    try {
      setIsUpdating(true);
      await onStatusUpdate(contact.id, status);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'EEEE, MMMM do, yyyy • h:mm a');
    } catch {
      return dateStr;
    }
  };

  const getStatusHeaderColor = () => {
    switch (contact.status) {
      case 'pending':
        return 'from-yellow-500 to-amber-500';
      case 'contacted':
        return 'from-blue-500 to-blue-600';
      case 'resolved':
        return 'from-green-500 to-emerald-500';
      case 'spam':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header with Dynamic Gradient */}
        <div className={`bg-gradient-to-r ${getStatusHeaderColor()} px-6 py-5 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <MessageSquare className="h-6 w-6" />
                Contact Details
              </DialogTitle>
              <p className="text-white/80 text-sm mt-1">
                {contact.subject || 'General Inquiry'}
              </p>
            </div>
            <ContactStatusBadge status={contact.status} />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {contact.status !== 'pending' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate('pending')}
                disabled={isUpdating}
                className="flex items-center gap-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              >
                <AlertCircle className="h-4 w-4" />
                Mark Pending
              </Button>
            )}
            {contact.status !== 'contacted' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate('contacted')}
                disabled={isUpdating}
                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Send className="h-4 w-4" />
                Mark Contacted
              </Button>
            )}
            {contact.status !== 'resolved' && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate('resolved')}
                disabled={isUpdating}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Resolved
              </Button>
            )}
            {contact.status !== 'spam' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate('spam')}
                disabled={isUpdating}
                className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                <Ban className="h-4 w-4" />
                Mark Spam
              </Button>
            )}
          </div>

          {/* Contact Information Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Name</span>
                  <p className="font-semibold text-gray-900 text-lg">{contact.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500 uppercase">Email</span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-semibold text-blue-600 hover:underline block truncate"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              {contact.phone && (
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase">Phone</span>
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-semibold text-green-600 hover:underline block"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Submitted */}
              <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Submitted</span>
                  <p className="font-semibold text-gray-900">
                    {format(new Date(contact.created_at), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(contact.created_at), 'h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timezone Information */}
          {(contact.user_timezone || contact.user_local_time || contact.melbourne_time) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Timezone Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {contact.user_timezone && (
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs text-gray-500">User Timezone</span>
                    <p className="font-medium text-gray-900">{contact.user_timezone}</p>
                  </div>
                )}
                {contact.user_local_time && (
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs text-gray-500">Local Time</span>
                    <p className="font-medium text-gray-900">{contact.user_local_time}</p>
                  </div>
                )}
                {contact.melbourne_time && (
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs text-gray-500">Melbourne Time</span>
                    <p className="font-medium text-gray-900">{contact.melbourne_time}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{contact.message}</p>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDateTime(contact.created_at)}</span>
            </div>
            <span className="text-gray-400">ID: {contact.id.slice(0, 8)}...</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg flex items-center justify-between">
          <div className="flex gap-2">
            <a 
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Mail className="h-4 w-4" />
              Send Email
            </a>
            {contact.phone && (
              <a 
                href={`tel:${contact.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

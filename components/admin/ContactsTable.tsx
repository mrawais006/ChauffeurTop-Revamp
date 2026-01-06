'use client';

import { useState, memo } from 'react';
import type { Contact, ContactStatus } from '@/types/admin';
import { ContactRow } from './ContactRow';
import ContactCard from './ContactCard';
import { ContactDetailsDialog } from './ContactDetailsDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { updateContactStatus } from '@/lib/contacts';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ContactsTableProps {
  contacts: Contact[];
  onContactUpdate: (contactId: string, updates: Partial<Contact>) => void;
  onContactDelete?: (contactId: string) => void;
}

function ContactsTableComponent({ contacts, onContactUpdate, onContactDelete }: ContactsTableProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = async (contactId: string, status: ContactStatus) => {
    // Optimistically update
    onContactUpdate(contactId, { status });
    
    // Save to database
    await updateContactStatus(contactId, status);
    setIsDialogOpen(false);
  };

  const handleDeleteClick = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setContactToDelete(contact);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;

    setIsDeleting(true);
    const deletedId = contactToDelete.id;
    
    try {
      // Optimistically remove from UI immediately
      if (onContactDelete) {
        onContactDelete(deletedId);
      }
      
      // Delete from Supabase in background
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', deletedId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      toast.success('Contact deleted successfully');
      
    } catch (error: any) {
      console.error('Failed to delete contact:', error);
      toast.error('Failed to delete contact. Please try again.');
      // TODO: Could restore the item in the list if delete fails
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No contacts found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-white border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Message
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
              {contacts.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteClick}
                  onContactUpdate={onContactUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (hidden on desktop) */}
      <div className="md:hidden space-y-3">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onClick={() => handleViewDetails(contact)}
          />
        ))}
      </div>

      <ContactDetailsDialog
        contact={selectedContact}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        itemName={contactToDelete?.name}
        itemType="contact"
        isDeleting={isDeleting}
      />
    </>
  );
}

// Memoize to prevent unnecessary re-renders
export const ContactsTable = memo(ContactsTableComponent, (prevProps, nextProps) => {
  // Re-render if contacts array length changed
  if (prevProps.contacts.length !== nextProps.contacts.length) return false;
  
  // Check if any contact in the array has changed
  for (let i = 0; i < prevProps.contacts.length; i++) {
    if (prevProps.contacts[i].id !== nextProps.contacts[i].id) return false;
    if (prevProps.contacts[i].status !== nextProps.contacts[i].status) return false;
    if (prevProps.contacts[i].name !== nextProps.contacts[i].name) return false;
  }
  
  return true; // Props are equal, skip re-render
});

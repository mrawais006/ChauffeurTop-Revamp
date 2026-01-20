'use client';

import type { ContactStatus } from '@/types/admin';

interface ContactStatusBadgeProps {
  status: ContactStatus;
}

export function ContactStatusBadge({ status }: ContactStatusBadgeProps) {
  const styles: Record<ContactStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    contacted: 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    spam: 'bg-red-100 text-red-800 border-red-200',
  };

  const labels: Record<ContactStatus, string> = {
    pending: 'Pending',
    contacted: 'Contacted',
    resolved: 'Resolved',
    spam: 'Spam',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}
    >
      {labels[status] || 'Pending'}
    </span>
  );
}


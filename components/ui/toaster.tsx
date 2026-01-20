'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      toastOptions={{
        classNames: {
          toast: 'bg-white border-gray-200',
          title: 'text-gray-900',
          description: 'text-gray-500',
          actionButton: 'bg-gray-900 text-white',
          cancelButton: 'bg-gray-100 text-gray-500',
          error: 'bg-red-50 border-red-200',
          success: 'bg-green-50 border-green-200',
          warning: 'bg-yellow-50 border-yellow-200',
          info: 'bg-blue-50 border-blue-200',
        },
      }}
    />
  );
}

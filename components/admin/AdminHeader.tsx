'use client';

import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw } from 'lucide-react';
import { RealtimeStatus } from './RealtimeStatus';

interface AdminHeaderProps {
  userEmail: string | null;
  onLogout: () => void;
  onRefresh?: () => void;
}

// Helper to extract first name from email
function getFirstName(email: string | null): string {
  if (!email) return 'Admin';
  
  // Extract the part before @
  const username = email.split('@')[0];
  
  // Convert to readable name (capitalize first letter, remove numbers)
  const name = username.replace(/[0-9]/g, '').replace(/[._-]/g, ' ');
  const words = name.split(' ').filter(word => word.length > 0);
  
  if (words.length > 0) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  
  return 'Admin';
}

export default function AdminHeader({ userEmail, onLogout, onRefresh }: AdminHeaderProps) {
  const firstName = getFirstName(userEmail);
  
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-amber-600">
            Hi, <span className="font-semibold">{firstName}</span>
          </p>
          <RealtimeStatus />
        </div>
      </div>
      
      <div className="flex gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2.5 text-amber-600 bg-white border border-amber-400 rounded-lg hover:bg-amber-50 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200"
            title="Refresh"
            aria-label="Refresh data"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
        
        <button
          onClick={onLogout}
          className="p-2.5 text-white bg-black border border-black rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all duration-200"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}


'use client';

import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw, Menu } from 'lucide-react';
import { RealtimeStatus } from './RealtimeStatus';

interface AdminHeaderProps {
  userEmail: string | null;
  onLogout: () => void;
  onRefresh?: () => void;
  onToggleSidebar?: () => void;
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

export default function AdminHeader({ userEmail, onLogout, onRefresh, onToggleSidebar }: AdminHeaderProps) {
  const firstName = getFirstName(userEmail);
  
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button variant="ghost" size="icon" className="lg:hidden text-black hover:bg-gray-100" onClick={onToggleSidebar}>
              <Menu className="w-6 h-6" />
            </Button>
          )}
          <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-gray-500">
            Welcome back, {userEmail?.split('@')[0] || 'Admin'}
          </p>
          <div className="hidden md:block h-4 w-px bg-gray-300"></div>
          <RealtimeStatus />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
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
    </header>
  );
}

'use client';

import { cn } from '@/lib/utils';
import { BookOpen, Calendar, Menu, X, Mail } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface AdminSidebarProps {
  activeTab: 'bookings' | 'blogs' | 'marketing';
  onTabChange: (tab: 'bookings' | 'blogs' | 'marketing') => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AdminSidebar({ activeTab, onTabChange, isOpen, setIsOpen }: AdminSidebarProps) {
  const { signOut, user } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 transform transition-transform duration-200 ease-in-out lg:translate-x-0 bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full bg-black/40 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold font-serif text-white">Admin Panel</h2>
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

  {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {/* Only show Bookings for Admin */}
            {user?.role !== 'editor' && (
            <Button
              variant={activeTab === 'bookings' ? 'gold' : 'ghost'}
              className={cn(
                  "w-full justify-start h-12 text-base font-medium transition-all duration-300",
                  activeTab === 'bookings' 
                    ? "bg-luxury-gold text-black hover:bg-white hover:text-black shadow-lg shadow-luxury-gold/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
              onClick={() => {
                onTabChange('bookings');
                setIsOpen(false);
              }}
            >
              <Calendar className={cn("w-5 h-5 mr-3", activeTab === 'bookings' ? "text-black" : "text-luxury-gold")} />
              Bookings
            </Button>
            )}

            <Button
              variant={activeTab === 'blogs' ? 'gold' : 'ghost'}
              className={cn(
                  "w-full justify-start h-12 text-base font-medium transition-all duration-300",
                  activeTab === 'blogs' 
                    ? "bg-luxury-gold text-black hover:bg-white hover:text-black shadow-lg shadow-luxury-gold/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
              onClick={() => {
                onTabChange('blogs');
                setIsOpen(false);
              }}
            >
              <BookOpen className={cn("w-5 h-5 mr-3", activeTab === 'blogs' ? "text-black" : "text-luxury-gold")} />
              Blogs
            </Button>

            {/* Marketing Tab - Only for Admin */}
            {user?.role !== 'editor' && (
            <Button
              variant={activeTab === 'marketing' ? 'gold' : 'ghost'}
              className={cn(
                  "w-full justify-start h-12 text-base font-medium transition-all duration-300",
                  activeTab === 'marketing' 
                    ? "bg-luxury-gold text-black hover:bg-white hover:text-black shadow-lg shadow-luxury-gold/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
              onClick={() => {
                onTabChange('marketing');
                setIsOpen(false);
              }}
            >
              <Mail className={cn("w-5 h-5 mr-3", activeTab === 'marketing' ? "text-black" : "text-luxury-gold")} />
              Marketing
            </Button>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <Button 
              variant="outline" 
              className="w-full border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/50 transition-colors"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

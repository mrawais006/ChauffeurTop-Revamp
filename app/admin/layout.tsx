import { Metadata } from 'next';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Admin Dashboard | ChauffeurTop Melbourne',
  description: 'ChauffeurTop Admin Portal - Manage bookings, quotes, and contacts',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        {children}
      </div>
    </ProtectedRoute>
  );
}





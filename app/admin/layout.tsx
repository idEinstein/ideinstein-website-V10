import { Metadata } from 'next';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminAuth from '@/components/admin/AdminAuth';

export const metadata: Metadata = {
  title: {
    template: '%s | IdEinstein Admin',
    default: 'Admin Dashboard | IdEinstein'
  },
  description: 'Administrative dashboard for IdEinstein website management',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation />
        <main className="pb-8">
          {children}
        </main>
      </div>
    </AdminAuth>
  );
}
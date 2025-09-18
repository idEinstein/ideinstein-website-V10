import { Metadata } from 'next';
import DatabaseSecurityDashboard from '@/components/database/DatabaseSecurityDashboard';

export const metadata: Metadata = {
  title: 'Database Security | IdEinstein Admin',
  description: 'Monitor and configure database security, performance, and backup settings',
};

export default function DatabaseSecurityPage() {
  return (
    <div className="container mx-auto pt-24 pb-8 px-4">
      <DatabaseSecurityDashboard />
    </div>
  );
}
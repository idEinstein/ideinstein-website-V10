import { Metadata } from 'next';
import SecurityDashboard from '@/components/security/SecurityDashboard';

export const metadata: Metadata = {
  title: 'Security Dashboard | IdEinstein Admin',
  description: 'Comprehensive security monitoring, OWASP 2024 compliance, and Next.js security best practices',
};

export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SecurityDashboard />
      </div>
    </div>
  );
}
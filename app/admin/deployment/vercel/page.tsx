import { Metadata } from 'next';
import VercelConfigDashboard from '@/components/deployment/VercelConfigDashboard';

export const metadata: Metadata = {
  title: 'Vercel Deployment Configuration | IdEinstein Admin',
  description: 'Generate and manage Vercel deployment configurations for secure production deployment',
};

export default function VercelDeploymentPage() {
  return (
    <div className="container mx-auto py-8">
      <VercelConfigDashboard />
    </div>
  );
}
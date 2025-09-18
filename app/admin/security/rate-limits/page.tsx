import { Metadata } from 'next';
import RateLimitDashboard from '@/components/security/RateLimitDashboard';

export const metadata: Metadata = {
  title: 'Rate Limit Monitoring | IdEinstein Security',
  description: 'Monitor and analyze rate limiting activity and violations',
};

export default function RateLimitsPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <RateLimitDashboard />
      </div>
    </div>
  );
}
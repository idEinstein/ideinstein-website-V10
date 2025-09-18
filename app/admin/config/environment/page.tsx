import { Metadata } from 'next';
import EnvironmentValidator from '@/components/config/EnvironmentValidator';

export const metadata: Metadata = {
  title: 'Environment Validator | IdEinstein Configuration',
  description: 'Validate and manage environment variables for secure deployment',
};

export default function EnvironmentValidatorPage() {
  return (
    <div className="container mx-auto py-8">
      <EnvironmentValidator />
    </div>
  );
}
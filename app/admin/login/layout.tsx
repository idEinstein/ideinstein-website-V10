import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | IdEinstein',
  description: 'Admin login for IdEinstein dashboard',
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
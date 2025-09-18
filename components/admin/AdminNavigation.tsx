'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Rocket, 
  Shield, 
  Settings, 
  Home,
  ChevronRight
} from 'lucide-react';

const adminRoutes = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: Home,
    description: 'Main admin dashboard'
  },
  {
    label: 'Database Security',
    href: '/admin/database/security',
    icon: Database,
    description: 'Database monitoring and security'
  },
  {
    label: 'Deployment',
    href: '/admin/deployment/vercel',
    icon: Rocket,
    description: 'Vercel deployment management'
  },
  {
    label: 'Security',
    href: '/admin/security',
    icon: Shield,
    description: 'OWASP compliance and security monitoring'
  },
  {
    label: 'Configuration',
    href: '/admin/config/environment',
    icon: Settings,
    description: 'Environment and integration settings'
  }
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-gray-900">
              IdEinstein
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Admin</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {adminRoutes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href;
              
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                  title={route.description}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{route.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="py-2 space-y-1">
            {adminRoutes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href;
              
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <div>
                    <div>{route.label}</div>
                    <div className="text-xs text-gray-500">{route.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
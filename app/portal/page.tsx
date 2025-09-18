"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  FileText,
  CreditCard,
  Settings,
  Upload,
  Eye,
  Download,
  LogOut,
  Plus,
} from "lucide-react";
import { UnifiedConsultationCard } from "@/components/shared/UnifiedConsultationCard";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_date: string;
}

interface FileItem {
  id?: string;
  name: string;
  size?: number;
  created_time?: string;
}

interface Invoice {
  invoice_id: string;
  invoice_number: string;
  total: number;
  balance: number;
  status: string;
  due_date: string;
  created_time: string;
}

interface DashboardStats {
  activeProjects: number;
  totalSpent: number;
  filesUploaded: number;
  outstandingBalance: number;
}

export default function CustomerPortal() {
  // Add mobile-specific styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .touch-manipulation {
        touch-action: manipulation;
      }
      @media (max-width: 475px) {
        /* Very small screens - use dropdown */
        .xs\:hidden {
          display: none !important;
        }
      }
      
      @media (min-width: 476px) {
        /* Larger screens - use horizontal scroll */
        .xs\:flex {
          display: flex !important;
        }
      }
      
      @media (max-width: 640px) {
        .mobile-stack > * + * {
          margin-top: 0.75rem;
        }
        
        /* Premium navigation styling */
        .scrollbar-hide {
          padding-right: 0.5rem;
          scroll-behavior: smooth;
        }
        
        /* Premium scroll indicators */
        .scrollbar-hide::before,
        .scrollbar-hide::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 16px;
          pointer-events: none;
          z-index: 10;
        }
        
        .scrollbar-hide::before {
          left: 0;
          background: linear-gradient(to right, rgba(248, 250, 252, 0.9), transparent);
        }
        
        .scrollbar-hide::after {
          right: 0;
          background: linear-gradient(to left, rgba(248, 250, 252, 0.9), transparent);
        }
        
        /* Premium hover effects */
        .premium-nav-item:hover {
          transform: translateY(-1px);
        }
        
        /* Premium active state glow */
        .premium-nav-active {
          box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        /* Add scroll indicators */
        .scrollbar-hide::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 20px;
          background: linear-gradient(to right, transparent, #f3f4f6);
          pointer-events: none;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    totalSpent: 0,
    filesUploaded: 0,
    outstandingBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching dashboard data...');

      // Fetch projects
      console.log('Fetching projects...');
      const projectsResponse = await fetch("/api/projects");
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        console.log('Projects data:', projectsData);
        setProjects(projectsData.projects || []);
      } else {
        console.error('Projects fetch failed:', projectsResponse.status);
      }

      // Fetch invoices
      console.log('Fetching invoices...');
      const invoicesResponse = await fetch("/api/billing/invoices");
      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        console.log('Invoices data:', invoicesData);
        setInvoices(invoicesData.invoices || []);

        // Calculate stats from the actual data
        const activeProjects = projects.filter(
          (p: Project) => p.status === "active" || p.status === "in_progress"
        ).length;

        setStats({
          activeProjects,
          totalSpent: invoicesData.summary?.totalPaid || 0,
          filesUploaded: 0, // This would come from file API
          outstandingBalance: invoicesData.summary?.outstandingBalance || 0,
        });
      } else {
        console.error('Invoices fetch failed:', invoicesResponse.status);
      }

      // Fetch files
      console.log('Fetching files...');
      try {
        const filesResponse = await fetch("/api/files");
        if (filesResponse.ok) {
          const filesData = await filesResponse.json();
          console.log('Files data:', filesData);
          setFiles(filesData.files || []);
          
          // Update stats with file count
          setStats(prev => ({
            ...prev,
            filesUploaded: filesData.files?.length || 0
          }));
        } else {
          console.warn('Files fetch failed:', filesResponse.status, '- Files section will be unavailable');
          // Set empty files array so the UI doesn't break
          setFiles([]);
          setStats(prev => ({
            ...prev,
            filesUploaded: 0
          }));
        }
      } catch (error) {
        console.warn('Files fetch error:', error, '- Files section will be unavailable');
        setFiles([]);
        setStats(prev => ({
          ...prev,
          filesUploaded: 0
        }));
      }

      // Fetch dashboard stats
      console.log('Fetching dashboard stats...');
      const statsResponse = await fetch("/api/dashboard/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('Dashboard stats:', statsData);
        setStats((prev) => ({ ...prev, ...statsData }));
      } else {
        console.error('Dashboard stats fetch failed:', statsResponse.status);
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [projects]);

  // Fetch data when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status, fetchDashboardData]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleCreateProject = () => {
    setShowQuoteModal(true);
  };

  const handleQuoteSubmit = async (quoteData: unknown) => {
    try {
      console.log('📝 Submitting quote request:', quoteData);
      
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Quote submitted successfully:', result);
        alert(`Quote request submitted successfully! Reference: ${result.quoteReference}`);
        // Refresh dashboard data to show any updates
        fetchDashboardData();
      } else {
        console.error('Quote submission failed:', result);
        alert(`Failed to submit quote: ${result.error}`);
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      alert('Failed to submit quote request. Please try again.');
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">IdEinstein</h1>
              <span className="ml-2 text-gray-500">Customer Portal</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-gray-700">
                Welcome, {session?.user?.name || "User"}!
              </span>
              <button
                type="button"
                onClick={handleCreateProject}
                className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                title="Request New Project"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Request</span>
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Navigation Tabs */}
        
        {/* Mobile Dropdown Navigation (for very small screens) */}
        <div className="block xs:hidden mb-4">
          <div className="relative">
            <button
              onClick={() => setShowMobileDropdown(!showMobileDropdown)}
              className="w-full flex items-center justify-between bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 px-4 py-4 rounded-xl text-left shadow-sm hover:shadow-md transition-all duration-200 hover:from-slate-100 hover:to-gray-100"
            >
              <div className="flex items-center space-x-2">
                {(() => {
                  const currentTab = [
                    { id: "dashboard", label: "Dashboard", shortLabel: "Home", icon: FileText },
                    { id: "projects", label: "My Projects", shortLabel: "Work", icon: FileText },
                    { id: "billing", label: "Billing", shortLabel: "Bills", icon: CreditCard },
                    { id: "files", label: "Files", shortLabel: "Files", icon: Upload },
                    { id: "settings", label: "Settings", shortLabel: "Config", icon: Settings },
                  ].find(tab => tab.id === activeTab);
                  return currentTab ? (
                    <>
                      <currentTab.icon className="w-4 h-4" />
                      <span className="font-medium">{currentTab.shortLabel}</span>
                    </>
                  ) : null;
                })()}
              </div>
              <svg className="w-4 h-4 transition-transform duration-200 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showMobileDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 backdrop-blur-sm bg-white/95">
                {[
                  { id: "dashboard", label: "Dashboard", shortLabel: "Home", icon: FileText },
                  { id: "projects", label: "My Projects", shortLabel: "Work", icon: FileText },
                  { id: "billing", label: "Billing", shortLabel: "Bills", icon: CreditCard },
                  { id: "files", label: "Files", shortLabel: "Files", icon: Upload },
                  { id: "settings", label: "Settings", shortLabel: "Config", icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileDropdown(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 first:rounded-t-xl last:rounded-b-xl transition-all duration-200 ${
                      activeTab === tab.id ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold border-r-4 border-blue-500" : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.shortLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="hidden xs:flex space-x-1 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 p-2 rounded-xl mb-6 sm:mb-8 overflow-x-auto scrollbar-hide min-w-0 relative shadow-sm">
          {[
            { id: "dashboard", label: "Dashboard", shortLabel: "Home", icon: FileText },
            { id: "projects", label: "My Projects", shortLabel: "Work", icon: FileText },
            { id: "billing", label: "Billing", shortLabel: "Bills", icon: CreditCard },
            { id: "files", label: "Files", shortLabel: "Files", icon: Upload },
            { id: "settings", label: "Settings", shortLabel: "Config", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-4 sm:px-5 py-3 sm:py-3 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 text-sm sm:text-base font-medium ${
                activeTab === tab.id ? "bg-white text-blue-700 shadow-md border border-blue-200 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-white/60 hover:shadow-sm"
              }`}
            >
              <tab.icon className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0 transition-colors duration-200" />
              <span className="hidden sm:inline font-medium">{tab.label}</span><span className="sm:hidden font-medium text-xs">{tab.shortLabel || tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Active Projects
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.activeProjects}
                </p>
                <p className="text-gray-500 text-sm">Currently in progress</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Total Spent
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  €{stats.totalSpent.toFixed(2)}
                </p>
                <p className="text-gray-500 text-sm">This year</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Outstanding Balance
                </h3>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  €{stats.outstandingBalance.toFixed(2)}
                </p>
                <p className="text-gray-500 text-sm">Pending payment</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Project &ldquo;Engine Mount Design&rdquo; completed
                    </span>
                    <span className="text-gray-500 text-sm">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">
                      New invoice generated for Project #1234
                    </span>
                    <span className="text-gray-500 text-sm">1 day ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">
                      CAD file uploaded to &ldquo;Bracket Analysis&rdquo;
                    </span>
                    <span className="text-gray-500 text-sm">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Projects</h2>
              <button
                type="button"
                onClick={handleCreateProject}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Request Project
              </button>
            </div>

            {/* Projects List */}
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Projects Yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Request your first project to get started with IdEinstein.
                  </p>
                  <button
                    type="button"
                    onClick={handleCreateProject}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Request Project
                  </button>
                </div>
              ) : (
                projects.map((project) => {
                  const getStatusColor = (status: string) => {
                    switch (status.toLowerCase()) {
                      case "completed":
                        return "green";
                      case "active":
                      case "in_progress":
                        return "blue";
                      case "pending":
                      case "review":
                        return "yellow";
                      default:
                        return "gray";
                    }
                  };

                  return (
                    <div
                      key={project.id}
                      className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            {project.name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Created:{" "}
                            {new Date(
                              project.created_date
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {project.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(project.status)}-100 text-${getStatusColor(project.status)}-800`}
                            >
                              {project.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="p-3 sm:p-2 text-gray-400 hover:text-gray-600 touch-manipulation"
                            title="View Project"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-3 sm:p-2 text-gray-400 hover:text-gray-600 touch-manipulation"
                            title="Upload Files"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          <button
                            className="p-3 sm:p-2 text-gray-400 hover:text-gray-600 touch-manipulation"
                            title="Download Files"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Billing & Invoices
            </h2>

            {/* Billing Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Outstanding Balance
                </h3>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  €{stats.outstandingBalance.toFixed(2)}
                </p>
                {stats.outstandingBalance > 0 && (
                  <button
                    type="button"
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Pay Now
                  </button>
                )}
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Total Paid This Year
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  €{stats.totalSpent.toFixed(2)}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {invoices.filter((inv) => inv.status === "paid").length}{" "}
                  invoices paid
                </p>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Recent Invoices
                </h3>
              </div>
              <div className="p-6">
                {invoices.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No invoices yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.slice(0, 5).map((invoice) => (
                      <div
                        key={invoice.invoice_id}
                        className="flex justify-between items-center py-3 border-b last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {invoice.invoice_number}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {new Date(
                              invoice.created_time
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            €{invoice.total.toFixed(2)}
                          </p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              invoice.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === "files" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Files</h2>
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.onchange = async (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files) {
                      for (const file of Array.from(files)) {
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        try {
                          const response = await fetch('/api/files', {
                            method: 'POST',
                            body: formData,
                          });
                          
                          if (response.ok) {
                            console.log('File uploaded successfully');
                            fetchDashboardData(); // Refresh data
                          }
                        } catch (error) {
                          console.error('File upload failed:', error);
                        }
                      }
                    }
                  };
                  input.click();
                }}
              >
                Upload Files
              </button>
            </div>

            {/* Files Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Total Files
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {files.length}
                </p>
                <p className="text-gray-500 text-sm">Across all projects</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Storage Used
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {(files.reduce((sum: number, file: FileItem) => sum + (Number(file?.size) || 0), 0) / (1024 * 1024)).toFixed(1)} MB
                </p>
                <p className="text-gray-500 text-sm">Total file size</p>
              </div>
            </div>

            {/* Files List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Recent Files
                </h3>
              </div>
              <div className="p-6">
                {files.length === 0 ? (
                  <div className="text-center py-8">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Files Yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Upload your first file to get started.
                    </p>
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.onchange = async (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files) {
                            for (const file of Array.from(files)) {
                              const formData = new FormData();
                              formData.append('file', file);
                              
                              try {
                                const response = await fetch('/api/files', {
                                  method: 'POST',
                                  body: formData,
                                });
                                
                                if (response.ok) {
                                  console.log('File uploaded successfully');
                                  fetchDashboardData(); // Refresh data
                                }
                              } catch (error) {
                                console.error('File upload failed:', error);
                              }
                            }
                          }
                        };
                        input.click();
                      }}
                    >
                      Upload Files
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {files.slice(0, 10).map((file, index) => (
                      <div
                        key={file.id || index}
                        className="flex justify-between items-center py-3 border-b last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'} • 
                              {file.created_time ? new Date(file.created_time).toLocaleDateString() : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="p-3 sm:p-2 text-gray-400 hover:text-gray-600 touch-manipulation"
                            title="Download File"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Account Settings
            </h2>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Profile Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md text-base"
                      defaultValue="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md text-base"
                      defaultValue="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md text-base"
                      defaultValue="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md text-base"
                      defaultValue="Engineering Corp"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quote Modal */}
      <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <UnifiedConsultationCard
            type="quotation"
            onSubmit={handleQuoteSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

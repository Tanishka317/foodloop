import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DemoBanner from '../common/DemoBanner';
import ToastContainer from '../common/ToastContainer';
import { useApp } from '../../context/AppContext';
import { Menu, X, Bell, User, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { currentRole, currentUser, currentOrg, unreadNotificationsCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Compute page title based on pathname
  const getPageHeaderInfo = () => {
    const p = location.pathname;
    if (p.includes('/ngo/discover')) return { title: 'Discover Available Food', subtitle: 'Live marketplace of safe surplus food ready for immediate claim' };
    if (p.includes('/ngo/requests')) return { title: 'Requests & Allocations', subtitle: 'Track and manage food claims submitted to local donors' };
    if (p.includes('/ngo/pickups')) return { title: 'Active & Upcoming Pickups', subtitle: 'Real-time logistics, courier handoff, and verification codes' };
    if (p.includes('/ngo/history')) return { title: 'Collection History', subtitle: 'Archive of past food distributions and verified deliveries' };
    if (p.includes('/ngo/impact')) return { title: 'Community Impact & Metrics', subtitle: 'Verified metrics for food rescued and carbon emissions offset' };
    if (p.includes('/ngo')) return { title: 'NGO Overview', subtitle: 'Daily summary, urgent local surplus, and scheduled collections' };

    if (p.includes('/donor/donations/new')) return { title: 'Post Surplus Donation', subtitle: 'List safe surplus food with portion counts, allergens, and pickup window' };
    if (p.includes('/donor/donations')) return { title: 'Donation Inventory', subtitle: 'Manage your active food listings and availability status' };
    if (p.includes('/donor/requests')) return { title: 'Incoming Requests', subtitle: 'Review and approve claims from accredited community organizations' };
    if (p.includes('/donor/pickups')) return { title: 'Collection Schedule', subtitle: 'Coordinated pickup windows and courier handoff verification' };
    if (p.includes('/donor/history')) return { title: 'Completed Donations', subtitle: 'Historical record of redistributed food batches' };
    if (p.includes('/donor/impact')) return { title: 'ESG & Sustainability Impact', subtitle: 'Corporate environmental and social governance metrics' };
    if (p.includes('/donor')) return { title: 'Donor Overview', subtitle: 'Active listings, pending requests, and upcoming collections' };

    if (p.includes('/volunteer/tasks')) return { title: 'Assigned Pickups & Tasks', subtitle: 'Step-by-step courier checklist for surplus pickup and delivery' };
    if (p.includes('/volunteer/schedule')) return { title: 'Volunteer Shift Schedule', subtitle: 'Upcoming coordinated rescue windows' };
    if (p.includes('/volunteer/history')) return { title: 'Delivery Milestone History', subtitle: 'Record of your completed community food rescues' };
    if (p.includes('/volunteer')) return { title: 'Volunteer Dispatch Console', subtitle: 'Active courier assignments and live delivery handoffs' };

    if (p.includes('/admin/organizations')) return { title: 'Organization Verification', subtitle: 'Review food safety licenses, permits, and accreditation status' };
    if (p.includes('/admin/users')) return { title: 'User Directory', subtitle: 'Manage platform accounts, roles, and authorization levels' };
    if (p.includes('/admin/donations')) return { title: 'Listing Moderation', subtitle: 'Audit food listings for safety standards and allergen clarity' };
    if (p.includes('/admin/requests')) return { title: 'Platform Requests Ledger', subtitle: 'Central audit log of all allocation requests and approvals' };
    if (p.includes('/admin/reports')) return { title: 'Flagged Activity & Reports', subtitle: 'Investigate incident reports, no-shows, and safety flags' };
    if (p.includes('/admin/analytics')) return { title: 'System Analytics', subtitle: 'Throughput metrics, regional heatmaps, and rescue efficiency' };
    if (p.includes('/admin')) return { title: 'Compliance & Platform Admin', subtitle: 'Operational overview, safety health check, and system audit' };

    if (p.includes('/notifications')) return { title: 'Notification Center', subtitle: 'Real-time alerts, claim approvals, and delivery status updates' };
    if (p.includes('/profile')) return { title: 'Organization Profile', subtitle: 'Verification badges, contact details, and location coordinates' };
    if (p.includes('/settings')) return { title: 'Platform Preferences', subtitle: 'Notification channels, rescue radius, and demo configurations' };

    return { title: 'FoodLoop Console', subtitle: 'Surplus food rescue operations' };
  };

  const headerInfo = getPageHeaderInfo();

  return (
    <div className="min-h-screen flex flex-col bg-ivory selection:bg-forest-700 selection:text-ivory-50">
      <DemoBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Backdrop & Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white z-10 shadow-lifted">
              <Sidebar closeMobileMenu={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="h-16 bg-ivory-50/90 backdrop-blur border-b border-ivory-300 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-charcoal-600 hover:bg-ivory-200"
                aria-label="Open sidebar navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-base sm:text-lg font-serif font-bold text-charcoal-900 leading-tight">
                  {headerInfo.title}
                </h1>
                <p className="text-xs text-charcoal-500 hidden sm:block truncate max-w-lg">
                  {headerInfo.subtitle}
                </p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/app/notifications"
                className="relative p-2 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-ivory-200 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta-500 ring-2 ring-white" />
                )}
              </Link>

              <Link
                to="/about"
                className="hidden md:flex items-center gap-1.5 text-xs text-charcoal-600 hover:text-forest-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-ivory-200 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Architecture Guide</span>
              </Link>

              <Link
                to="/"
                className="hidden sm:flex items-center gap-1 text-xs text-forest-700 hover:text-forest-800 font-semibold px-2.5 py-1.5 rounded-lg border border-forest-200 bg-forest-50/60 hover:bg-forest-100/60 transition-colors"
                title="View Public Landing Page"
              >
                <span>Public Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </header>

          {/* Subheader / Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

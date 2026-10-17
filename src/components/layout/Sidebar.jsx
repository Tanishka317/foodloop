import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  PackagePlus,
  ClipboardList,
  Truck,
  History,
  BarChart3,
  Users,
  Building2,
  ShieldAlert,
  Bell,
  User,
  Settings,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ closeMobileMenu }) {
  const { currentRole, unreadNotificationsCount, currentUser, currentOrg } = useApp();

  const roleNavItems = {
    ngo: [
      { label: 'Overview', path: '/app/ngo', icon: LayoutDashboard },
      { label: 'Discover Food', path: '/app/ngo/discover', icon: Compass, badge: 'Live' },
      { label: 'Requests & Claims', path: '/app/ngo/requests', icon: ClipboardList },
      { label: 'Upcoming Pickups', path: '/app/ngo/pickups', icon: Truck },
      { label: 'Collection History', path: '/app/ngo/history', icon: History },
      { label: 'Impact & Reports', path: '/app/ngo/impact', icon: BarChart3 },
    ],
    donor: [
      { label: 'Overview', path: '/app/donor', icon: LayoutDashboard },
      { label: 'Active Listings', path: '/app/donor/donations', icon: Layers },
      { label: 'Post New Donation', path: '/app/donor/donations/new', icon: PackagePlus, highlight: true },
      { label: 'Incoming Requests', path: '/app/donor/requests', icon: ClipboardList },
      { label: 'Pickup Schedule', path: '/app/donor/pickups', icon: Truck },
      { label: 'Completed History', path: '/app/donor/history', icon: History },
      { label: 'ESG & Impact', path: '/app/donor/impact', icon: BarChart3 },
    ],
    volunteer: [
      { label: 'Task Console', path: '/app/volunteer', icon: LayoutDashboard },
      { label: 'Assigned Pickups', path: '/app/volunteer/tasks', icon: Truck, badge: 'Tasks' },
      { label: 'Shift Schedule', path: '/app/volunteer/schedule', icon: Clock },
      { label: 'Delivery History', path: '/app/volunteer/history', icon: CheckCircle2 },
    ],
    admin: [
      { label: 'System Overview', path: '/app/admin', icon: LayoutDashboard },
      { label: 'Organizations', path: '/app/admin/organizations', icon: Building2 },
      { label: 'Users Directory', path: '/app/admin/users', icon: Users },
      { label: 'Listing Moderation', path: '/app/admin/donations', icon: Layers },
      { label: 'Requests Ledger', path: '/app/admin/requests', icon: ClipboardList },
      { label: 'Flagged Reports', path: '/app/admin/reports', icon: ShieldAlert },
      { label: 'Platform Analytics', path: '/app/admin/analytics', icon: BarChart3 },
    ],
  };

  const navItems = roleNavItems[currentRole] || roleNavItems.ngo;

  return (
    <aside className="w-64 bg-ivory-100 border-r border-ivory-300 flex flex-col h-full select-none">
      {/* Brand & Organization Header */}
      <div className="p-5 border-b border-ivory-300">
        <Logo size="default" to="/" />
        
        {/* Active Org pill */}
        <div className="mt-3.5 p-2.5 rounded-lg bg-ivory-200/90 border border-ivory-300/80">
          <p className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider">
            {currentRole === 'ngo' ? 'Recipient Organization' : currentRole === 'donor' ? 'Registered Donor' : currentRole === 'volunteer' ? 'Courier Dispatch' : 'Compliance Admin'}
          </p>
          <p className="text-xs font-semibold text-charcoal-900 truncate mt-0.5">
            {currentOrg ? currentOrg.name : currentUser?.name}
          </p>
        </div>
      </div>

      {/* Main Navigation links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider">
          Workspace
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/app/${currentRole}`}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-forest-700 text-ivory-50 shadow-sm font-semibold'
                    : item.highlight
                    ? 'text-terracotta-700 hover:bg-terracotta-50 hover:text-terracotta-800'
                    : 'text-charcoal-700 hover:bg-ivory-200 hover:text-charcoal-900'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-terracotta-100 text-terracotta-700 border border-terracotta-200">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Shared bottom utilities: Notifications, Profile, Settings */}
      <div className="p-3 border-t border-ivory-300 space-y-1 bg-ivory-50">
        <NavLink
          to="/app/notifications"
          onClick={closeMobileMenu}
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isActive ? 'bg-forest-700 text-ivory-50' : 'text-charcoal-700 hover:bg-ivory-200'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </div>
          {unreadNotificationsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-terracotta-600 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/app/profile"
          onClick={closeMobileMenu}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isActive ? 'bg-forest-700 text-ivory-50' : 'text-charcoal-700 hover:bg-ivory-200'
            }`
          }
        >
          <User className="w-4 h-4" />
          <span>Organization Profile</span>
        </NavLink>

        <NavLink
          to="/app/settings"
          onClick={closeMobileMenu}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isActive ? 'bg-forest-700 text-ivory-50' : 'text-charcoal-700 hover:bg-ivory-200'
            }`
          }
        >
          <Settings className="w-4 h-4" />
          <span>App Preferences</span>
        </NavLink>
      </div>

      {/* User Avatar pill */}
      <div className="p-3 bg-ivory-200 border-t border-ivory-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full object-cover border border-ivory-400 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-charcoal-900 truncate">
              {currentUser?.name}
            </p>
            <p className="text-[10px] text-charcoal-500 capitalize truncate">
              {currentUser?.title || currentRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

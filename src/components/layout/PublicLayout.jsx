import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
import Button from '../common/Button';
import DemoBanner from '../common/DemoBanner';
import ToastContainer from '../common/ToastContainer';
import { useApp } from '../../context/AppContext';
import { Menu, X, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentRole } = useApp();
  const location = useLocation();

  const navLinks = [
    { label: 'Discover Surplus', path: '/app/ngo/discover' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Mission & About', path: '/about' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-ivory selection:bg-forest-700 selection:text-ivory-50">
      {/* Sticky Header Group: Demo Banner + Main Navbar */}
      <div className="sticky top-0 z-30 shadow-[0_2px_8px_0_rgba(41,47,42,0.04)]">
        <DemoBanner />

        {/* Main Public Navbar */}
        <header className="bg-ivory-50/95 backdrop-blur-md border-b border-ivory-300/80">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-[68px] sm:h-[72px] flex items-center justify-between">
            {/* Logo and Nav Links */}
            <div className="flex items-center gap-7 lg:gap-10">
              <Logo size="default" to="/" />

              <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-[15px] sm:text-base font-medium transition-colors hover:text-forest-800 ${
                      location.pathname === link.path
                        ? 'text-forest-700 font-semibold'
                        : 'text-charcoal-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right CTAs */}
            <div className="hidden sm:flex items-center gap-3.5">
              <Link
                to="/login"
                className="text-[14px] sm:text-[15px] font-semibold text-charcoal-800 hover:text-forest-700 px-3 py-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-forest-600"
              >
                Sign In
              </Link>
              <Link to="/app">
                <Button
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="font-semibold text-[14px] sm:text-[15px] px-5 py-2.5 rounded-xl shadow-sm"
                >
                  Launch App Console ({currentRole.toUpperCase()})
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-charcoal-700 hover:bg-ivory-200 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-600"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-b border-ivory-300 bg-ivory-50 px-5 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-charcoal-800 hover:text-forest-700"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-ivory-300 flex flex-col gap-2.5">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full text-[15px]">
                    Sign In
                  </Button>
                </Link>
                <Link to="/app" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full text-[15px]">
                    Launch App Console ({currentRole.toUpperCase()})
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Editorial Warm Footer */}
      <footer className="bg-charcoal-900 text-ivory-300 border-t border-charcoal-800 pt-16 pb-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 mb-14">
            {/* Col 1: Brand & Mission */}
            <div className="md:col-span-2 space-y-4">
              <Logo size="lg" to="/" light />
              <p className="text-sm text-charcoal-300 max-w-md leading-relaxed">
                FoodLoop is a transparent redistribution infrastructure connecting commercial food donors with accredited community kitchens, shelters, and volunteer dispatch before safe surplus expires.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-charcoal-400">
                <span className="inline-flex items-center gap-1.5 bg-charcoal-800 px-3 py-1.5 rounded-lg border border-charcoal-700 text-ivory-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-forest-400" /> Safe Surplus Guarantee
                </span>
                <span className="inline-flex items-center gap-1.5 bg-charcoal-800 px-3 py-1.5 rounded-lg border border-charcoal-700 text-ivory-200">
                  <MapPin className="w-3.5 h-3.5 text-terracotta-400" /> PostGIS Geofenced Dispatch
                </span>
              </div>
            </div>

            {/* Col 2: Platform Roles */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-ivory-100 mb-4 font-sans">
                Platform Roles
              </h5>
              <ul className="space-y-2.5 text-sm text-charcoal-300">
                <li><Link to="/app/donor" className="hover:text-ivory-50 transition-colors">Food Donors & Canteens</Link></li>
                <li><Link to="/app/ngo" className="hover:text-ivory-50 transition-colors">NGOs & Food Banks</Link></li>
                <li><Link to="/app/volunteer" className="hover:text-ivory-50 transition-colors">Volunteer Couriers</Link></li>
                <li><Link to="/app/admin" className="hover:text-ivory-50 transition-colors">Compliance & Admin</Link></li>
              </ul>
            </div>

            {/* Col 3: Technical Context */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-ivory-100 mb-4 font-sans">
                System Architecture
              </h5>
              <p className="text-xs text-charcoal-400 leading-relaxed mb-3">
                Built with React, decoupled services, and responsive design tokens. Ready for Node.js / Express and PostgreSQL + PostGIS integration.
              </p>
              <div className="text-[11px] text-terracotta-400 font-mono bg-charcoal-950 p-2.5 rounded-lg border border-charcoal-800">
                Demonstration Environment: Simulated Local Fixtures
              </div>
            </div>
          </div>

          <div className="border-t border-charcoal-800 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
            <p>© {new Date().getFullYear()} FoodLoop Project. Built for portfolio & product design demonstration.</p>
            <div className="flex items-center gap-6">
              <Link to="/about" className="hover:text-ivory-200 transition-colors">About Mission</Link>
              <Link to="/login" className="hover:text-ivory-200 transition-colors">Demo Sign In</Link>
              <Link to="/app" className="hover:text-ivory-200 transition-colors">App Dashboard</Link>
            </div>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}

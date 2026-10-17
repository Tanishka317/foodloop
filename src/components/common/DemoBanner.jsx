import React from 'react';
import { useApp } from '../../context/AppContext';
import { RotateCcw } from 'lucide-react';

export default function DemoBanner() {
  const { currentRole, switchRole, resetAllDemoData, currentUser } = useApp();

  const roles = [
    { id: 'ngo', label: 'NGO / Recipient', sub: 'Hope Kitchen' },
    { id: 'donor', label: 'Food Donor', sub: 'Daily Harvest' },
    { id: 'volunteer', label: 'Volunteer', sub: 'David O\'Connor' },
    { id: 'admin', label: 'Administrator', sub: 'Compliance Lead' }
  ];

  return (
    <div className="bg-charcoal-900 text-ivory-100 text-xs py-2 px-4 border-b border-charcoal-800 transition-colors">
      <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta-500"></span>
          </span>
          <span className="font-semibold text-ivory-50 tracking-wide text-[11px] sm:text-xs">
            PORTFOLIO DEMO
          </span>
          <span className="text-charcoal-500 hidden sm:inline">•</span>
          <span className="text-charcoal-300 hidden sm:inline text-[11px] sm:text-xs">
            Active Persona: <strong className="text-terracotta-400 font-medium">{currentUser?.name}</strong> ({currentRole.toUpperCase()})
          </span>
        </div>

        {/* Center: Quick Persona Switcher Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-charcoal-400 text-[11px] mr-1 hidden md:inline">Switch Role:</span>
          {roles.map(r => {
            const active = currentRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => switchRole(r.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  active
                    ? 'bg-forest-700 text-ivory-50 shadow-sm border border-forest-600 font-bold'
                    : 'bg-charcoal-800 text-charcoal-300 hover:text-ivory-100 hover:bg-charcoal-700 border border-charcoal-700'
                }`}
                title={`Switch to ${r.label}`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Right: Reset Data */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetAllDemoData}
            className="inline-flex items-center gap-1 text-[11px] text-charcoal-400 hover:text-ivory-200 transition-colors py-0.5 px-1.5 rounded hover:bg-charcoal-800"
            title="Reset demo data to initial sample fixtures"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}

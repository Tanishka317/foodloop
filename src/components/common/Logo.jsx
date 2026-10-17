import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'default', to = '/', light = false }) {
  const sizeClasses = {
    sm: 'text-lg',
    default: 'text-xl',
    lg: 'text-2xl',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    default: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  return (
    <Link to={to} className="inline-flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-forest-600 rounded-md">
      <div className={`${iconSizes[size]} rounded-lg bg-forest-700 flex items-center justify-center text-ivory-50 shadow-sm group-hover:bg-forest-800 transition-colors`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.043-1.771L7.197 9.5" />
          <path d="M11 19h10" />
          <circle cx="16" cy="6" r="3" />
          <path d="M21 16.5A4.5 4.5 0 0 1 16.5 21H11" />
          <path d="m11 9-3 3 3 3" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`${sizeClasses[size]} font-bold tracking-tight ${light ? 'text-ivory-50' : 'text-charcoal-900'} font-serif flex items-center gap-1 leading-none`}>
          Food<span className="text-terracotta-500 font-sans font-extrabold">Loop</span>
        </span>
        <span className={`text-[10px] uppercase tracking-wider font-semibold ${light ? 'text-ivory-300' : 'text-charcoal-400'} -mt-0.5`}>
          Surplus Rescue
        </span>
      </div>
    </Link>
  );
}

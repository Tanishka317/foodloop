import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[34px]',
    md: 'text-[14px] sm:text-[15px] px-5 py-2.5 gap-2 min-h-[42px]',
    lg: 'text-[15px] sm:text-base px-6 py-3 gap-2.5 min-h-[48px]',
  };

  const variantClasses = {
    primary: 'bg-forest-700 text-ivory-50 hover:bg-forest-800 active:bg-forest-900 focus:ring-forest-600 shadow-sm border border-transparent',
    secondary: 'bg-ivory-300 text-charcoal-800 hover:bg-ivory-400 active:bg-ivory-500 focus:ring-charcoal-400 border border-ivory-400/60',
    terracotta: 'bg-terracotta-600 text-white hover:bg-terracotta-700 active:bg-terracotta-800 focus:ring-terracotta-500 shadow-sm border border-transparent',
    outline: 'bg-transparent text-charcoal-800 border border-charcoal-300 hover:bg-ivory-200 active:bg-ivory-300 focus:ring-charcoal-400',
    ghost: 'bg-transparent text-charcoal-700 hover:bg-ivory-200 active:bg-ivory-300 focus:ring-charcoal-400',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500 shadow-sm border border-transparent',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      ) : null}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      ) : null}
    </button>
  );
}

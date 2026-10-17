import React from 'react';

export function Input({
  label,
  error,
  helper,
  icon: Icon,
  className = '',
  id,
  required,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-charcoal-700 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-600">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-charcoal-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          required={required}
          className={`w-full rounded-lg bg-ivory-50 border transition-colors text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 disabled:bg-ivory-200 disabled:cursor-not-allowed ${
            Icon ? 'pl-9 pr-3.5 py-2.5' : 'px-3.5 py-2.5'
          } ${
            error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-ivory-400 hover:border-charcoal-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helper && !error && <p className="text-xs text-charcoal-500">{helper}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  helper,
  options = [],
  className = '',
  id,
  required,
  children,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-charcoal-700 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-600">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          required={required}
          className={`w-full rounded-lg bg-ivory-50 border transition-colors text-sm text-charcoal-900 appearance-none px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 disabled:bg-ivory-200 disabled:cursor-not-allowed ${
            error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-ivory-400 hover:border-charcoal-300'
          } ${className}`}
          {...props}
        >
          {children || options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 pointer-events-none text-charcoal-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helper && !error && <p className="text-xs text-charcoal-500">{helper}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  helper,
  className = '',
  id,
  required,
  rows = 3,
  ...props
}) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-semibold text-charcoal-700 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-600">*</span>}
          </span>
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        required={required}
        className={`w-full rounded-lg bg-ivory-50 border transition-colors text-sm text-charcoal-900 placeholder:text-charcoal-400 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 disabled:bg-ivory-200 disabled:cursor-not-allowed ${
          error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-ivory-400 hover:border-charcoal-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helper && !error && <p className="text-xs text-charcoal-500">{helper}</p>}
    </div>
  );
}

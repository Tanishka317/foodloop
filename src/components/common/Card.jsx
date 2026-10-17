import React from 'react';

export default function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
  padding = 'default',
  border = true
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-3.5',
    default: 'p-5',
    lg: 'p-6 sm:p-7',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl ${border ? 'border border-ivory-400/80' : ''} shadow-subtle ${
        hoverable ? 'hover:shadow-warm hover:border-ivory-500 transition-all duration-200 cursor-pointer' : ''
      } ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

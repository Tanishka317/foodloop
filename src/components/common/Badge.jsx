import React from 'react';
import { getStatusBadgeProps, getCategoryBadgeProps } from '../../utils/formatters';

export default function Badge({
  status,
  category,
  children,
  className = '',
  size = 'md',
  dot = false
}) {
  let content = children;
  let colorStyles = 'bg-ivory-300 text-charcoal-700 border-ivory-400';

  if (status) {
    const props = getStatusBadgeProps(status);
    content = content || props.label;
    colorStyles = props.color;
  } else if (category) {
    const props = getCategoryBadgeProps(category);
    content = content || props.label;
    colorStyles = props.color;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 leading-tight',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses[size]} ${colorStyles} ${className}`}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      <span>{content}</span>
    </span>
  );
}

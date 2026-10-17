import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title = 'No items found',
  description = 'There are no records matching your current filter criteria.',
  actionLabel,
  onAction,
  actionIcon,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-ivory-400 rounded-2xl bg-ivory-50/70 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-ivory-200 border border-ivory-300 text-forest-700 flex items-center justify-center mb-3.5 shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h4 className="text-base font-serif font-semibold text-charcoal-900 mb-1">
        {title}
      </h4>
      <p className="text-sm text-charcoal-500 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          size="sm"
          variant="primary"
          icon={actionIcon}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

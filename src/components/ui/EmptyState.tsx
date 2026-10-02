import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-[#CEC9BD] bg-[#FAF9F5] rounded-xl ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-[#E2E0D8] text-[#585A62] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-sm sm:text-base font-semibold text-[#141517] tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-[#585A62] max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

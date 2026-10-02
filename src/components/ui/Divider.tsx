import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
  label,
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-px h-full min-h-[16px] bg-[#E2E0D8] shrink-0 ${className}`}
      />
    );
  }

  if (label) {
    return (
      <div className={`relative flex items-center w-full my-3 ${className}`}>
        <div className="grow border-t border-[#E2E0D8]" />
        <span className="px-3 text-[11px] font-medium text-[#8A8D96] uppercase tracking-wider bg-transparent">
          {label}
        </span>
        <div className="grow border-t border-[#E2E0D8]" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={`w-full h-px bg-[#E2E0D8] my-3 shrink-0 ${className}`}
    />
  );
};

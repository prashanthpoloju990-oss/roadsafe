import React from 'react';

export type StatusBadgeVariant = 'success' | 'warning' | 'emergency' | 'info' | 'neutral';

export interface StatusBadgeProps {
  variant?: StatusBadgeVariant;
  label: string;
  dot?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'neutral',
  label,
  dot = true,
  icon,
  size = 'md',
  className = '',
}) => {
  const variantStyles: Record<StatusBadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    success: {
      bg: 'bg-[#F2F9F3]',
      text: 'text-[#236E33]',
      border: 'border-[#D2EED7]',
      dotColor: 'bg-[#2B8A3E]',
    },
    warning: {
      bg: 'bg-[#FFFBEB]',
      text: 'text-[#92400E]',
      border: 'border-[#FDE68A]',
      dotColor: 'bg-[#D97706]',
    },
    emergency: {
      bg: 'bg-[#FDF2F2]',
      text: 'text-[#A61E1E]',
      border: 'border-[#F9D9D9]',
      dotColor: 'bg-[#C92A2A]',
    },
    info: {
      bg: 'bg-[#EDF2FF]',
      text: 'text-[#2B3E9B]',
      border: 'border-[#D0EBFF]',
      dotColor: 'bg-[#364FC7]',
    },
    neutral: {
      bg: 'bg-[#F4F3EE]',
      text: 'text-[#585A62]',
      border: 'border-[#EDECE7]',
      dotColor: 'bg-[#8A8D96]',
    },
  };

  const style = variantStyles[variant];
  const sizeStyles = size === 'sm' ? 'text-[11px] py-0.5 px-2 gap-1.5' : 'text-xs py-1 px-2.5 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-md select-none ${style.bg} ${style.text} ${style.border} ${sizeStyles} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dotColor} ${
            variant === 'emergency' ? 'animate-pulse' : ''
          }`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span className="whitespace-nowrap tracking-tight">{label}</span>
    </span>
  );
};

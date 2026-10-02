import React from 'react';

export interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  description,
  action,
  level = 2,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 ${className}`}>
      <div className="space-y-0.5">
        {kicker && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8D96]">
            {kicker}
          </p>
        )}
        {level === 1 ? (
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141517]">
            {title}
          </h1>
        ) : level === 2 ? (
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[#141517]">
            {title}
          </h2>
        ) : (
          <h3 className="text-base font-semibold tracking-tight text-[#141517]">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-xs sm:text-sm text-[#585A62] leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';

export interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
  compact?: boolean;
  isEmergencyAlert?: boolean;
  className?: string;
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  isActive,
  onClick,
  badge,
  compact = false,
  isEmergencyAlert = false,
  className = '',
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex items-center w-full rounded-lg transition-colors cursor-pointer select-none text-left ${
        compact ? 'justify-center p-2.5 h-10' : 'gap-3 px-3 py-2.5 h-10'
      } ${
        isActive
          ? 'bg-[#EFEFEA] text-[#141517] font-semibold'
          : isEmergencyAlert
          ? 'text-[#C92A2A] hover:bg-[#FDF2F2]'
          : 'text-[#585A62] hover:text-[#141517] hover:bg-[#F4F3EE] font-medium'
      } ${className}`}
      title={compact ? label : undefined}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active left indicator line */}
      {isActive && (
        <span
          className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#141517] rounded-r-full"
          aria-hidden="true"
        />
      )}

      <span
        className={`shrink-0 transition-transform ${
          isActive
            ? 'text-[#141517]'
            : isEmergencyAlert
            ? 'text-[#C92A2A]'
            : 'text-[#6F727B] group-hover:text-[#141517]'
        }`}
      >
        {icon}
      </span>

      {!compact && (
        <span className="text-sm tracking-tight truncate grow">{label}</span>
      )}

      {!compact && badge && <span className="shrink-0">{badge}</span>}
    </motion.button>
  );
};

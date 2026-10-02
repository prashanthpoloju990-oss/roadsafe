import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectDropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export const SelectDropdown = React.forwardRef<HTMLSelectElement, SelectDropdownProps>(
  ({ label, options, error, hint, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? `select_${label.toLowerCase().replace(/\s+/g, '_')}` : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-xs font-medium text-[#141517] tracking-tight">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            className={`w-full h-10 pl-3.5 pr-9 bg-white text-sm text-[#141517] border appearance-none ${
              error
                ? 'border-[#C92A2A] focus:border-[#C92A2A]'
                : 'border-[#E2E0D8] hover:border-[#CEC9BD] focus:border-[#141517]'
            } rounded-lg outline-none cursor-pointer focus:ring-1 focus:ring-[#141517] transition-colors ${className}`}
            {...props}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 w-4 h-4 text-[#8A8D96] pointer-events-none" />
        </div>
        {error ? (
          <p className="text-xs text-[#C92A2A] tracking-tight">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#585A62] tracking-tight">{hint}</p>
        ) : null}
      </div>
    );
  }
);

SelectDropdown.displayName = 'SelectDropdown';

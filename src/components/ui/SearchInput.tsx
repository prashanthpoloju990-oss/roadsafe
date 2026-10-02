import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, placeholder = 'Search...', className = '', ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <div className={`relative flex items-center w-full ${className}`}>
        <Search className="absolute left-3 w-4 h-4 text-[#8A8D96] pointer-events-none" />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-9 pl-9 pr-8 bg-white text-xs sm:text-sm text-[#141517] placeholder-[#8A8D96] border border-[#E2E0D8] hover:border-[#CEC9BD] focus:border-[#141517] focus:ring-1 focus:ring-[#141517] rounded-lg outline-none transition-colors"
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-1 text-[#8A8D96] hover:text-[#141517] rounded cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

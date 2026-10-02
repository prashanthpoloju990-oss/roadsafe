import React from 'react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, hint, leftIcon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? `input_${label.toLowerCase().replace(/\s+/g, '_')}` : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[#141517] tracking-tight">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#8A8D96]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-10 px-3.5 ${leftIcon ? 'pl-9' : ''} ${
              rightElement ? 'pr-11' : ''
            } bg-white text-sm text-[#141517] placeholder-[#8A8D96] border ${
              error
                ? 'border-[#C92A2A] focus:border-[#C92A2A] focus:ring-1 focus:ring-[#C92A2A]'
                : 'border-[#E2E0D8] hover:border-[#CEC9BD] focus:border-[#141517] focus:ring-1 focus:ring-[#141517]'
            } rounded-lg outline-none transition-colors disabled:bg-[#F4F3EE] disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center">
              {rightElement}
            </div>
          )}
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

TextInput.displayName = 'TextInput';

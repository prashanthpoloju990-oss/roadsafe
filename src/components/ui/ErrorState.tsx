import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Telemetry Sync Disrupted',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`flex items-start gap-4 p-4 sm:p-5 bg-[#FDF2F2] border border-[#F8D7DA] rounded-xl ${className}`}
    >
      <div className="p-2 rounded-lg bg-white border border-[#F9D9D9] text-[#C92A2A] shrink-0 mt-0.5">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="grow space-y-1">
        <h4 className="text-sm font-semibold text-[#141517] tracking-tight">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-[#585A62] leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={onRetry}
            >
              Retry Connection
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

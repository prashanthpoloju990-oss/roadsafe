import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  type?: 'card' | 'table' | 'spinner';
  rows?: number;
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'card',
  rows = 3,
  message = 'Loading safety telemetry...',
  className = '',
}) => {
  if (type === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center p-8 gap-3 text-[#585A62] ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-[#141517]" />
        <span className="text-xs font-medium tracking-tight">{message}</span>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`w-full divide-y divide-[#EDECE7] border border-[#E2E0D8] rounded-xl bg-white overflow-hidden ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
            <div className="w-8 h-8 rounded bg-[#ECEAE3]" />
            <div className="grow space-y-2">
              <div className="h-3.5 bg-[#ECEAE3] rounded w-1/3" />
              <div className="h-3 bg-[#F4F3EE] rounded w-1/2" />
            </div>
            <div className="w-20 h-4 bg-[#ECEAE3] rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Card skeleton
  return (
    <div className={`p-6 border border-[#E2E0D8] rounded-xl bg-white space-y-4 animate-pulse ${className}`}>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-[#ECEAE3] rounded w-1/4" />
        <div className="h-4 bg-[#F4F3EE] rounded w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 bg-[#ECEAE3] rounded w-3/4" />
        <div className="h-3 bg-[#F4F3EE] rounded w-5/6" />
      </div>
      <div className="pt-2 flex gap-3">
        <div className="h-8 bg-[#ECEAE3] rounded w-24" />
        <div className="h-8 bg-[#F4F3EE] rounded w-20" />
      </div>
    </div>
  );
};

import React from 'react';
import { Navigation, Radio } from 'lucide-react';
import { LocationTelemetry } from '../../types';

export interface LocationIndicatorProps {
  telemetry: LocationTelemetry;
  onRefreshOrToggle?: () => void;
  compact?: boolean;
  className?: string;
}

export const LocationIndicator: React.FC<LocationIndicatorProps> = ({
  telemetry,
  onRefreshOrToggle,
  compact = false,
  className = '',
}) => {
  const getQualityBadge = () => {
    switch (telemetry.signalQuality) {
      case 'locked':
        return {
          dotClass: 'bg-[#2B8A3E]',
          textClass: 'text-[#236E33]',
          label: 'GPS Locked',
        };
      case 'searching':
        return {
          dotClass: 'bg-[#D97706] animate-ping',
          textClass: 'text-[#92400E]',
          label: 'Acquiring Fix',
        };
      case 'degraded':
        return {
          dotClass: 'bg-[#C92A2A]',
          textClass: 'text-[#A61E1E]',
          label: 'Signal Degraded',
        };
    }
  };

  const badge = getQualityBadge();

  if (compact) {
    return (
      <button
        type="button"
        onClick={onRefreshOrToggle}
        className={`inline-flex items-center gap-2 px-2.5 py-1.5 bg-white border border-[#E2E0D8] hover:border-[#CEC9BD] rounded-lg text-xs transition-colors cursor-pointer ${className}`}
        title={`GPS: ${badge.label} (±${telemetry.accuracyMeters}m). Click to test states.`}
      >
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.dotClass}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${badge.dotClass}`} />
        </span>
        <span className="font-medium text-[#141517] tracking-tight">{badge.label}</span>
        <span className="text-[#8A8D96] font-mono tabular-nums">±{telemetry.accuracyMeters}m</span>
      </button>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-3.5 bg-white border border-[#E2E0D8] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#EDECE7] flex items-center justify-center text-[#141517] shrink-0">
          <Navigation className="w-4 h-4 text-[#141517]" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`relative inline-flex rounded-full h-2 w-2 ${badge.dotClass}`} />
            </span>
            <span className="text-xs font-semibold text-[#141517] tracking-tight">
              {badge.label}
            </span>
            <span className="text-[11px] text-[#8A8D96]">·</span>
            <span className="text-[11px] text-[#585A62] font-mono tabular-nums">
              Accuracy ±{telemetry.accuracyMeters}m
            </span>
          </div>
          <p className="text-xs text-[#585A62] truncate max-w-xs sm:max-w-md">
            {telemetry.address}
          </p>
        </div>
      </div>

      {onRefreshOrToggle && (
        <button
          type="button"
          onClick={onRefreshOrToggle}
          className="p-1.5 text-[#8A8D96] hover:text-[#141517] hover:bg-[#F4F3EE] rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1 shrink-0 ml-2"
          title="Simulate GPS fix states"
        >
          <Radio className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-medium">Test Fix</span>
        </button>
      )}
    </div>
  );
};

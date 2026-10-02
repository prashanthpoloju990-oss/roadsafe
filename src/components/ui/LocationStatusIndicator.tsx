import React from 'react';
import {
  Navigation,
  Radio,
  Battery,
  BatteryCharging,
  BatteryMedium,
  BatteryLow,
  BatteryWarning,
  Zap,
} from 'lucide-react';
import { LocationTelemetry, BatteryTelemetry, GpsSignalQuality } from '../../types';
import { DEMO_LOCATION, DEMO_BATTERY } from '../../data/mockData';

export interface LocationStatusIndicatorProps {
  location?: LocationTelemetry;
  battery?: BatteryTelemetry;
  variant?: 'card' | 'compact' | 'minimal';
  onToggleGps?: () => void;
  onToggleBattery?: () => void;
  className?: string;
}

export const LocationStatusIndicator: React.FC<LocationStatusIndicatorProps> = ({
  location = DEMO_LOCATION,
  battery = DEMO_BATTERY,
  variant = 'card',
  onToggleGps,
  onToggleBattery,
  className = '',
}) => {
  // GPS Signal status styling & copy
  const getGpsMetadata = (quality: GpsSignalQuality) => {
    switch (quality) {
      case 'locked':
        return {
          dotColor: 'bg-[#2B8A3E]',
          textColor: 'text-[#236E33]',
          label: 'GPS Locked',
          subtext: 'High-precision RTK satellite fix',
        };
      case 'searching':
        return {
          dotColor: 'bg-[#D97706] animate-pulse',
          textColor: 'text-[#92400E]',
          label: 'Acquiring Fix',
          subtext: 'Triangulating cellular & GNSS constellation',
        };
      case 'degraded':
        return {
          dotColor: 'bg-[#C92A2A]',
          textColor: 'text-[#A61E1E]',
          label: 'Signal Degraded',
          subtext: 'Multipath interference / Tunnel fallback',
        };
    }
  };

  const gps = getGpsMetadata(location.signalQuality);

  // Battery icon and color logic
  const getBatteryIcon = () => {
    if (battery.isCharging) {
      return <BatteryCharging className="w-4 h-4 text-[#2B8A3E]" />;
    }
    if (battery.levelPercent <= 15) {
      return <BatteryWarning className="w-4 h-4 text-[#C92A2A] animate-pulse" />;
    }
    if (battery.levelPercent <= 30) {
      return <BatteryLow className="w-4 h-4 text-[#D97706]" />;
    }
    if (battery.levelPercent <= 60) {
      return <BatteryMedium className="w-4 h-4 text-[#585A62]" />;
    }
    return <Battery className="w-4 h-4 text-[#141517]" />;
  };

  const getBatteryColor = () => {
    if (battery.isCharging) return 'text-[#2B8A3E]';
    if (battery.levelPercent <= 15) return 'text-[#C92A2A]';
    if (battery.levelPercent <= 30) return 'text-[#D97706]';
    return 'text-[#141517]';
  };

  // --- 1. Minimal Variant ---
  if (variant === 'minimal') {
    return (
      <div
        className={`inline-flex items-center gap-2 text-xs text-[#585A62] select-none ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className={`relative inline-flex rounded-full h-2 w-2 ${gps.dotColor}`} />
        </span>
        <span className="font-medium text-[#141517]">{gps.label}</span>
        <span className="text-[#8A8D96]">·</span>
        <span className="font-mono tabular-nums">±{location.accuracyMeters}m</span>
        <span className="text-[#8A8D96]">·</span>
        <div className="flex items-center gap-1">
          {getBatteryIcon()}
          <span className={`font-mono font-medium tabular-nums ${getBatteryColor()}`}>
            {battery.levelPercent}%
          </span>
        </div>
      </div>
    );
  }

  // --- 2. Compact Header / Toolbar Variant ---
  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 bg-white border border-[#E2E0D8] hover:border-[#CEC9BD] rounded-lg text-xs transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] select-none ${className}`}
      >
        {/* GPS trigger */}
        <button
          type="button"
          onClick={onToggleGps}
          className="flex items-center gap-1.5 text-left cursor-pointer hover:opacity-80 transition-opacity"
          title={`GPS: ${gps.label} (±${location.accuracyMeters}m). Click to test states.`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`relative inline-flex rounded-full h-2 w-2 ${gps.dotColor}`} />
          </span>
          <span className="font-medium text-[#141517] tracking-tight">{gps.label}</span>
          <span className="text-[#8A8D96] font-mono tabular-nums">±{location.accuracyMeters}m</span>
        </button>

        <span className="text-[#D3D1C8]" aria-hidden="true">|</span>

        {/* Battery trigger */}
        <button
          type="button"
          onClick={onToggleBattery}
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
          title={`Battery: ${battery.levelPercent}% (${battery.isCharging ? 'Charging' : 'On Battery'}). Click to simulate battery levels.`}
        >
          {getBatteryIcon()}
          <span className={`font-mono font-medium tabular-nums ${getBatteryColor()}`}>
            {battery.levelPercent}%
          </span>
          {battery.isCharging && (
            <Zap className="w-3 h-3 text-[#2B8A3E] fill-current shrink-0" />
          )}
        </button>
      </div>
    );
  }

  // --- 3. Card Variant (Full Editorial Utility Display) ---
  return (
    <div
      className={`bg-white border border-[#E2E0D8] rounded-xl p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: GPS Telemetry (Cols 1-7) */}
        <div className="md:col-span-7 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-[#FAF9F5] border border-[#EDECE7] flex items-center justify-center text-[#141517] shrink-0 mt-0.5">
            <Navigation className="w-4 h-4 text-[#141517]" />
          </div>

          <div className="space-y-1 grow min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`relative inline-flex rounded-full h-2 w-2 ${gps.dotColor}`} />
              </span>
              <span className="text-xs font-semibold text-[#141517] tracking-tight">
                {gps.label}
              </span>
              <span className="text-[11px] text-[#8A8D96]">·</span>
              <span className="text-xs text-[#585A62] font-mono tabular-nums">
                Accuracy ±{location.accuracyMeters}m
              </span>
              <span className="text-[11px] text-[#8A8D96]">·</span>
              <span className="text-xs text-[#585A62] font-mono tabular-nums">
                {location.speedKmh} km/h {location.heading}
              </span>
            </div>

            <p className="text-xs text-[#585A62] truncate" title={location.address}>
              {location.address}
            </p>

            <div className="flex items-center gap-3 pt-0.5 text-[11px] text-[#8A8D96]">
              <span className="font-mono tabular-nums">
                {location.latitude.toFixed(4)}°N, {Math.abs(location.longitude).toFixed(4)}°W
              </span>
              <span>·</span>
              <span>Updated {location.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Middle divider */}
        <div className="hidden md:block md:col-span-1 h-12 w-px bg-[#EDECE7] mx-auto" />

        {/* Right: Battery & Power Status (Cols 9-12) */}
        <div className="md:col-span-4 flex items-center justify-between sm:justify-start md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getBatteryIcon()}
              <span className="text-xs font-semibold text-[#141517] tracking-tight">
                Device Power
              </span>
              {battery.isCharging && (
                <span className="text-[10px] font-medium text-[#236E33] bg-[#F2F9F3] border border-[#D2EED7] px-1.5 py-0.2 rounded">
                  12V Vehicle Link
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-bold font-mono tabular-nums ${getBatteryColor()}`}>
                {battery.levelPercent}%
              </span>
              <span className="text-xs text-[#8A8D96]">
                {battery.isCharging
                  ? 'Charging'
                  : battery.estimatedHoursRemaining
                  ? `~${battery.estimatedHoursRemaining}h remaining`
                  : 'On Battery'}
              </span>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-36 h-1.5 bg-[#EDECE7] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  battery.levelPercent <= 15
                    ? 'bg-[#C92A2A]'
                    : battery.levelPercent <= 30
                    ? 'bg-[#D97706]'
                    : battery.isCharging
                    ? 'bg-[#2B8A3E]'
                    : 'bg-[#141517]'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, battery.levelPercent))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

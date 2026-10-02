import React from 'react';
import { ShieldCheck, AlertCircle, PhoneCall, CheckCircle2 } from 'lucide-react';
import { EmergencyStatus } from '../../types';

export interface EmergencyStatusIndicatorProps {
  status: EmergencyStatus;
  onCancel?: () => void;
  onResolve?: () => void;
  compact?: boolean;
  className?: string;
}

export const EmergencyStatusIndicator: React.FC<EmergencyStatusIndicatorProps> = ({
  status,
  onCancel,
  onResolve,
  compact = false,
  className = '',
}) => {
  if (status.stage === 'countdown') {
    return (
      <div
        className={`flex items-center justify-between p-3.5 bg-[#FDF2F2] border border-[#F8D7DA] rounded-xl text-[#C92A2A] shadow-[0_1px_3px_rgba(201,42,42,0.1)] ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-[#F9D9D9] flex items-center justify-center shrink-0">
            <span className="font-mono font-bold text-base text-[#C92A2A] tabular-nums">
              {status.countdownSeconds}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C92A2A]">
                Emergency Countdown Active
              </span>
            </div>
            <p className="text-xs text-[#585A62]">
              Notifying emergency contacts & hospital dispatch in{' '}
              <span className="font-semibold text-[#141517] font-mono tabular-nums">
                {status.countdownSeconds}s
              </span>
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 bg-white border border-[#E2E0D8] hover:bg-[#F4F3EE] text-[#141517] text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0 ml-3"
          >
            Cancel Alert
          </button>
        )}
      </div>
    );
  }

  if (status.stage === 'triggered' || status.stage === 'dispatched') {
    return (
      <div
        className={`flex items-center justify-between p-3.5 bg-[#FDF2F2] border border-[#F8D7DA] rounded-xl text-[#C92A2A] ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C92A2A] flex items-center justify-center text-white shrink-0 animate-pulse">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C92A2A]">
                {status.stage === 'dispatched' ? 'Dispatch En Route' : 'Emergency Transmitted'}
              </span>
              <span className="text-[11px] text-[#8A8D96]">·</span>
              <span className="text-xs text-[#585A62] font-mono tabular-nums">
                ETA {status.estimatedAmbulanceEtaMinutes || 8} mins
              </span>
            </div>
            <p className="text-xs text-[#585A62] truncate max-w-sm">
              {status.assignedHospital || 'Trauma Center Notified'}
            </p>
          </div>
        </div>

        {onResolve && (
          <button
            type="button"
            onClick={onResolve}
            className="px-3 py-1.5 bg-white border border-[#E2E0D8] hover:bg-[#F4F3EE] text-[#141517] text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0 ml-3"
          >
            Mark Resolved
          </button>
        )}
      </div>
    );
  }

  if (status.stage === 'resolved') {
    return (
      <div
        className={`flex items-center gap-3 p-3.5 bg-[#F2F9F3] border border-[#D2EED7] rounded-xl text-[#2B8A3E] ${className}`}
      >
        <CheckCircle2 className="w-5 h-5 shrink-0 text-[#2B8A3E]" />
        <div>
          <span className="text-xs font-semibold text-[#236E33]">
            Incident Safely Resolved
          </span>
          <p className="text-xs text-[#585A62]">
            Telemetry reset. Normal safety monitoring resumed.
          </p>
        </div>
      </div>
    );
  }

  // Idle state
  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-2.5 py-1.5 bg-white border border-[#E2E0D8] rounded-lg text-xs ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-[#2B8A3E]" />
        <span className="font-medium text-[#141517] tracking-tight">Safety Network Active</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-3.5 bg-white border border-[#E2E0D8] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#F2F9F3] border border-[#D2EED7] flex items-center justify-center text-[#2B8A3E] shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#2B8A3E]" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#141517] tracking-tight">
              Safety Network Standby
            </span>
            <span className="text-[11px] text-[#8A8D96]">·</span>
            <span className="text-[11px] text-[#2B8A3E] font-medium">
              Nominal
            </span>
          </div>
          <p className="text-xs text-[#585A62]">
            Automatic impact detection & emergency services routing primed.
          </p>
        </div>
      </div>
    </div>
  );
};

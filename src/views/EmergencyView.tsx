import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import { useProductState } from '../context/ProductStateContext';
import { useToast } from '../context/ToastContext';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Users,
  Building2,
  PhoneCall,
  Flame,
  Ambulance,
  Car,
  ShieldAlert,
  Pause,
  Play,
  ArrowLeft,
  AlertOctagon,
  Zap,
} from 'lucide-react';

interface IncidentOption {
  id: string;
  label: string;
  icon: React.ElementType;
  badge: string;
}

const INCIDENT_OPTIONS: IncidentOption[] = [
  { id: 'Road accident', label: 'Vehicle Collision', icon: Car, badge: 'High Priority' },
  { id: 'Medical emergency', label: 'Medical / Trauma', icon: Ambulance, badge: 'Critical' },
  { id: 'Hit & Run', label: 'Hit & Run / Hazard', icon: AlertTriangle, badge: 'Police Alert' },
  { id: 'Vehicle Fire', label: 'Fire / Breakdown', icon: Flame, badge: 'Rescue Unit' },
];

export const EmergencyView: React.FC = () => {
  const { navigate } = useRouter();
  const {
    emergencyContacts,
    primaryContact,
    locationTelemetry,
    cancelEmergency,
    activeEmergencyCase,
    emergencyFlowStage,
    instantDispatchEmergency,
  } = useProductState();
  const { showToast } = useToast();

  // Selected incident type (defaults to Vehicle Collision for rapid 0-effort dispatch)
  const [selectedType, setSelectedType] = useState<string>('Road accident');

  // Auto-dispatch countdown (5 seconds, like automotive eCall / Crash Detection)
  const INITIAL_COUNTDOWN = 5;
  const [countdown, setCountdown] = useState<number>(INITIAL_COUNTDOWN);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear interval helper
  const clearCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  // Perform the actual instant dispatch
  const triggerInstantDispatch = (typeToUse: string = selectedType) => {
    if (isDispatched) return;
    setIsDispatched(true);
    clearCountdown();

    try {
      instantDispatchEmergency(typeToUse);
      showToast({
        type: 'emergency',
        title: '🚨 Emergency Alert Broadcast!',
        message: 'Hospital trauma center & primary contact notified with live GPS.',
      });
      navigate('/emergency/sent');
    } catch (err) {
      console.error('Dispatch error:', err);
      navigate('/emergency/sent');
    }
  };

  // Automatic countdown runner: decrements every second unless paused
  useEffect(() => {
    if (isPaused || isDispatched) return;

    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearCountdown();
          // Timeout expired -> Auto-dispatch
          triggerInstantDispatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearCountdown();
    };
  }, [isPaused, isDispatched, selectedType]);

  // Cancel emergency and return to dashboard
  const handleCancelEmergency = () => {
    clearCountdown();
    cancelEmergency();
    showToast({
      type: 'info',
      title: 'Emergency Cancelled',
      message: 'No alert was dispatched.',
    });
    navigate('/home');
  };

  // Direct phone helpline trigger
  const handleCallHelpline = () => {
    showToast({
      type: 'emergency',
      title: 'Connecting to 112 Helpline',
      message: 'Direct emergency telephone line active.',
    });
  };

  // Circular progress calculation for countdown ring
  const circleRadius = 90;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - ((INITIAL_COUNTDOWN - countdown) / INITIAL_COUNTDOWN) * circumference;

  return (
    <div className="max-w-2xl mx-auto py-2 sm:py-5 px-3 sm:px-0 select-none">
      {/* 1. Emergency Helpline Direct Banner */}
      <div className="mb-4 p-3 bg-gradient-to-r from-[#141517] to-[#25262B] text-white rounded-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#C92A2A] flex items-center justify-center text-white shrink-0 shadow-xs">
            <PhoneCall className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-white">Call 112 Lifeline</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono">Toll-Free</span>
            </div>
            <p className="text-[11px] text-white/70">Police, Ambulance & Fire Rescue</p>
          </div>
        </div>
        <a
          href="tel:112"
          onClick={handleCallHelpline}
          className="px-3 py-1.5 bg-[#C92A2A] hover:bg-[#B52525] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
        >
          <span>Dial 112</span>
        </a>
      </div>

      {/* Active Alert in Progress Banner */}
      {activeEmergencyCase && activeEmergencyCase.stage !== 'resolved' && emergencyFlowStage !== 'idle' && (
        <div className="mb-4 p-3.5 bg-gradient-to-r from-[#FDF2F2] to-[#FEF0F0] border border-[#F8D7DA] rounded-2xl flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C92A2A] animate-ping shrink-0" />
            <div>
              <span className="font-bold text-[#C92A2A]">
                Active Alert in Progress ({activeEmergencyCase.caseNumber})
              </span>
              <p className="text-[#585A62] text-[11px]">
                {activeEmergencyCase.location} · {activeEmergencyCase.type}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/emergency/sent')}
            className="px-3.5 py-1.5 bg-[#C92A2A] hover:bg-[#B52525] text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs shrink-0"
          >
            Track Status
          </button>
        </div>
      )}

      {/* 2. Top Header & Panic Status */}
      <section className="text-center space-y-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F2] border border-[#F8D7DA] text-[#C92A2A] text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#C92A2A] animate-ping" />
          Hurry Mode · Rapid Emergency Dispatch
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141517]">
          Need help right now?
        </h1>
        <p className="text-xs sm:text-sm text-[#585A62] max-w-md mx-auto">
          We designed this screen so you do <strong className="text-[#141517]">not</strong> have to fill forms or wait. Tap the big button or do nothing to auto-dispatch.
        </p>
      </section>

      {/* 3. Main Center Dispatch Stage Card */}
      <div className="relative bg-white/90 backdrop-blur-md border border-[#E2E0D8] rounded-[2rem] p-5 sm:p-8 shadow-[0_8px_32px_rgba(201,42,42,0.12)] text-center flex flex-col items-center overflow-hidden">
        {/* Urgent Radar Waves in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-[#C92A2A]/5 animate-ping opacity-60" />
          <div className="absolute w-80 h-80 rounded-full bg-[#C92A2A]/[0.03] animate-pulse" />
        </div>

        {/* Rapid 1-Tap SOS Dispatch Button with countdown perimeter */}
        <div className="relative flex items-center justify-center my-3">
          {/* SVG Countdown Ring */}
          <svg className="w-60 h-60 sm:w-68 sm:h-68 -rotate-90 pointer-events-none" viewBox="0 0 200 200">
            {/* Track */}
            <circle
              cx="100"
              cy="100"
              r={circleRadius}
              className="stroke-[#EDECE7]"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress countdown */}
            <circle
              cx="100"
              cy="100"
              r={circleRadius}
              className="stroke-[#C92A2A] transition-all duration-1000 ease-linear"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Central Panic Push Target (1-Tap to instant dispatch) */}
          <button
            id="emergency-sos-button"
            type="button"
            onClick={() => triggerInstantDispatch()}
            className="absolute w-48 h-48 sm:w-54 sm:h-54 rounded-full bg-gradient-to-br from-[#E03131] via-[#C92A2A] to-[#A61E1E] text-white flex flex-col items-center justify-center cursor-pointer select-none transition-transform duration-100 hover:scale-105 active:scale-95 shadow-[0_12px_36px_rgba(201,42,42,0.45)] focus:outline-none focus:ring-4 focus:ring-[#C92A2A]/40"
            aria-label="Instant Emergency Dispatch. Tap once to dispatch immediately"
          >
            <div className="flex flex-col items-center space-y-1">
              <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white animate-pulse" />
              <span className="text-xl sm:text-2xl font-black tracking-tight uppercase">
                1-TAP SOS
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-white/90 uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                DISPATCH NOW (0s)
              </span>
            </div>
          </button>
        </div>

        {/* Auto-dispatch Status Bar */}
        <div className="w-full max-w-sm mt-2 mb-4 p-3 bg-[#FDF2F2] border border-[#F8D7DA] rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C92A2A] animate-ping shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#C92A2A]">
                {isPaused ? 'Auto-Dispatch Paused' : `Auto-Dispatching in ${countdown}s...`}
              </p>
              <p className="text-[11px] text-[#585A62]">
                {isPaused ? 'Press resume or 1-tap SOS to send' : 'Sending automatically if phone is dropped'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="px-2.5 py-1.5 bg-white border border-[#F8D7DA] text-[#C92A2A] hover:bg-[#FDF2F2] rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </>
            )}
          </button>
        </div>

        {/* 4. Quick Incident Nature Selection (1-tap pills) */}
        <div className="w-full space-y-2 text-left pt-2 border-t border-[#EDECE7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#141517] uppercase tracking-wider">
              Emergency Nature (Optional 1-Tap):
            </span>
            <span className="text-[11px] text-[#8A8D96]">Default: Vehicle Collision</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {INCIDENT_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const isSelected = selectedType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedType(opt.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FDF2F2] border-[#C92A2A] text-[#C92A2A] shadow-xs ring-1 ring-[#C92A2A]'
                      : 'bg-white/80 border-[#E2E0D8] text-[#585A62] hover:border-[#CEC9BD]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#C92A2A] text-white' : 'bg-[#FAF9F5] text-[#585A62]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#C92A2A]' : 'text-[#141517]'}`}>
                      {opt.label}
                    </p>
                    <span className="text-[10px] text-[#8A8D96] font-medium">{opt.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Pre-Locked Telemetry Preview */}
        <div className="w-full mt-4 p-3 bg-[#FAF9F5] border border-[#E2E0D8] rounded-xl flex items-center justify-between text-left text-xs">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-[#2B8A3E] shrink-0" />
            <div className="truncate">
              <span className="font-bold text-[#141517] truncate block">
                {locationTelemetry.address || 'Jubilee Hills, Hyderabad'}
              </span>
              <span className="text-[11px] text-[#236E33] font-mono">
                GPS Locked · ±{locationTelemetry.accuracyMeters || 8}m Precision
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#585A62] shrink-0 pl-2">
            <Building2 className="w-3.5 h-3.5 text-[#8A8D96]" />
            <span className="text-[11px] font-medium">Apollo Hub (8m ETA)</span>
          </div>
        </div>

        {/* 6. Cancel False Alarm Button */}
        <div className="w-full mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancelEmergency}
            className="w-full py-2.5 bg-white border border-[#E2E0D8] hover:bg-[#FAF9F5] text-[#585A62] hover:text-[#141517] rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel / False Alarm</span>
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="mt-4 text-center text-xs text-[#8A8D96] max-w-md mx-auto">
        RoadSafe sends high-precision satellite telemetry directly to hospital triage and your registered emergency contacts simultaneously.
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import { useProductState } from '../context/ProductStateContext';
import { useToast } from '../context/ToastContext';
import {
  MapPin,
  ArrowRight,
  Shield,
  Phone,
  Radio,
  AlertOctagon,
  Activity,
  Navigation,
  Users,
  BookOpen,
} from 'lucide-react';

/* ── Inline SVG: Pulsing radar graphic for the emergency button ───── */
const RadarGraphic: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg viewBox="0 0 120 120" className="w-16 h-16 sm:w-20 sm:h-20" aria-hidden="true">
    <defs>
      <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Outer rings */}
    <circle cx="60" cy="60" r="55" stroke="white" strokeWidth="1" fill="none" opacity="0.15" />
    <circle cx="60" cy="60" r="42" stroke="white" strokeWidth="1" fill="none" opacity="0.2" />
    <circle cx="60" cy="60" r="28" stroke="white" strokeWidth="1.5" fill="none" opacity="0.3" />
    {/* Center glow */}
    <circle cx="60" cy="60" r="18" fill="url(#radarGlow)" />
    {/* SOS text */}
    <text x="60" y="65" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="inherit">
      SOS
    </text>
  </svg>
);

export const HomeView: React.FC = () => {
  const { navigate } = useRouter();
  const {
    currentUser,
    emergencyContacts,
    triggerEmergency,
    activeEmergencyCase,
    emergencyFlowStage,
    instantDispatchEmergency,
  } = useProductState();
  const { showToast } = useToast();

  // Hold-to-activate timer state
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = currentUser.name.split(' ')[0] || 'Driver';

  // Handle Instant Emergency Dispatch for hurried victims
  const handleInstantDispatch = (type: string = 'Road accident') => {
    cleanupHold();
    instantDispatchEmergency(type);
    showToast({
      type: 'emergency',
      title: '🚨 Emergency Broadcast Sent',
      message: 'Hospital ER and emergency contacts notified with high-precision GPS.',
    });
    navigate('/emergency/sent');
  };

  const handleCall112 = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast({
      type: 'emergency',
      title: 'Connecting to 112 Dispatch',
      message: 'Dialing 112 police and medical trauma dispatch operator...',
    });
  };

  // Handle Emergency Hold Interaction (3 seconds)
  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 2500; // streamlined to 2.5 seconds

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);
    }, 30);

    holdTimerRef.current = setTimeout(() => {
      cleanupHold();
      handleInstantDispatch('Road accident');
    }, duration);
  };

  const cancelHold = () => {
    if (isHolding && holdProgress < 100) {
      cleanupHold();
    }
  };

  const cleanupHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  useEffect(() => {
    return () => cleanupHold();
  }, []);

  // Quick click handler (if tapped directly without holding)
  const handleClickEmergency = () => {
    if (!isHolding) {
      navigate('/emergency');
    }
  };

  // Curated contacts preview with clean editorial formatting
  const previewContacts = emergencyContacts.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 sm:space-y-8 py-2 sm:py-4 max-w-4xl mx-auto"
    >
      {/* 1. Greeting with subtle status bar */}
      <section className="space-y-4 pt-1">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141517] leading-tight">
              {getGreeting()}, {firstName}.
            </h1>
            <p className="text-base sm:text-lg text-[#585A62] font-normal leading-relaxed">
              Stay safe. We'll handle the rest.
            </p>
          </div>

          {/* Live status pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#F2F9F3] border border-[#D2EED7] rounded-full text-xs font-medium text-[#236E33] shrink-0 mt-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B8A3E] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B8A3E]" />
            </span>
            <span className="hidden sm:inline">Network active</span>
          </motion.div>
        </div>

        {/* Quick stats strip — flowing, non-boxy */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap text-xs text-[#585A62]">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#8A8D96]" />
            <span>Hyderabad</span>
          </div>
          <span className="w-px h-3 bg-[#E2E0D8]" aria-hidden="true" />
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#8A8D96]" />
            <span>{emergencyContacts.length} contacts enrolled</span>
          </div>
          <span className="w-px h-3 bg-[#E2E0D8]" aria-hidden="true" />
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#8A8D96]" />
            <span>GPS ready</span>
          </div>
        </div>
      </section>

      {/* Active Alert Banner if emergency is ongoing */}
      {activeEmergencyCase && activeEmergencyCase.stage !== 'resolved' && emergencyFlowStage !== 'idle' && (
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#FDF2F2] to-[#FEF0F0] border border-[#F8D7DA] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-[0_1px_2px_rgba(201,42,42,0.06)]"
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C92A2A] animate-ping shrink-0" />
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-[#C92A2A] tracking-tight">
                Emergency Alert Active ({activeEmergencyCase.caseNumber})
              </h2>
              <p className="text-[#585A62] text-xs">
                Broadcast active at {activeEmergencyCase.location} · {activeEmergencyCase.type}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/emergency/sent')}
            className="self-start sm:self-center px-3.5 py-1.5 bg-[#C92A2A] hover:bg-[#B52525] text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
          >
            View Alert Status
          </button>
        </motion.section>
      )}

      {/* 2. Emergency Action — Rounded, organic, not a rectangle */}
      <section className="space-y-3">
        <motion.div
          whileHover={{ scale: 1.005, y: -2 }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          onClick={handleClickEmergency}
          role="button"
          tabIndex={0}
          aria-label="Emergency SOS. Hold for 2.5 seconds or tap for instant dispatch"
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/emergency');
            }
          }}
          className="relative w-full bg-gradient-to-br from-[#C92A2A] via-[#B52525] to-[#961F1F] text-white rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-[0_4px_20px_rgba(201,42,42,0.25),0_1px_3px_rgba(201,42,42,0.15)] cursor-pointer select-none overflow-hidden transition-shadow hover:shadow-[0_8px_32px_rgba(201,42,42,0.3)] focus-visible:outline-2 focus-visible:outline-[#141517] focus-visible:outline-offset-4"
        >
          {/* Organic decorative shapes */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/[0.05] pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-white/[0.04] pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/2 right-8 w-24 h-24 rounded-full bg-white/[0.03] pointer-events-none" aria-hidden="true" />

          {/* Hold progress fill overlay */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-white/10 transition-all pointer-events-none rounded-[2rem]"
            style={{ width: `${holdProgress}%` }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-center gap-5 sm:gap-8">
            {/* Radar visual */}
            <RadarGraphic isActive={isHolding} />

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-5 h-5 text-white/90 stroke-[2.2] shrink-0" />
                <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">
                  Emergency SOS
                </span>
              </div>

              <p className="text-sm sm:text-base font-medium text-white/90 tracking-wide">
                {isHolding ? `Activating... ${Math.round(holdProgress)}%` : 'Tap to open emergency or hold 2.5s'}
              </p>
              <p className="text-xs text-white/70">
                Instantly transmits high-accuracy GPS coordinates to Apollo Trauma Hospital
              </p>

              {/* Progress bar */}
              <div className="w-48 sm:w-64 h-1.5 bg-white/15 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-white/70 rounded-full transition-all duration-75"
                  style={{ width: `${holdProgress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hurried Emergency Quick-Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* 1-Tap Rapid Dispatch Button */}
          <button
            type="button"
            onClick={() => handleInstantDispatch('Road accident')}
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-gradient-to-r from-[#141517] to-[#2A2B2F] hover:from-[#2A2B2F] hover:to-[#3F4148] text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#C92A2A] animate-ping" />
            <span>1-Tap Instant SOS (Skip All Steps)</span>
          </button>

          {/* Direct 112 Hotline Call Button */}
          <button
            type="button"
            onClick={handleCall112}
            className="flex items-center justify-center gap-2 py-3.5 px-4 bg-white hover:bg-[#FDF2F2] border border-[#F8D7DA] text-[#C92A2A] rounded-2xl font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
          >
            <Phone className="w-4 h-4 text-[#C92A2A]" />
            <span>Call 112 Emergency Helpline</span>
          </button>
        </div>
      </section>

      {/* 3. Info strip — lightweight, no boxes */}
      <section className="flex items-center justify-between gap-2 py-2 px-1">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#2B8A3E]" />
          <span className="text-xs font-medium text-[#585A62]">All systems operational</span>
        </div>
        <div className="text-[11px] text-[#8A8D96]">
          Last check · just now
        </div>
      </section>

      {/* 4. Feature cards — organic, flowing layout */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Emergency Contacts */}
        <motion.button
          type="button"
          onClick={() => navigate('/contacts')}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="group relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-left cursor-pointer transition-all hover:border-[#CEC9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden"
        >
          {/* Subtle corner accent */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#364FC7]/[0.04] pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDF2FF] flex items-center justify-center">
              <Phone className="w-4.5 h-4.5 text-[#364FC7]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#141517] tracking-tight">
                Contacts
              </h3>
              <p className="text-xs text-[#8A8D96] mt-0.5">
                {previewContacts.length} enrolled
              </p>
            </div>

            {/* Mini contact list */}
            <div className="space-y-1.5 pt-1">
              {previewContacts.map((contact, idx) => (
                <div key={contact.id || idx} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FAF9F5] border border-[#EDECE7] flex items-center justify-center text-[9px] font-bold text-[#585A62]">
                    {contact.name.charAt(0)}
                  </div>
                  <span className="text-xs text-[#585A62] truncate">{contact.name}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-[#141517] group-hover:text-[#364FC7] transition-colors pt-1">
              <span>Manage</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </motion.button>

        {/* Safety Guide */}
        <motion.button
          type="button"
          onClick={() => navigate('/safety')}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="group relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-left cursor-pointer transition-all hover:border-[#CEC9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden"
        >
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-[#2B8A3E]/[0.05] pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F2F9F3] flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-[#2B8A3E]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#141517] tracking-tight">
                Safety Guide
              </h3>
              <p className="text-xs text-[#8A8D96] mt-0.5">
                Rules & tips
              </p>
            </div>

            {/* Today's tip preview */}
            <div className="bg-[#FAF9F5] rounded-xl p-3 space-y-1">
              <p className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider">Today's tip</p>
              <p className="text-xs text-[#585A62] leading-relaxed line-clamp-2">
                "Wear your helmet. Every ride. Every time."
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-[#141517] group-hover:text-[#2B8A3E] transition-colors pt-1">
              <span>Read more</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </motion.button>

        {/* Location */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="group relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-left overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-[#D97706]/[0.04] pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFFBEB] flex items-center justify-center">
              <MapPin className="w-4.5 h-4.5 text-[#D97706]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#141517] tracking-tight">
                Location
              </h3>
              <p className="text-xs text-[#8A8D96] mt-0.5">
                GPS telemetry
              </p>
            </div>

            {/* Location info */}
            <div className="space-y-2 pt-1">
              <p className="text-sm font-semibold text-[#141517]">Hyderabad, Telangana</p>
              <div className="flex items-center gap-1.5 text-xs text-[#2B8A3E] font-medium">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B8A3E] opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2B8A3E]" />
                </span>
                GPS active · High accuracy
              </div>
            </div>

            {/* Mini map placeholder graphic */}
            <div className="h-12 rounded-xl bg-gradient-to-br from-[#FAF9F5] to-[#EDECE7] border border-[#E2E0D8]/50 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-[#8A8D96]" />
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import { useProductState } from '../context/ProductStateContext';
import { useToast } from '../context/ToastContext';
import {
  CheckCircle2,
  MapPin,
  Users,
  Building2,
  PhoneCall,
  ArrowRight,
  Shield,
  ChevronRight,
  RotateCw,
  Ambulance,
  HeartPulse,
  FileText,
  X,
} from 'lucide-react';

import { IncidentCaseStage } from '../types';

export const EmergencySentView: React.FC = () => {
  const { navigate } = useRouter();
  const {
    currentUser,
    emergencyContacts,
    incidentCases,
    activeEmergencyCase,
    updateEmergencyStatus,
  } = useProductState();
  const { showToast } = useToast();

  const primaryContact = emergencyContacts.find(c => c.isPrimary) || emergencyContacts[0];

  const currentCase =
    activeEmergencyCase || incidentCases.find(c => c.id === '2041') || incidentCases[0];
  const caseId = currentCase?.id || '2041';
  const caseNumber = currentCase?.caseNumber || `#${caseId}`;
  const caseLocation = currentCase?.location || 'Jubilee Hills, Hyderabad';
  const caseAccuracy = currentCase?.accuracy || '±8 m';

  const currentCaseStage: IncidentCaseStage = currentCase?.stage || 'received';

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // 4-Stage Response Lifecycle: Alert received -> Hospital reviewing request -> Response team preparing -> Emergency response completed
  const progressionSteps: { id: IncidentCaseStage; label: string }[] = [
    { id: 'received', label: 'Alert received' },
    { id: 'acknowledged', label: 'Hospital reviewing' },
    { id: 'response_preparing', label: 'Team preparing' },
    { id: 'resolved', label: 'Completed' },
  ];

  const getStageIndex = (stage: IncidentCaseStage): number => {
    switch (stage) {
      case 'received':
        return 0;
      case 'acknowledged':
        return 1;
      case 'response_preparing':
        return 2;
      case 'resolved':
        return 3;
      default:
        return 0;
    }
  };

  const currentIdx = getStageIndex(currentCaseStage);

  const advanceStage = () => {
    if (currentCaseStage === 'received') {
      updateEmergencyStatus(caseId, 'acknowledged');
      showToast({
        type: 'info',
        title: 'Status Updated',
        message: 'Hospital emergency desk is reviewing the alert.',
      });
    } else if (currentCaseStage === 'acknowledged') {
      updateEmergencyStatus(caseId, 'response_preparing');
      showToast({
        type: 'success',
        title: 'Response Team Preparing',
        message: 'Trauma unit dispatched. Responders are preparing response.',
      });
    } else if (currentCaseStage === 'response_preparing') {
      updateEmergencyStatus(caseId, 'resolved');
      showToast({
        type: 'success',
        title: 'Emergency Response Completed',
        message: 'All emergency response protocols completed and resolved.',
      });
    } else {
      updateEmergencyStatus(caseId, 'received');
      showToast({
        type: 'info',
        title: 'Simulation Reset',
        message: 'Emergency flow reset to initial alert state.',
      });
    }
  };

  const handleSelectStage = (stageId: IncidentCaseStage) => {
    updateEmergencyStatus(caseId, stageId);
    showToast({
      type: 'info',
      title: 'Status Updated',
      message: `Emergency progress updated to: ${stageId.toUpperCase()}`,
    });
  };

  const handleCallEmergency = () => {
    showToast({
      type: 'emergency',
      title: 'Emergency Helpline Connected',
      message: 'Connecting to 112 emergency dispatch operator...',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl mx-auto py-2 sm:py-6 px-2 sm:px-0 space-y-6 sm:space-y-8 select-none"
    >
      {/* 1. Hero Header & Primary Status Banner */}
      <section className="relative text-center space-y-3.5 pt-2 pb-2">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 bg-gradient-to-r from-[#2B8A3E]/[0.06] via-[#364FC7]/[0.04] to-[#C92A2A]/[0.05] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        {/* Reference and status badges */}
        <div className="flex items-center justify-center gap-2 flex-wrap relative z-10">
          <span className="text-[11px] font-mono tracking-wider text-[#8A8D96] px-3 py-1 bg-white/90 backdrop-blur-sm border border-[#E2E0D8] rounded-full uppercase shadow-xs">
            CASE {caseNumber}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-[#F2F9F3] text-[#236E33] border border-[#D2EED7] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2B8A3E] animate-ping" />
            <span>DISPATCH BROADCAST ACTIVE</span>
          </span>
          <span className="text-[11px] font-mono text-[#585A62] px-3 py-1 bg-white/90 backdrop-blur-sm border border-[#E2E0D8] rounded-full shadow-xs hidden sm:inline">
            ETA: ~8 mins to scene
          </span>
        </div>

        {/* Primary Headline & Typography */}
        <div className="space-y-2 relative z-10">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141517]">
            {currentCaseStage === 'resolved'
              ? 'Emergency response completed.'
              : currentCaseStage === 'response_preparing'
              ? 'Trauma response team preparing.'
              : currentCaseStage === 'acknowledged'
              ? 'Hospital ER desk reviewing alert.'
              : 'Help is on the way.'}
          </h1>
          <p className="text-sm sm:text-base text-[#585A62] max-w-xl mx-auto leading-relaxed">
            {currentCaseStage === 'resolved'
              ? 'Your emergency response has been completed and verified by hospital triage.'
              : 'Your emergency alert and high-accuracy GPS coordinates have been broadcast to the hospital trauma network.'}
          </p>
        </div>
      </section>

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Live Telemetry Map & Visual Relay Flow */}
        <div className="lg:col-span-7 space-y-6">
          {/* A. Rich Interactive Route & Live GPS Map */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative bg-white/90 backdrop-blur-sm border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 overflow-hidden"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider">
                    Live Incident Telemetry
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2B8A3E] animate-pulse" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#141517] tracking-tight">
                  {caseLocation}
                </h2>
                <p className="text-xs font-mono text-[#585A62] tabular-nums">
                  GPS accuracy · <span className="text-[#236E33] font-semibold">{caseAccuracy}</span> (17.3850° N, 78.4867° E)
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F2F9F3] border border-[#D2EED7] rounded-full text-xs font-semibold text-[#236E33]">
                <span className="w-2 h-2 rounded-full bg-[#2B8A3E] animate-pulse" />
                <span>GIS Locked</span>
              </div>
            </div>

            {/* Rich Vector Map Graphic with Animated Route */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#FAF9F5] via-[#F4F3EE] to-[#EDECE7] border border-[#EDECE7] shadow-inner">
              {/* Grid and Highway Roads Vector Graphic */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="road-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E0D8" strokeWidth="0.8" opacity="0.6" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#road-grid-pattern)" />

                {/* Major Arterial Roads */}
                <path d="M -10 160 Q 180 120 360 140 T 800 100" fill="none" stroke="#DCD9D0" strokeWidth="8" strokeLinecap="round" />
                <path d="M -10 160 Q 180 120 360 140 T 800 100" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />

                <path d="M 120 -10 L 260 280" fill="none" stroke="#DCD9D0" strokeWidth="6" strokeLinecap="round" />
                <path d="M 120 -10 L 260 280" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

                <path d="M 420 -10 Q 380 120 460 280" fill="none" stroke="#DCD9D0" strokeWidth="6" strokeLinecap="round" />
                <path d="M 420 -10 Q 380 120 460 280" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

                {/* Animated Dispatch Trajectory Route from Apollo to Crash Site */}
                <path
                  d="M 520 40 Q 360 70 240 135"
                  fill="none"
                  stroke="#C92A2A"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />

                {/* Road Labels */}
                <text x="40" y="145" fill="#8A8D96" fontSize="10" fontFamily="sans-serif" fontWeight="600" opacity="0.8">Road No. 36</text>
                <text x="340" y="30" fill="#8A8D96" fontSize="9" fontFamily="sans-serif" fontWeight="600" opacity="0.8">Apollo Health City Way</text>
              </svg>

              {/* Destination Landmark: Apollo Emergency Centre (Top Right) */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E2E0D8] shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-[#EDF2FF] flex items-center justify-center text-[#364FC7]">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-[#141517]">Apollo Emergency ER</p>
                  <p className="text-[9px] font-mono text-[#585A62]">Trauma Unit 14</p>
                </div>
              </div>

              {/* Moving / Active Ambulance Node (Mid-route) */}
              <div className="absolute top-[42%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 bg-[#141517] text-white px-2.5 py-1 rounded-full shadow-md">
                <Ambulance className="w-3.5 h-3.5 text-[#FFD43B] animate-pulse" />
                <span className="text-[10px] font-mono font-semibold">Unit 14 · ~8m</span>
              </div>

              {/* Incident Scene Center Ping (Center Left) */}
              <div className="absolute top-[56%] left-[28%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                {/* Concentric radar beacon pulses */}
                <div className="absolute -inset-4 rounded-full bg-[#C92A2A]/15 animate-ping pointer-events-none" />
                <div className="absolute -inset-8 rounded-full bg-[#C92A2A]/10 animate-pulse pointer-events-none" />

                <div className="w-10 h-10 rounded-full bg-[#C92A2A] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(201,42,42,0.4)] ring-4 ring-white">
                  <MapPin className="w-5 h-5 fill-white" />
                </div>
                <span className="mt-1.5 px-2.5 py-0.5 bg-white/95 backdrop-blur-sm border border-[#E2E0D8] rounded-full text-[10px] font-mono font-bold text-[#141517] shadow-sm whitespace-nowrap">
                  Crash Scene · Locked
                </span>
              </div>

              {/* Map Footer HUD - Anchored to bottom */}
              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[10px] font-mono text-[#8A8D96]">
                <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#E2E0D8]/60 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2B8A3E]" />
                  <span>Telemetry Satellites: 9 Fixed</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#E2E0D8]/60 text-[#141517] font-semibold shadow-2xs">
                  Distance: 2.4 km to Apollo ER
                </div>
              </div>
            </div>
          </motion.section>

          {/* B. Visual Dispatch Pipeline & Telemetry Node Relay */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="relative bg-white/90 backdrop-blur-sm border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#EDECE7]/80">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider">
                  Dispatch Relay Pipeline
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#2B8A3E] bg-[#F2F9F3] border border-[#D2EED7] px-2.5 py-0.5 rounded-full font-medium">
                All Systems Operational
              </span>
            </div>

            {/* 4 Connected Nodes in Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Step 1: Alert Created */}
              <div className="p-3.5 bg-[#FAF9F5]/80 border border-[#EDECE7] rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8A8D96] uppercase">Node 01 · SOS Trigger</span>
                  <CheckCircle2 className="w-4 h-4 text-[#2B8A3E] stroke-[2.5]" />
                </div>
                <p className="text-sm font-bold text-[#141517]">Incident Alert Created</p>
                <p className="text-xs text-[#585A62]">Case {caseNumber} logged with coordinates</p>
              </div>

              {/* Step 2: Emergency Contact */}
              <div className="p-3.5 bg-[#FAF9F5]/80 border border-[#EDECE7] rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8A8D96] uppercase">Node 02 · Family Alert</span>
                  <CheckCircle2 className="w-4 h-4 text-[#2B8A3E] stroke-[2.5]" />
                </div>
                <p className="text-sm font-bold text-[#141517]">Contact Dispatched</p>
                <p className="text-xs text-[#585A62]">{primaryContact?.name} ({primaryContact?.phone})</p>
              </div>

              {/* Step 3: Hospital Notified */}
              <div className="p-3.5 bg-[#FAF9F5]/80 border border-[#EDECE7] rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8A8D96] uppercase">Node 03 · Institutional</span>
                  <CheckCircle2 className="w-4 h-4 text-[#2B8A3E] stroke-[2.5]" />
                </div>
                <p className="text-sm font-bold text-[#141517]">Apollo Trauma Notified</p>
                <p className="text-xs text-[#585A62]">Direct institutional relay packet sent</p>
              </div>

              {/* Step 4: Hospital Intake */}
              <div className="p-3.5 bg-[#FAF9F5]/80 border border-[#EDECE7] rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8A8D96] uppercase">Node 04 · ER Desk</span>
                  <CheckCircle2 className="w-4 h-4 text-[#2B8A3E] stroke-[2.5]" />
                </div>
                <p className="text-sm font-bold text-[#141517]">Alert Received at Desk</p>
                <p className="text-xs text-[#585A62]">Triage operator actively reviewing</p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Right Column (5 cols): Response Tracking & Immediate Responders */}
        <div className="lg:col-span-5 space-y-6">
          {/* C. Emergency Response Lifecycle Progression Stepper */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative bg-white/90 backdrop-blur-sm border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider">
                  Emergency response
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      currentCaseStage === 'resolved' ? 'bg-[#2B8A3E]' : 'bg-[#2B8A3E] animate-pulse'
                    }`}
                  />
                  <h3 className="text-base font-bold text-[#141517]">
                    {currentCaseStage === 'received' && 'Alert received'}
                    {currentCaseStage === 'acknowledged' && 'Hospital is reviewing alert'}
                    {currentCaseStage === 'response_preparing' && 'Response team is preparing'}
                    {currentCaseStage === 'resolved' && 'Response completed'}
                  </h3>
                </div>
              </div>

              {/* Simulation State Trigger */}
              <button
                id="emergency-simulate-next-button"
                type="button"
                onClick={advanceStage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#585A62] hover:text-[#141517] bg-[#FAF9F5] hover:bg-[#F2F1EA] border border-[#E2E0D8] rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                title="Click to advance simulated hospital response state"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#8A8D96]" />
                <span>Next state</span>
              </button>
            </div>

            {/* Step Selection List */}
            <div className="space-y-2 pt-1 relative z-10">
              {progressionSteps.map((step, idx) => {
                const isCurrent = currentCaseStage === step.id;
                const isPast = idx < currentIdx;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleSelectStage(step.id)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#141517] text-white border-[#141517] shadow-sm'
                        : isPast
                        ? 'bg-[#F2F9F3]/60 border-[#D2EED7] text-[#236E33]'
                        : 'bg-[#FAF9F5]/60 border-[#EDECE7] text-[#8A8D96] hover:text-[#141517]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                          isCurrent
                            ? 'bg-white text-[#141517]'
                            : isPast
                            ? 'bg-[#2B8A3E] text-white'
                            : 'bg-[#E2E0D8] text-[#585A62]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold">{step.label}</span>
                    </div>

                    <span className="text-[10px] font-mono">
                      {isCurrent ? 'ACTIVE' : isPast ? 'DONE' : 'PENDING'}
                    </span>
                  </button>
                );
              })}

              {/* Progress bar track */}
              <div className="w-full h-2 bg-[#EDECE7] rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-[#141517] to-[#3F4148] transition-all duration-300 rounded-full"
                  style={{
                    width: `${((currentIdx + 1) / progressionSteps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Resolution notification banner */}
            {currentCaseStage === 'resolved' && (
              <div className="p-3 bg-[#F2F9F3] border border-[#D2EED7] rounded-2xl flex items-center gap-2.5 text-xs text-[#236E33] font-medium relative z-10">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2B8A3E]" />
                <span>Emergency response completed · Field assistance dispatched and site secured.</span>
              </div>
            )}
          </motion.section>

          {/* D. Emergency Circle & Assigned Unit Card */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="relative bg-white/90 backdrop-blur-sm border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[#EDECE7]/80 pb-2">
              <span className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider">
                Emergency Recipients
              </span>
              <span className="text-xs font-semibold text-[#2B8A3E]">Verified</span>
            </div>

            {/* Primary Contact */}
            {primaryContact && (
              <div className="p-3 bg-[#FAF9F5] border border-[#EDECE7]/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#EDECE7] flex items-center justify-center font-bold text-[#141517] shadow-xs">
                    {primaryContact.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#141517]">{primaryContact.name}</p>
                    <p className="text-[#585A62]">{primaryContact.relationship} · <span className="font-mono text-[#141517]">{primaryContact.phone}</span></p>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#236E33] bg-[#F2F9F3] border border-[#D2EED7] px-2 py-0.5 rounded-full font-semibold uppercase shrink-0">
                  SMS Sent
                </span>
              </div>
            )}

            {/* Assigned Hospital */}
            <div className="p-3 bg-[#FAF9F5] border border-[#EDECE7]/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EDF2FF] border border-[#D0EBFF] flex items-center justify-center font-bold text-[#364FC7] shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#141517]">Apollo Emergency ER</p>
                  <p className="text-[#585A62]">Trauma Unit 14 Assigned</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#364FC7] bg-[#EDF2FF] border border-[#D0EBFF] px-2 py-0.5 rounded-full font-semibold uppercase shrink-0">
                Connected
              </span>
            </div>

            {/* Direct Voice Hotline 112 Banner */}
            <div className="pt-1 flex items-center justify-between p-3.5 bg-gradient-to-r from-[#FDF2F2] to-[#FAF9F5] border border-[#F8D7DA] rounded-2xl text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#C92A2A]">
                  Direct Voice Lifeline 112
                </p>
                <p className="text-[#585A62]">
                  Emergency dispatch operator on standby.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCallEmergency}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#C92A2A] hover:bg-[#B52525] text-white font-bold rounded-xl transition-all cursor-pointer shrink-0 shadow-sm active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 112</span>
              </button>
            </div>
          </motion.section>

          {/* E. Action Buttons */}
          <section className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#141517] via-[#2A2B2F] to-[#141517] hover:from-[#2A2B2F] hover:to-[#3F4148] text-white font-semibold text-sm rounded-2xl transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99]"
            >
              <span>View incident details</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate(`/hospital/emergencies/${caseId}` as any)}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold text-[#585A62] hover:text-[#141517] bg-white hover:bg-[#FAF9F5] border border-[#E2E0D8]/80 rounded-2xl transition-all cursor-pointer shadow-xs hover:shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Open hospital response console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/home')}
              className="w-full py-2 text-xs font-medium text-[#8A8D96] hover:text-[#141517] transition-colors cursor-pointer"
            >
              Return home
            </button>
          </section>
        </div>
      </div>

      {/* 6. Emergency Details Slide-over / Modal (When Primary Action Clicked) */}
      <AnimatePresence>
        {showDetailsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#E2E0D8] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EDECE7]">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[#8A8D96] uppercase">
                    Incident Record
                  </span>
                  <h3 className="text-base font-bold text-[#141517]">
                    Emergency Details · CASE {caseNumber}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1.5 text-[#8A8D96] hover:text-[#141517] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Patient Vitals & Telemetry */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#FAF9F5] border border-[#EDECE7] rounded-xl space-y-2">
                  <p className="font-semibold text-[#141517]">Patient & Vehicle</p>
                  <div className="grid grid-cols-2 gap-2 text-[#585A62]">
                    <div>Name: <span className="font-medium text-[#141517]">{currentUser.name}</span></div>
                    <div>Blood Group: <span className="font-medium text-[#141517]">{currentUser.bloodGroup}</span></div>
                    <div>Vehicle: <span className="font-medium text-[#141517]">{currentUser.vehicle.make} {currentUser.vehicle.model}</span></div>
                    <div>Plate: <span className="font-medium text-[#141517] font-mono">{currentUser.vehicle.licensePlate}</span></div>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#EDECE7] rounded-xl space-y-2">
                  <p className="font-semibold text-[#141517]">Assigned Medical Responder</p>
                  <div className="space-y-1 text-[#585A62]">
                    <div className="flex justify-between">
                      <span>Hospital:</span>
                      <span className="font-medium text-[#141517]">Apollo Emergency Hospital, Jubilee Hills</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unit:</span>
                      <span className="font-medium text-[#141517]">Trauma Medic Unit 14</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated ETA:</span>
                      <span className="font-medium text-[#236E33]">~8 minutes</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#EDECE7] rounded-xl space-y-2">
                  <p className="font-semibold text-[#141517]">Contacts Dispatched</p>
                  <ul className="space-y-1.5 text-[#585A62]">
                    {[...emergencyContacts]
                      .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
                      .slice(0, 3)
                      .map(c => (
                        <li key={c.id} className="flex justify-between items-center">
                          <span>
                            {c.name} ({c.relationship})
                            {c.isPrimary && (
                              <span className="ml-1.5 text-[9px] font-mono text-[#236E33] bg-[#F2F9F3] border border-[#D2EED7] px-1 py-0.2 rounded uppercase">
                                Primary
                              </span>
                            )}
                          </span>
                          <span className="font-mono text-[#141517]">{c.phone}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full py-2.5 bg-[#141517] text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

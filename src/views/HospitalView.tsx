import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import { useProductState } from '../context/ProductStateContext';
import { useToast } from '../context/ToastContext';
import {
  Building2,
  AlertOctagon,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Shield,
  Phone,
  ArrowLeft,
  Settings,
  User,
  Radio,
  Ambulance,
  Compass,
  AlertTriangle,
  RotateCcw,
  Activity,
  Zap,
  HeartPulse,
} from 'lucide-react';

import { IncidentCase, IncidentCaseStage } from '../types';

export const HospitalView: React.FC = () => {
  const { navigate } = useRouter();
  const {
    emergencyContacts,
    currentUser,
    emergencyStatus,
    incidentCases,
    updateIncidentCaseStage,
  } = useProductState();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'queue' | 'status' | 'settings'>('queue');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('2041');

  const cases = incidentCases;
  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  // Counts for operational overview
  const activeCount = cases.filter(c => c.stage !== 'resolved').length;
  const awaitingCount = cases.filter(c => c.stage === 'received').length;
  const resolvedCount = cases.filter(c => c.stage === 'resolved').length + 6; // + 6 previous cases today

  // Action handlers with guards
  const handleAcknowledge = (caseId: string) => {
    const targetCase = cases.find(c => c.id === caseId);
    if (!targetCase || targetCase.stage !== 'received') {
      showToast({
        type: 'warning',
        title: 'Action Prohibited',
        message: 'This case has already been acknowledged.',
      });
      return;
    }
    updateIncidentCaseStage(caseId, 'acknowledged');
    showToast({
      type: 'info',
      title: 'Case Acknowledged',
      message: `Emergency Desk acknowledged Case #${caseId}.`,
    });
  };

  const handlePrepareResponse = (caseId: string) => {
    const targetCase = cases.find(c => c.id === caseId);
    if (!targetCase || targetCase.stage !== 'acknowledged') {
      showToast({
        type: 'warning',
        title: 'Action Prohibited',
        message: 'Case must be acknowledged before preparing response.',
      });
      return;
    }
    updateIncidentCaseStage(caseId, 'response_preparing');
    showToast({
      type: 'info',
      title: 'Response Team Notified',
      message: `Trauma Unit & Medic Crew dispatched for Case #${caseId}.`,
    });
  };

  const handleResolve = (caseId: string) => {
    const targetCase = cases.find(c => c.id === caseId);
    if (!targetCase || targetCase.stage !== 'response_preparing') {
      showToast({
        type: 'warning',
        title: 'Action Prohibited',
        message: 'Response preparation must be active before resolving case.',
      });
      return;
    }
    updateIncidentCaseStage(caseId, 'resolved');
    showToast({
      type: 'success',
      title: 'Case Resolved',
      message: `Case #${caseId} marked as treated and resolved.`,
    });
  };

  const handleReopen = (caseId: string) => {
    updateIncidentCaseStage(caseId, 'received');
    showToast({
      type: 'info',
      title: 'Case Reopened',
      message: `Case #${caseId} returned to review queue.`,
    });
  };

  // Progression steps configuration
  const stages: { key: IncidentCaseStage; label: string }[] = [
    { key: 'received', label: 'Alert received' },
    { key: 'acknowledged', label: 'Case acknowledged' },
    { key: 'response_preparing', label: 'Response preparing' },
    { key: 'resolved', label: 'Resolved' },
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto py-2 sm:py-4 space-y-6 sm:space-y-8 select-none"
    >
      {/* 1. Hospital Header — organic, flowing */}
      <header className="relative bg-white/80 backdrop-blur-md border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#364FC7]/[0.03] pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[#2B8A3E]/[0.04] pointer-events-none" aria-hidden="true" />

        {/* Left: Branding & Sub-kicker */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#141517] to-[#2A2B2F] text-white flex items-center justify-center font-bold text-sm tracking-tight shrink-0 shadow-md">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#141517] tracking-tight">
                RoadSafe Hospital
              </h1>
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 bg-[#FAF9F5] border border-[#E2E0D8] text-[#585A62] rounded-lg">
                Portal
              </span>
            </div>
            <p className="text-xs text-[#8A8D96]">
              Emergency Response Centre · Apollo Emergency Centre
            </p>
          </div>
        </div>

        {/* Center: Portal Nav Tabs — pill style */}
        <div className="flex items-center gap-1 border-t md:border-t-0 pt-3 md:pt-0 border-[#EDECE7] bg-[#FAF9F5]/60 rounded-xl p-1 relative z-10">
          {[
            { id: 'queue', label: 'Emergency Queue' },
            { id: 'status', label: 'Hospital Status' },
            { id: 'settings', label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#141517] text-white shadow-md'
                  : 'text-[#585A62] hover:text-[#141517] hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Hospital Online indicator & Exit to Driver App */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#EDECE7] relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-[#236E33] font-medium bg-[#F2F9F3] border border-[#D2EED7] px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B8A3E] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B8A3E]" />
            </span>
            <span>Hospital Online</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-1.5 text-xs text-[#585A62] hover:text-[#141517] px-3 py-1.5 rounded-xl border border-[#E2E0D8] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
            title="Switch back to Driver screen"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Driver view</span>
          </button>
        </div>
      </header>

      {/* Tab: Hospital Status View */}
      {activeTab === 'status' && (
        <section className="space-y-5">
          <div className="space-y-1 px-1">
            <h2 className="text-xl font-bold text-[#141517]">Hospital Facility Telemetry</h2>
            <p className="text-xs sm:text-sm text-[#585A62]">
              Real-time resource capacity for Apollo Emergency Centre, Jubilee Hills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Trauma Bays */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-2 overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#2B8A3E]/[0.05] pointer-events-none" aria-hidden="true" />
              <div className="w-10 h-10 rounded-2xl bg-[#F2F9F3] flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-[#2B8A3E]" />
              </div>
              <span className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider">Trauma Bays</span>
              <p className="text-2xl font-bold font-mono text-[#141517]">04 / 06</p>
              <p className="text-xs text-[#2B8A3E] font-medium">Available for intake</p>
            </motion.div>

            {/* Ambulance Units */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-2 overflow-hidden"
            >
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-[#364FC7]/[0.04] pointer-events-none" aria-hidden="true" />
              <div className="w-10 h-10 rounded-2xl bg-[#EDF2FF] flex items-center justify-center">
                <Ambulance className="w-5 h-5 text-[#364FC7]" />
              </div>
              <span className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider">Ambulance Units</span>
              <p className="text-2xl font-bold font-mono text-[#141517]">02 Active</p>
              <p className="text-xs text-[#585A62]">Unit 14 on standby</p>
            </motion.div>

            {/* Emergency Desk */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-2 overflow-hidden"
            >
              <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-[#D97706]/[0.04] pointer-events-none" aria-hidden="true" />
              <div className="w-10 h-10 rounded-2xl bg-[#FFFBEB] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#D97706]" />
              </div>
              <span className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider">Emergency Desk</span>
              <p className="text-2xl font-bold font-mono text-[#141517]">Online</p>
              <p className="text-xs text-[#2B8A3E] font-medium">Latency &lt; 150ms</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Tab: Settings View */}
      {activeTab === 'settings' && (
        <section className="space-y-5">
          <div className="space-y-1 px-1">
            <h2 className="text-xl font-bold text-[#141517]">Dispatch Gateway Preferences</h2>
            <p className="text-xs sm:text-sm text-[#585A62]">
              Configure incoming RoadSafe alert channels and radius filters.
            </p>
          </div>

          <div className="space-y-3 pt-1 max-w-md text-xs sm:text-sm">
            <label className="flex items-center justify-between p-4 bg-white border border-[#E2E0D8]/70 rounded-2xl hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow cursor-pointer">
              <div>
                <p className="font-semibold text-[#141517]">Audible Tone on New Alert</p>
                <p className="text-xs text-[#8A8D96]">Play subtle chime when severe incident received</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#141517]" />
            </label>

            <label className="flex items-center justify-between p-4 bg-white border border-[#E2E0D8]/70 rounded-2xl hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow cursor-pointer">
              <div>
                <p className="font-semibold text-[#141517]">Reception Radius Limit</p>
                <p className="text-xs text-[#8A8D96]">Default triage corridor: 15 km</p>
              </div>
              <span className="font-mono text-xs font-semibold text-[#141517]">15 km</span>
            </label>
          </div>
        </section>
      )}

      {/* Tab: Emergency Queue View (Main Hospital Workflow) */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {/* 2. Emergency Overview */}
          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141517]">
                Emergency response
              </h2>
              <p className="text-xs sm:text-sm text-[#585A62]">
                Monitor incoming RoadSafe alerts and coordinate the next response.
              </p>
            </div>

            {/* Metric pills — flowing, non-boxy */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 px-3.5 py-2 bg-[#FDF2F2] border border-[#F8D7DA]/60 rounded-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C92A2A]" />
                <span className="font-bold text-[#141517] text-sm tabular-nums">
                  {String(activeCount).padStart(2, '0')}
                </span>
                <span className="text-xs text-[#585A62]">Active</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 bg-[#FFFBEB] border border-[#FDE68A]/60 rounded-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                <span className="font-bold text-[#141517] text-sm tabular-nums">
                  {String(awaitingCount).padStart(2, '0')}
                </span>
                <span className="text-xs text-[#585A62]">Awaiting</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 bg-[#F2F9F3] border border-[#D2EED7]/60 rounded-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2B8A3E]" />
                <span className="font-bold text-[#141517] text-sm tabular-nums">
                  {String(resolvedCount).padStart(2, '0')}
                </span>
                <span className="text-xs text-[#585A62]">Resolved today</span>
              </div>
            </div>
          </section>

          {/* Two-Zone Operational Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 3. Incoming Emergency Queue (Left Column: 7 cols) */}
            <section className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
                  Incoming emergencies
                </h3>
                <span className="text-xs text-[#8A8D96] font-mono">
                  {cases.length} in triage queue
                </span>
              </div>

              {awaitingCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-gradient-to-r from-[#FDF2F2] to-[#FEF0F0] border border-[#F8D7DA]/70 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C92A2A] opacity-60" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C92A2A]" />
                    </span>
                    <span className="font-bold text-[#C92A2A]">New emergency received</span>
                    <span className="text-[#8A8D96]">·</span>
                    <span className="text-[#585A62]">Awaiting review</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#C92A2A] font-semibold">
                    {awaitingCount} {awaitingCount === 1 ? 'alert' : 'alerts'} pending
                  </span>
                </motion.div>
              )}

              {cases.length === 0 ? (
                /* Empty State */
                <div className="p-10 text-center bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#F2F9F3] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 text-[#2B8A3E]" />
                  </div>
                  <p className="text-sm font-semibold text-[#141517]">No active emergencies</p>
                  <p className="text-xs text-[#585A62]">
                    New RoadSafe alerts will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cases.map(item => {
                    const isSelected = item.id === selectedCaseId;
                    const isAwaiting = item.stage === 'received';
                    const isResolved = item.stage === 'resolved';

                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -1 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setSelectedCaseId(item.id)}
                        className={`relative p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all rounded-2xl border overflow-hidden ${
                          isSelected
                            ? 'bg-white border-[#141517]/20 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                            : 'bg-white/70 border-[#E2E0D8]/70 hover:bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
                        }`}
                      >
                        {/* Selected indicator */}
                        {isSelected && (
                          <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#141517] rounded-r-full" aria-hidden="true" />
                        )}

                        <div className="space-y-1 min-w-0 pl-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#141517]">
                              #{item.id}
                            </span>
                            <span className="text-xs font-semibold text-[#141517]">
                              {item.incidentType}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-lg uppercase ${
                                item.priority === 'HIGH'
                                  ? 'bg-[#FDF2F2] text-[#C92A2A] border border-[#F8D7DA]'
                                  : 'bg-[#FAF9F5] text-[#585A62] border border-[#E2E0D8]'
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-[#585A62]">
                            <span className="truncate">{item.location}</span>
                            <span>·</span>
                            <span className="font-mono text-[11px] text-[#8A8D96] shrink-0">
                              {item.distance}
                            </span>
                          </div>
                        </div>

                        {/* Status, Open Case Action & Timing */}
                        <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                          <div className="text-left sm:text-right space-y-0.5">
                            <span
                              className={`text-xs font-medium inline-block ${
                                isAwaiting
                                  ? 'text-[#C92A2A]'
                                  : isResolved
                                  ? 'text-[#236E33]'
                                  : 'text-[#141517]'
                              }`}
                            >
                              {item.stage === 'received' && 'Awaiting review'}
                              {item.stage === 'acknowledged' && 'Acknowledged'}
                              {item.stage === 'response_preparing' && 'Response preparing'}
                              {item.stage === 'resolved' && 'Resolved'}
                            </span>
                            <p className="text-[11px] font-mono text-[#8A8D96]">
                              {item.receivedTime}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/hospital/emergencies/${item.id}` as any);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#141517] bg-white hover:bg-[#FAF9F5] border border-[#E2E0D8] rounded-xl transition-colors cursor-pointer"
                            title={`Open case #${item.id}`}
                          >
                            <span>Open case</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 4. Active Emergency & Response Console (Right Column: 5 cols) */}
            <section className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
                  Active case detail
                </h3>
                <span className="text-xs font-mono text-[#8A8D96]">
                  CASE #{selectedCase.id}
                </span>
              </div>

              <div className="relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] space-y-6 overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#C92A2A]/[0.03] pointer-events-none" aria-hidden="true" />

                {/* Header of Active Case */}
                <div className="space-y-1 pb-4 border-b border-[#EDECE7]/80 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#8A8D96]">
                      CASE #{selectedCase.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg uppercase ${
                        selectedCase.priority === 'HIGH'
                          ? 'bg-[#FDF2F2] text-[#C92A2A] border border-[#F8D7DA]'
                          : 'bg-[#FAF9F5] text-[#585A62] border border-[#E2E0D8]'
                      }`}
                    >
                      {selectedCase.priority} PRIORITY
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#141517] tracking-tight">
                    {selectedCase.stage === 'received'
                      ? 'New emergency received'
                      : `${selectedCase.incidentType} reported`}
                  </h4>
                  <p className="text-xs text-[#585A62]">
                    {selectedCase.stage === 'received'
                      ? 'Awaiting review · Transmitted via RoadSafe automated collision/SOS telemetry.'
                      : 'Transmitted via RoadSafe automated collision/SOS telemetry.'}
                  </p>
                </div>

                {/* 6. Compact Horizontal Response Progression */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8D96]">
                    Response progress
                  </p>
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {stages.map((st, i) => {
                      const currentIndex = getStageIndex(selectedCase.stage);
                      const isComplete = i <= currentIndex;
                      const isCurrent = i === currentIndex;

                      return (
                        <div key={st.key} className="space-y-1.5">
                          <div
                            className={`h-2 rounded-full transition-colors ${
                              isCurrent
                                ? selectedCase.stage === 'resolved'
                                  ? 'bg-[#2B8A3E]'
                                  : 'bg-[#141517]'
                                : isComplete
                                ? 'bg-[#2B8A3E]'
                                : 'bg-[#EDECE7]'
                            }`}
                          />
                          <p
                            className={`text-[10px] leading-tight transition-colors ${
                              isCurrent
                                ? 'font-bold text-[#141517]'
                                : isComplete
                                ? 'text-[#236E33] font-medium'
                                : 'text-[#8A8D96]'
                            }`}
                          >
                            {st.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Field Grid — rounded inner cards */}
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-[#FAF9F5]/80 border border-[#EDECE7]/70 rounded-2xl space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-[#8A8D96]">Location</span>
                      <span className="font-semibold text-[#141517] text-right">
                        {selectedCase.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A8D96]">Received</span>
                      <span className="font-mono text-[#141517]">{selectedCase.receivedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A8D96]">Location accuracy</span>
                      <span className="font-mono text-[#236E33] font-semibold">{selectedCase.accuracy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A8D96]">Emergency contact</span>
                      <span className="font-medium text-[#141517] text-right">
                        {selectedCase.contactStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A8D96]">Hospital status</span>
                      <span className="font-medium text-[#141517]">
                        {selectedCase.stage === 'received' && 'Alert received'}
                        {selectedCase.stage === 'acknowledged' && 'Case acknowledged'}
                        {selectedCase.stage === 'response_preparing' && 'Response team notified'}
                        {selectedCase.stage === 'resolved' && 'Case resolved'}
                      </span>
                    </div>
                  </div>

                  {/* Patient/Driver Medical Record Context */}
                  <div className="p-3.5 bg-[#FAF9F5]/80 border border-[#EDECE7]/70 rounded-2xl space-y-2">
                    <p className="text-[11px] font-semibold uppercase text-[#8A8D96]">
                      Driver & Vehicle Packet
                    </p>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8A8D96]">Patient:</span>
                      <span className="font-semibold text-[#141517]">{selectedCase.patientName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8A8D96]">Blood Group:</span>
                      <span className="font-mono font-bold text-[#C92A2A]">{selectedCase.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8A8D96]">Vehicle:</span>
                      <span className="font-mono text-[#141517]">{selectedCase.vehicle}</span>
                    </div>
                  </div>

                  {/* Location map preview */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase text-[#8A8D96]">
                      Location coordinates
                    </p>
                    <div className="relative h-28 w-full bg-gradient-to-br from-[#FAF9F5] to-[#EDECE7]/50 border border-[#E2E0D8]/70 rounded-2xl overflow-hidden flex flex-col justify-between p-3.5">
                      {/* Stylized road network lines */}
                      <svg
                        className="absolute inset-0 w-full h-full text-[#E2E0D8]/60 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line x1="0" y1="35" x2="100%" y2="35" stroke="currentColor" strokeWidth="2" />
                        <line x1="0" y1="80" x2="100%" y2="80" stroke="currentColor" strokeWidth="3" />
                        <line x1="35%" y1="0" x2="35%" y2="100%" stroke="currentColor" strokeWidth="2" />
                        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="currentColor" strokeWidth="2" />
                      </svg>

                      {/* Map Pin Target */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#E2E0D8] shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-[#C92A2A]" />
                        <span className="text-[11px] font-semibold text-[#141517]">
                          Incident point ({selectedCase.distance})
                        </span>
                      </div>

                      <div className="z-10 flex justify-between text-[10px] font-mono text-[#8A8D96]">
                        <span>RoadSafe GIS Node</span>
                        <span>17.3850° N, 78.4867° E</span>
                      </div>
                      <div className="z-10 text-[10px] text-[#8A8D96]">
                        {selectedCase.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Progressive Operational Case Actions */}
                <div className="pt-2 space-y-2">
                  {selectedCase.stage === 'received' && (
                    <button
                      type="button"
                      onClick={() => handleAcknowledge(selectedCase.id)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#141517] to-[#2A2B2F] hover:from-[#2A2B2F] hover:to-[#3A3B3F] text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Acknowledge case</span>
                    </button>
                  )}

                  {selectedCase.stage === 'acknowledged' && (
                    <button
                      type="button"
                      onClick={() => handlePrepareResponse(selectedCase.id)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#141517] to-[#2A2B2F] hover:from-[#2A2B2F] hover:to-[#3A3B3F] text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                    >
                      <Ambulance className="w-4 h-4" />
                      <span>Prepare response</span>
                    </button>
                  )}

                  {selectedCase.stage === 'response_preparing' && (
                    <button
                      type="button"
                      onClick={() => handleResolve(selectedCase.id)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#2B8A3E] to-[#236E33] hover:from-[#236E33] hover:to-[#1A5C29] text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(43,138,62,0.2)]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark resolved</span>
                    </button>
                  )}

                  {selectedCase.stage === 'resolved' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-[#F2F9F3] border border-[#D2EED7] rounded-2xl text-center text-xs text-[#236E33] font-medium flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Case successfully handled & archived</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleReopen(selectedCase.id)}
                        className="w-full py-2 text-xs text-[#585A62] hover:text-[#141517] transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reopen in active queue</span>
                      </button>
                    </div>
                  )}

                  {/* Link to Full Case Details Route */}
                  <div className="pt-2 border-t border-[#EDECE7]/80">
                    <button
                      type="button"
                      onClick={() => navigate(`/hospital/emergencies/${selectedCase.id}` as any)}
                      className="w-full py-2.5 px-3 text-xs font-semibold text-[#141517] hover:bg-[#FAF9F5] border border-[#E2E0D8] rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Open case</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </motion.div>
  );
};

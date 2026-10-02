import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import { useProductState } from '../context/ProductStateContext';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Ambulance,
  Phone,
  Radio,
  Building2,
  Maximize2,
  Minimize2,
  AlertOctagon,
  Users,
  Check,
  ExternalLink,
} from 'lucide-react';

import { IncidentCaseStage } from '../types';

interface HospitalCaseDetailViewProps {
  caseId: string;
}

type CaseStage = IncidentCaseStage;

export const HospitalCaseDetailView: React.FC<HospitalCaseDetailViewProps> = ({ caseId }) => {
  const { navigate } = useRouter();
  const {
    emergencyContacts,
    currentUser,
    incidentCases,
    updateIncidentCaseStage,
  } = useProductState();
  const { showToast } = useToast();

  const primaryContact = emergencyContacts.find(c => c.isPrimary) || emergencyContacts[0];

  // Resolve matching incident from central state
  const matchingIncident = incidentCases.find(c => c.id === caseId);

  if (!matchingIncident) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#FDF2F2] border border-[#F8D7DA] flex items-center justify-center mx-auto text-[#C92A2A]">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#141517]">Case #{caseId} Not Found</h2>
        <p className="text-sm text-[#585A62]">
          This emergency record does not exist in the active hospital emergency registry or has been archived.
        </p>
        <button
          type="button"
          onClick={() => navigate('/hospital')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#141517] text-white rounded-2xl text-xs font-semibold hover:bg-[#2A2B2F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Emergency Queue</span>
        </button>
      </div>
    );
  }

  const baseData = {
    id: matchingIncident.id,
    incidentType: matchingIncident.incidentType,
    status: (matchingIncident.stage === 'resolved' ? 'RESOLVED' : 'ACTIVE') as 'ACTIVE' | 'RESOLVED',
    receivedTime: matchingIncident.receivedTime,
    priority: (matchingIncident.priority === 'HIGH' ? 'HIGH PRIORITY' : 'MEDIUM PRIORITY') as 'HIGH PRIORITY' | 'MEDIUM PRIORITY',
    location: matchingIncident.location,
    accuracy: matchingIncident.accuracy,
    reportedBy: 'RoadSafe user',
    contactName: primaryContact?.name || 'Ananya Rao',
    contactRelation: primaryContact?.relationship || 'Sister',
    contactPhone: primaryContact?.phone || '+91 98490 12345',
  };

  const currentStage: CaseStage = matchingIncident.stage;
  const [mapExpanded, setMapExpanded] = useState<boolean>(false);

  // Transition Handlers with guards
  const handleAcknowledge = () => {
    if (currentStage !== 'received') {
      showToast({
        type: 'warning',
        title: 'Action Prohibited',
        message: 'This case has already been acknowledged.',
      });
      return;
    }
    updateIncidentCaseStage(baseData.id, 'acknowledged');
    showToast({
      type: 'info',
      title: 'Case Acknowledged',
      message: `Emergency Desk acknowledged Case #${baseData.id}.`,
    });
  };

  const handlePrepareResponse = () => {
    if (currentStage !== 'acknowledged') {
      showToast({
        type: 'warning',
        title: 'Action Prohibited',
        message: 'Case must be acknowledged before preparing response.',
      });
      return;
    }
    updateIncidentCaseStage(baseData.id, 'response_preparing');
    showToast({
      type: 'info',
      title: 'Response Team Notified',
      message: `Trauma response crew notified for Case #${baseData.id}.`,
    });
  };

  const handleResolve = () => {
    if (currentStage !== 'response_preparing') {
      showToast({
        type: 'warning',
        title: 'Action Prohibited',
        message: 'Response preparation must be active before resolving case.',
      });
      return;
    }
    updateIncidentCaseStage(baseData.id, 'resolved');
    showToast({
      type: 'success',
      title: 'Case Marked Resolved',
      message: `Case #${baseData.id} marked treated and archived.`,
    });
  };

  // Timeline configuration
  const timelineStages: {
    key: CaseStage;
    number: string;
    label: string;
    timestamp: string;
    description: string;
  }[] = [
    {
      key: 'received',
      number: '01',
      label: 'Alert received',
      timestamp: baseData.receivedTime,
      description: 'Automated RoadSafe crash/SOS broadcast received at Emergency Desk.',
    },
    {
      key: 'acknowledged',
      number: '02',
      label: 'Case acknowledged',
      timestamp: currentStage === 'received' ? 'Pending operator' : '12:43 PM',
      description: 'Triage officer reviewed GPS coordinates and driver medical profile.',
    },
    {
      key: 'response_preparing',
      number: '03',
      label: 'Response preparing',
      timestamp:
        currentStage === 'received' || currentStage === 'acknowledged'
          ? 'Pending crew'
          : '12:44 PM',
      description: 'Trauma Unit 14 mobilized with estimated ETA 8 mins to scene.',
    },
    {
      key: 'resolved',
      number: '04',
      label: 'Resolved',
      timestamp: currentStage === 'resolved' ? '1:02 PM' : 'Awaiting completion',
      description: 'First responders secured site and completed field clinical intake.',
    },
  ];

  const getStageIndex = (stage: CaseStage) => {
    switch (stage) {
      case 'received':
        return 0;
      case 'acknowledged':
        return 1;
      case 'response_preparing':
        return 2;
      case 'resolved':
        return 3;
    }
  };

  const currentStageIndex = getStageIndex(currentStage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto py-2 sm:py-4 space-y-6 sm:space-y-8 select-none"
    >
      {/* 1. Case Header */}
      <section className="space-y-3">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate('/hospital')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#585A62] hover:text-[#141517] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Emergency Queue</span>
        </button>

        <div className="relative bg-white/80 backdrop-blur-md border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#C92A2A]/[0.03] pointer-events-none" aria-hidden="true" />

          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#8A8D96]">
                CASE #{baseData.id}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg uppercase ${
                  currentStage === 'resolved'
                    ? 'bg-[#F2F9F3] text-[#236E33] border border-[#D2EED7]'
                    : 'bg-[#FDF2F2] text-[#C92A2A] border border-[#F8D7DA]'
                }`}
              >
                {currentStage === 'resolved' ? 'RESOLVED' : 'ACTIVE'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg uppercase bg-[#FAF9F5] text-[#585A62] border border-[#E2E0D8]">
                {baseData.priority}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141517]">
              {baseData.incidentType}
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[#585A62] pt-1 font-mono">
              <span>Received {baseData.receivedTime}</span>
              <span className="text-[#CEC9BD]">·</span>
              <span className="text-[#141517] font-sans font-semibold">
                {currentStage === 'received' && 'Awaiting operator review'}
                {currentStage === 'acknowledged' && 'Case acknowledged'}
                {currentStage === 'response_preparing' && 'Response preparing'}
                {currentStage === 'resolved' && 'Case resolved'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8A8D96] relative z-10">
            <div className="w-8 h-8 rounded-xl bg-[#FAF9F5] border border-[#EDECE7] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#141517]" />
            </div>
            <span>Apollo Emergency Centre</span>
          </div>
        </div>
      </section>

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Location, Information, Emergency Contact (7 cols) */}
        <div className="md:col-span-7 space-y-5">
          {/* 2. Location Section */}
          <section className="relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#D97706]/[0.03] pointer-events-none" aria-hidden="true" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FDF2F2] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#C92A2A]" />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8A8D96]">
                  Incident location
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMapExpanded(!mapExpanded)}
                className="inline-flex items-center gap-1 text-xs text-[#585A62] hover:text-[#141517] font-medium cursor-pointer px-2 py-1 rounded-lg hover:bg-[#FAF9F5] transition-colors"
              >
                {mapExpanded ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Standard view</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View location</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-base sm:text-lg font-bold text-[#141517]">
                {baseData.location}
              </p>
              <p className="text-xs text-[#236E33] font-mono font-medium">
                GPS accuracy {baseData.accuracy} (17.3850° N, 78.4867° E)
              </p>
            </div>

            {/* Static Visual Mock Map Preview */}
            <div
              className={`relative w-full bg-gradient-to-br from-[#FAF9F5] to-[#EDECE7]/50 border border-[#E2E0D8]/70 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between p-3.5 ${
                mapExpanded ? 'h-64' : 'h-36'
              }`}
            >
              {/* Vector Roadways */}
              <svg
                className="absolute inset-0 w-full h-full text-[#E2E0D8]/70 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="0" y1="40" x2="100%" y2="40" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="90" x2="100%" y2="90" stroke="currentColor" strokeWidth="4" />
                <line x1="25%" y1="0" x2="25%" y2="100%" stroke="currentColor" strokeWidth="2" />
                <line x1="70%" y1="0" x2="70%" y2="100%" stroke="currentColor" strokeWidth="2" />
                <circle cx="50%" cy="50%" r="28" fill="none" stroke="#C92A2A" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              </svg>

              {/* Pin Callout */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-[#E2E0D8] shadow-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C92A2A] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C92A2A]" />
                </span>
                <span className="text-xs font-bold text-[#141517]">
                  Incident Coordinates Locked
                </span>
              </div>

              <div className="z-10 flex justify-between text-[10px] font-mono text-[#8A8D96]">
                <span>RoadSafe Vector Node</span>
                <span>±8m GIS verified</span>
              </div>
              <div className="z-10 flex justify-between text-[11px] text-[#585A62]">
                <span>Roadway corridor: Road No. 36</span>
                <span className="font-mono text-[#141517] font-semibold">2.4 km from Apollo</span>
              </div>
            </div>
          </section>

          {/* 3. Emergency Information */}
          <section className="bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
              Emergency information
            </h2>

            <div className="divide-y divide-[#EDECE7]/80 text-xs sm:text-sm">
              <div className="py-3 flex justify-between">
                <span className="text-[#8A8D96]">Incident</span>
                <span className="font-semibold text-[#141517]">{baseData.incidentType}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-[#8A8D96]">Reported by</span>
                <span className="font-medium text-[#141517]">{baseData.reportedBy}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-[#8A8D96]">Received</span>
                <span className="font-mono text-[#141517]">{baseData.receivedTime}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-[#8A8D96]">Location</span>
                <span className="font-medium text-[#141517] text-right">{baseData.location}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-[#8A8D96]">Accuracy</span>
                <span className="font-mono text-[#236E33] font-semibold">{baseData.accuracy}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-[#8A8D96]">Emergency contact</span>
                <span className="font-medium text-[#236E33]">Primary contact notified</span>
              </div>
            </div>
          </section>

          {/* 6. Emergency Contact Information */}
          <section className="relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 overflow-hidden">
            <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-[#364FC7]/[0.03] pointer-events-none" aria-hidden="true" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EDF2FF] flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#364FC7]" />
                </div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
                  Emergency contact
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#236E33] bg-[#F2F9F3] border border-[#D2EED7] px-2.5 py-0.5 rounded-full font-semibold uppercase">
                Notified
              </span>
            </div>

            <div className="p-4 bg-[#FAF9F5]/80 border border-[#EDECE7]/70 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#EDECE7] flex items-center justify-center text-sm font-bold text-[#585A62]">
                  {baseData.contactName.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-[#141517]">
                    {baseData.contactName}
                  </h3>
                  <p className="text-xs text-[#585A62]">
                    {baseData.contactRelation} · <span className="font-mono tabular-nums text-[#141517]">{baseData.contactPhone}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#236E33] font-medium shrink-0">
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Delivered</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Response Timeline & Controls (5 cols) */}
        <div className="md:col-span-5 space-y-5">
          {/* 4. Response Timeline */}
          <section className="relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5 overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-[#2B8A3E]/[0.04] pointer-events-none" aria-hidden="true" />

            <div className="flex items-center justify-between border-b border-[#EDECE7]/80 pb-3 relative z-10">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
                Response timeline
              </h2>
              <span className="text-xs font-mono text-[#141517] font-semibold bg-[#FAF9F5] px-2 py-0.5 rounded-lg">
                Step {currentStageIndex + 1} of 4
              </span>
            </div>

            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EDECE7]">
              {timelineStages.map((stageItem, idx) => {
                const isPast = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isFuture = idx > currentStageIndex;

                return (
                  <div key={stageItem.key} className="relative flex items-start gap-4">
                    {/* Step indicator node */}
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                        isCurrent
                          ? currentStage === 'resolved'
                            ? 'bg-[#2B8A3E] text-white ring-4 ring-[#D2EED7]'
                            : 'bg-[#141517] text-white ring-4 ring-[#EDECE7]'
                          : isPast
                          ? 'bg-[#2B8A3E] text-white'
                          : 'bg-white border-2 border-[#CEC9BD] text-[#8A8D96]'
                      }`}
                    >
                      {isPast || (isCurrent && currentStage === 'resolved') ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        stageItem.number
                      )}
                    </div>

                    <div className="space-y-0.5 pt-0.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`text-xs sm:text-sm font-semibold transition-colors ${
                            isCurrent
                              ? 'text-[#141517]'
                              : isPast
                              ? 'text-[#141517]'
                              : 'text-[#8A8D96]'
                          }`}
                        >
                          {stageItem.label}
                        </h3>
                        <span className="text-[11px] font-mono text-[#8A8D96] shrink-0">
                          {stageItem.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#585A62] leading-relaxed">
                        {stageItem.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Response Controls & 7. Case Resolution */}
          <section className="relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-[#C92A2A]/[0.03] pointer-events-none" aria-hidden="true" />

            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96] relative z-10">
              Operational controls
            </h2>

            {currentStage === 'received' && (
              <div className="space-y-3">
                <p className="text-xs text-[#585A62]">
                  Verify initial location data and notify the on-call trauma coordinator.
                </p>
                <button
                  type="button"
                  onClick={handleAcknowledge}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#141517] to-[#2A2B2F] hover:from-[#2A2B2F] hover:to-[#3A3B3F] text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Acknowledge case</span>
                </button>
              </div>
            )}

            {currentStage === 'acknowledged' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#FAF9F5]/80 border border-[#EDECE7]/70 rounded-2xl text-xs text-[#141517] flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2B8A3E]" />
                  <span>Case acknowledged by ER reception desk.</span>
                </div>
                <button
                  type="button"
                  onClick={handlePrepareResponse}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#141517] to-[#2A2B2F] hover:from-[#2A2B2F] hover:to-[#3A3B3F] text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                >
                  <Ambulance className="w-4 h-4" />
                  <span>Prepare response</span>
                </button>
              </div>
            )}

            {currentStage === 'response_preparing' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#FAF9F5]/80 border border-[#EDECE7]/70 rounded-2xl text-xs text-[#141517] space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <Ambulance className="w-4 h-4 text-[#364FC7]" />
                    <span>Response team notified</span>
                  </div>
                  <p className="text-[11px] text-[#585A62]">
                    Medic crew dispatched. Trauma bay #02 reserved for incoming patient.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResolve}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#2B8A3E] to-[#236E33] hover:from-[#236E33] hover:to-[#1A5C29] text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(43,138,62,0.2)]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark resolved</span>
                </button>
              </div>
            )}

            {currentStage === 'resolved' && (
              <div className="space-y-4">
                <div className="p-4 bg-[#F2F9F3] border border-[#D2EED7] rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#236E33]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Case resolved</span>
                  </div>
                  <p className="text-xs text-[#585A62] leading-relaxed">
                    The emergency response workflow has been completed. Incident telemetry and responder logs archived.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/hospital')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#141517] to-[#2A2B2F] hover:from-[#2A2B2F] hover:to-[#3A3B3F] text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Emergency Queue</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
};

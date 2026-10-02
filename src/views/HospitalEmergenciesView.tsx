import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useProductState } from '../context/ProductStateContext';
import { useToast } from '../context/ToastContext';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SearchInput } from '../components/ui/SearchInput';
import {
  Activity,
  Ambulance,
  Heart,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Gauge,
} from 'lucide-react';
import { HospitalEmergencyCase } from '../types';

export const HospitalEmergenciesView: React.FC = () => {
  const { hospitalCases, updateHospitalCaseStatus } = useProductState();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredCases = hospitalCases.filter(c => {
    const matchesSearch =
      c.patientName.toLowerCase().includes(search.toLowerCase()) ||
      c.incidentType.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchesSev =
      filterSeverity === 'all' || c.severity === filterSeverity;
    return matchesSearch && matchesSev;
  });

  const handleAdvanceStatus = (caseItem: HospitalEmergencyCase) => {
    const nextStatusMap: Record<HospitalEmergencyCase['status'], HospitalEmergencyCase['status']> = {
      en_route: 'triage_ready',
      triage_ready: 'admitted',
      arrived: 'admitted',
      admitted: 'admitted',
    };

    const next = nextStatusMap[caseItem.status];
    updateHospitalCaseStatus(caseItem.id, next);

    showToast({
      type: 'success',
      title: 'Triage Status Updated',
      message: `${caseItem.patientName} progressed to: ${next.replace('_', ' ').toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        kicker="Emergency Department Inflow Console"
        title="Live Trauma & Crash Triage Feed"
        description="Real-time intake stream of crash victims, vehicle telemetry, pre-hospital vitals, and ambulance arrival ETAs."
        action={
          <div className="flex items-center gap-2">
            <StatusBadge
              variant="emergency"
              label={`${hospitalCases.filter(c => c.status === 'en_route').length} In Transit`}
            />
          </div>
        }
      />

      {/* Filter and Search Bar — rounded, organic */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-white/80 backdrop-blur-sm border border-[#E2E0D8]/70 rounded-2xl">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            placeholder="Search patients, injuries, units..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF9F5]/60 rounded-xl p-1">
          {['all', 'critical', 'severe', 'moderate'].map(sev => (
            <button
              key={sev}
              type="button"
              onClick={() => setFilterSeverity(sev)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all capitalize cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-[#141517] text-white shadow-md'
                  : 'text-[#585A62] hover:text-[#141517] hover:bg-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Queue — organic cards */}
      <div className="space-y-4">
        {filteredCases.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.25 }}
            whileHover={{ y: -2 }}
            className="relative p-5 sm:p-6 bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow overflow-hidden"
          >
            {/* Decorative accent based on severity */}
            <div
              className={`absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none ${
                item.severity === 'critical'
                  ? 'bg-[#C92A2A]/[0.04]'
                  : item.severity === 'severe'
                  ? 'bg-[#D97706]/[0.04]'
                  : 'bg-[#364FC7]/[0.03]'
              }`}
              aria-hidden="true"
            />

            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EDECE7]/80 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF9F5] border border-[#EDECE7] flex items-center justify-center font-bold text-xs text-[#141517]">
                  {item.id.replace('case_', '#')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#141517]">
                      {item.patientName}
                    </h3>
                    <span className="text-xs text-[#8A8D96]">
                      {item.age}y · {item.gender} · Blood: <strong className="text-[#141517]">{item.bloodGroup}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-[#585A62] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8A8D96]" />
                    {item.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <StatusBadge
                  variant={
                    item.severity === 'critical'
                      ? 'emergency'
                      : item.severity === 'severe'
                      ? 'warning'
                      : 'info'
                  }
                  label={`Triage: ${item.severity.toUpperCase()}`}
                  size="sm"
                />
                <StatusBadge
                  variant={item.status === 'admitted' ? 'success' : 'neutral'}
                  label={item.status.replace('_', ' ')}
                  size="sm"
                />
              </div>
            </div>

            {/* Vitals & Incident details — organic rounded cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-[#FAF9F5]/80 border border-[#EDECE7]/70 rounded-2xl">
                <span className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider block">
                  Incident Mechanism
                </span>
                <span className="text-xs font-medium text-[#141517] block pt-1">
                  {item.incidentType}
                </span>
              </div>

              <div className="p-3.5 bg-[#FAF9F5]/80 border border-[#EDECE7]/70 rounded-2xl">
                <div className="flex items-center gap-1.5">
                  <HeartPulse className="w-3 h-3 text-[#C92A2A]" />
                  <span className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider">
                    Heart Rate
                  </span>
                </div>
                <span className="text-sm font-bold font-mono text-[#141517] tabular-nums block pt-1">
                  {item.vitals.heartRateBpm} BPM
                </span>
              </div>

              <div className="p-3.5 bg-[#FAF9F5]/80 border border-[#EDECE7]/70 rounded-2xl">
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3 h-3 text-[#364FC7]" />
                  <span className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider">
                    BP & SpO2
                  </span>
                </div>
                <span className="text-sm font-bold font-mono text-[#141517] tabular-nums block pt-1">
                  {item.vitals.bloodPressure} · {item.vitals.oxygenPercent}%
                </span>
              </div>

              <div className="p-3.5 bg-[#FAF9F5]/80 border border-[#EDECE7]/70 rounded-2xl">
                <div className="flex items-center gap-1.5">
                  <Ambulance className="w-3 h-3 text-[#D97706]" />
                  <span className="text-[11px] font-semibold text-[#8A8D96] uppercase tracking-wider">
                    Unit & ETA
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#141517] block pt-1 truncate">
                  {item.ambulanceUnit}
                </span>
                <span className="text-xs font-mono text-[#C92A2A] font-bold tabular-nums">
                  ETA {item.etaMinutes} mins
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#8A8D96]">
                Reported {item.reportedAt}
              </span>

              {item.status !== 'admitted' ? (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-[#2B8A3E]" />}
                  onClick={() => handleAdvanceStatus(item)}
                >
                  Advance to {item.status === 'en_route' ? 'Triage Ready' : 'Admitted'}
                </Button>
              ) : (
                <span className="text-xs font-semibold text-[#2B8A3E] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Admitted to Trauma Care
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

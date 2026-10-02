import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useProductState } from '../../context/ProductStateContext';
import { LocationStatusIndicator } from '../ui/LocationStatusIndicator';
import {
  ShieldAlert,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { AppRoute } from '../../types';

const ROUTE_TITLES: Record<AppRoute, { category: string; title: string }> = {
  '/login': { category: 'Authentication', title: 'Sign In' },
  '/home': { category: 'Console', title: 'Road Safety Overview' },
  '/emergency': { category: 'Safety Network', title: 'Emergency Dispatch' },
  '/emergency/sent': { category: 'Safety Network', title: 'Alert Dispatched' },
  '/safety': { category: 'Education & Protocols', title: 'Safety Protocols' },
  '/contacts': { category: 'Network', title: 'Emergency Contacts' },
  '/profile': { category: 'Account', title: 'Medical Profile & Vehicle' },
  '/hospital': { category: 'Institutional', title: 'Hospital Notification System' },
  '/hospital/emergencies': { category: 'Hospital ER', title: 'Triage Inflow Queue' },
};

export const AppHeader: React.FC = () => {
  const { currentRoute, navigate } = useRouter();
  const {
    currentUser,
    locationTelemetry,
    batteryTelemetry,
    emergencyStatus,
    toggleGpsQuality,
    toggleBatteryStatus,
  } = useProductState();

  const getRouteMeta = () => {
    if (currentRoute.startsWith('/safety/') && currentRoute !== '/safety') {
      const slug = currentRoute.replace('/safety/', '');
      const formatted = slug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return { category: 'Education & Protocols', title: formatted || 'Safety Directive' };
    }
    if (currentRoute.startsWith('/hospital/emergencies/') && currentRoute !== '/hospital/emergencies') {
      const caseId = currentRoute.replace('/hospital/emergencies/', '');
      return { category: 'Hospital ER', title: `Case #${caseId}` };
    }
    return ROUTE_TITLES[currentRoute] || { category: 'System', title: 'RoadSafe' };
  };

  const routeMeta = getRouteMeta();
  const isEmergency = emergencyStatus.stage !== 'idle';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-[#FAF9F5]/90 backdrop-blur-sm border-b border-[#E2E0D8]">
      {/* Left: Mobile Brand & Desktop Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 truncate">
        {/* Mobile brand icon */}
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="md:hidden flex items-center gap-2 text-left cursor-pointer"
        >
          <div className="w-7 h-7 rounded-md bg-[#141517] text-white flex items-center justify-center font-bold text-xs tracking-tighter shrink-0">
            RS
          </div>
        </button>

        {/* Desktop Breadcrumb trail */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8A8D96] truncate">
          <span className="hover:text-[#141517] cursor-pointer" onClick={() => navigate('/home')}>
            RoadSafe
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#CEC9BD]" />
          <span className="text-[#585A62] font-medium">{routeMeta.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#CEC9BD]" />
          <span className="text-[#141517] font-semibold truncate">{routeMeta.title}</span>
        </div>

        {/* Mobile current title */}
        <div className="sm:hidden">
          <h1 className="text-sm font-semibold text-[#141517] truncate tracking-tight">
            {routeMeta.title}
          </h1>
        </div>
      </div>

      {/* Right: GPS & Battery indicator, Emergency pill & Profile trigger */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Instant Rapid SOS Trigger (Visible on all non-emergency pages) */}
        {currentRoute !== '/emergency' && currentRoute !== '/emergency/sent' && (
          <button
            type="button"
            onClick={() => navigate('/emergency')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C92A2A] hover:bg-[#B52525] text-white rounded-xl text-xs font-bold transition-all shadow-[0_2px_8px_rgba(201,42,42,0.3)] active:scale-95 cursor-pointer"
            title="Instant Emergency SOS"
          >
            <ShieldAlert className="w-3.5 h-3.5 fill-current text-white" />
            <span className="font-extrabold tracking-wide">SOS</span>
          </button>
        )}

        {/* Emergency Alert indicator if active */}
        {isEmergency && currentRoute !== '/emergency' && currentRoute !== '/emergency/sent' && (
          <button
            type="button"
            onClick={() => navigate('/emergency/sent')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FDF2F2] border border-[#F8D7DA] text-[#C92A2A] rounded-lg text-xs font-semibold animate-pulse cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#C92A2A]" />
            <span className="hidden sm:inline">VIEW ALERT</span>
          </button>
        )}

        {/* Compact Location & Battery Status Indicator */}
        <div className="hidden sm:block">
          <LocationStatusIndicator
            location={locationTelemetry}
            battery={batteryTelemetry}
            onToggleGps={toggleGpsQuality}
            onToggleBattery={toggleBatteryStatus}
            variant="compact"
          />
        </div>

        {/* Mobile GPS quick tap indicator */}
        <button
          type="button"
          onClick={toggleGpsQuality}
          className="sm:hidden p-1.5 rounded-lg border border-[#E2E0D8] bg-white text-[#141517] text-xs flex items-center gap-1"
          title={`GPS: ${locationTelemetry.signalQuality}`}
        >
          <Radio className="w-3.5 h-3.5 text-[#2B8A3E]" />
        </button>

        {/* Quick Profile button */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full bg-white border border-[#E2E0D8] hover:border-[#CEC9BD] text-xs font-bold text-[#141517] flex items-center justify-center transition-colors cursor-pointer"
          title="Open Profile"
        >
          {currentUser.name
            .split(' ')
            .filter(Boolean)
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'PP'}
        </button>
      </div>
    </header>
  );
};

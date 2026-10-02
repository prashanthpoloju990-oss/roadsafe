import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useProductState } from '../../context/ProductStateContext';
import { NavItem } from '../ui/NavItem';
import { Divider } from '../ui/Divider';
import {
  Home,
  AlertOctagon,
  Shield,
  Users,
  User,
  Building2,
  LogOut,
  Activity,
} from 'lucide-react';
import { AppRoute } from '../../types';

interface AppSidebarProps {
  compact?: boolean;
  onToggleCompact?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  compact = false,
  onToggleCompact,
}) => {
  const { currentRoute, navigate, logout } = useRouter();
  const { currentUser, emergencyStatus, hospitalCases } = useProductState();

  const isEmergencyActive = emergencyStatus.stage !== 'idle';
  const enRouteCasesCount = hospitalCases.filter(c => c.status === 'en_route').length;

  const mainNavItems = [
    {
      route: '/home' as AppRoute,
      label: 'Home',
      icon: <Home className="w-4 h-4" />,
    },
    {
      route: '/emergency' as AppRoute,
      label: 'Emergency',
      icon: <AlertOctagon className="w-4 h-4" />,
      isEmergencyAlert: isEmergencyActive,
      badge: isEmergencyActive ? (
        <span className="w-2 h-2 rounded-full bg-[#C92A2A] animate-pulse" />
      ) : undefined,
    },
    {
      route: '/safety' as AppRoute,
      label: 'Safety',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      route: '/contacts' as AppRoute,
      label: 'Contacts',
      icon: <Users className="w-4 h-4" />,
    },
    {
      route: '/profile' as AppRoute,
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  const secondaryNavItems = [
    {
      route: '/hospital' as AppRoute,
      label: 'Hospital Portal',
      icon: <Building2 className="w-4 h-4" />,
      badge: enRouteCasesCount > 0 ? (
        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#EDF2FF] text-[#364FC7] font-semibold tabular-nums">
          {enRouteCasesCount}
        </span>
      ) : undefined,
    },
    {
      route: '/hospital/emergencies' as AppRoute,
      label: 'ER Triage Feed',
      icon: <Activity className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between h-screen bg-[#FAF9F5] border-r border-[#E2E0D8] transition-all duration-200 select-none shrink-0 ${
        compact ? 'w-18 px-2 py-4' : 'w-64 px-4 py-5'
      }`}
    >
      {/* Top Brand Lockup */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141517] text-white flex items-center justify-center font-bold text-sm tracking-tighter">
              RS
            </div>
            {!compact && (
              <div>
                <span className="font-bold text-sm tracking-tight text-[#141517]">
                  ROADSAFE
                </span>
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-[#8A8D96]">
                  Safety & Triage
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-1">
          {!compact && (
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#8A8D96]">
              Navigation
            </p>
          )}
          {mainNavItems.map(item => (
            <NavItem
              key={item.route}
              label={item.label}
              icon={item.icon}
              isActive={currentRoute === item.route}
              onClick={() => navigate(item.route)}
              compact={compact}
              isEmergencyAlert={item.isEmergencyAlert}
              badge={item.badge}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="px-2">
          <Divider />
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {!compact && (
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#8A8D96]">
              Systems & User
            </p>
          )}
          {secondaryNavItems.map(item => (
            <NavItem
              key={item.route}
              label={item.label}
              icon={item.icon}
              isActive={currentRoute === item.route}
              onClick={() => navigate(item.route)}
              compact={compact}
              badge={item.badge}
            />
          ))}
        </div>
      </div>

      {/* Bottom Area: User info & Sign out */}
      <div className="pt-4 border-t border-[#E2E0D8]">
        <div className={`flex items-center ${compact ? 'justify-center' : 'justify-between px-2'}`}>
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-7 h-7 rounded-full bg-[#E2E0D8] text-[#141517] font-semibold text-xs flex items-center justify-center shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            {!compact && (
              <div className="truncate">
                <p className="text-xs font-semibold text-[#141517] truncate leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-[#8A8D96] truncate">
                  {currentUser.bloodGroup} · Driver
                </p>
              </div>
            )}
          </div>

          {!compact && (
            <button
              type="button"
              onClick={logout}
              className="p-1.5 text-[#8A8D96] hover:text-[#C92A2A] hover:bg-[#FDF2F2] rounded-md transition-colors cursor-pointer"
              title="Sign out / Return to Login"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

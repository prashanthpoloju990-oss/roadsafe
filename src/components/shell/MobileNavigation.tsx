import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useProductState } from '../../context/ProductStateContext';
import { Home, AlertOctagon, Shield, Users, User } from 'lucide-react';
import { AppRoute } from '../../types';

export const MobileNavigation: React.FC = () => {
  const { currentRoute, navigate } = useRouter();
  const { emergencyStatus } = useProductState();

  const isEmergencyActive = emergencyStatus.stage !== 'idle';

  const navItems = [
    {
      route: '/home' as AppRoute,
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      route: '/emergency' as AppRoute,
      label: 'Emergency',
      icon: <AlertOctagon className="w-5 h-5" />,
      isEmergency: true,
    },
    {
      route: '/safety' as AppRoute,
      label: 'Safety',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      route: '/contacts' as AppRoute,
      label: 'Contacts',
      icon: <Users className="w-5 h-5" />,
    },
    {
      route: '/profile' as AppRoute,
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-sm border-t border-[#E2E0D8] px-2 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] select-none"
    >
      <div className="grid grid-cols-5 items-center max-w-lg mx-auto h-14">
        {navItems.map(item => {
          const isActive = currentRoute === item.route;
          const isEmergencyButton = item.isEmergency;

          return (
            <button
              key={item.route}
              type="button"
              aria-label={item.label}
              onClick={() => navigate(item.route)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative py-1 rounded-lg transition-transform active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-[#141517]'
                  : isEmergencyButton && isEmergencyActive
                  ? 'text-[#C92A2A]'
                  : 'text-[#8A8D96]'
              }`}
            >
              {/* Emergency pulse highlight */}
              {isEmergencyButton && isEmergencyActive && (
                <span className="absolute top-1.5 right-4 w-2 h-2 rounded-full bg-[#C92A2A] animate-ping" />
              )}

              <span
                className={`transition-colors ${
                  isActive
                    ? 'text-[#141517]'
                    : isEmergencyButton && isEmergencyActive
                    ? 'text-[#C92A2A]'
                    : 'text-[#6F727B]'
                }`}
              >
                {item.icon}
              </span>

              <span
                className={`text-[10px] tracking-tight mt-0.5 font-medium leading-none ${
                  isActive ? 'font-semibold text-[#141517]' : 'text-[#8A8D96]'
                }`}
              >
                {item.label}
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#141517] mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

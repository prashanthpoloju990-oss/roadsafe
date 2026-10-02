import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { MobileNavigation } from './MobileNavigation';
import { ToastContainer } from '../ui/ToastContainer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentRoute } = useRouter();
  const [compactSidebar, setCompactSidebar] = useState(false);

  // If on login route, render standalone login view directly without sidebar
  if (currentRoute === '/login') {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-[#141517]">
        {children}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF9F5] text-[#141517]">
      {/* Desktop & Tablet Sidebar */}
      <AppSidebar
        compact={compactSidebar}
        onToggleCompact={() => setCompactSidebar(prev => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* Minimal Top Header */}
        <AppHeader />

        {/* Scrollable Viewport with Max Readable Width */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 pb-28 md:pb-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Mobile Fixed Bottom Navigation */}
        <MobileNavigation />
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ProductStateProvider } from './context/ProductStateContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/shell/AppLayout';
import { LoginView } from './views/LoginView';
import { HomeView } from './views/HomeView';
import { EmergencyView } from './views/EmergencyView';
import { EmergencySentView } from './views/EmergencySentView';
import { SafetyView } from './views/SafetyView';
import { SafetyTopicDetailView } from './views/SafetyTopicDetailView';
import { ContactsView } from './views/ContactsView';
import { ProfileView } from './views/ProfileView';
import { HospitalView } from './views/HospitalView';
import { HospitalEmergenciesView } from './views/HospitalEmergenciesView';
import { HospitalCaseDetailView } from './views/HospitalCaseDetailView';

const RouteDispatcher: React.FC = () => {
  const { currentRoute } = useRouter();

  if (currentRoute.startsWith('/safety/') && currentRoute !== '/safety') {
    const topicSlug = currentRoute.replace('/safety/', '');
    return <SafetyTopicDetailView topicSlug={topicSlug} />;
  }

  if (currentRoute.startsWith('/hospital/emergencies/') && currentRoute !== '/hospital/emergencies') {
    const caseId = currentRoute.replace('/hospital/emergencies/', '');
    return <HospitalCaseDetailView caseId={caseId} />;
  }

  switch (currentRoute) {
    case '/login':
      return <LoginView />;
    case '/home':
      return <HomeView />;
    case '/emergency':
      return <EmergencyView />;
    case '/emergency/sent':
      return <EmergencySentView />;
    case '/safety':
      return <SafetyView />;
    case '/contacts':
      return <ContactsView />;
    case '/profile':
      return <ProfileView />;
    case '/hospital':
      return <HospitalView />;
    case '/hospital/emergencies':
      return <HospitalEmergenciesView />;
    default:
      return <HomeView />;
  }
};

export default function App() {
  return (
    <RouterProvider>
      <ProductStateProvider>
        <ToastProvider>
          <AppLayout>
            <RouteDispatcher />
          </AppLayout>
        </ToastProvider>
      </ProductStateProvider>
    </RouterProvider>
  );
}

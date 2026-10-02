import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserProfile,
  EmergencyContact,
  LocationTelemetry,
  BatteryTelemetry,
  EmergencyStatus,
  HospitalEmergencyCase,
  SafetyTip,
  IncidentCase,
  IncidentCaseStage,
  EmergencyRecord,
  EmergencyCase,
  EmergencyFlowStage,
  ContactNotificationStatus,
  RoadSafePersistentState,
  RoadSafePreferences,
} from '../types';
import { emergencyApi } from '../services/emergencyApi';
import {
  DEMO_USER,
  DEMO_CONTACTS,
  DEMO_LOCATION,
  DEMO_BATTERY,
  DEMO_EMERGENCY_STATUS,
  DEMO_INCIDENT_CASES,
  DEMO_HOSPITAL_CASES,
  DEMO_SAFETY_TIPS,
  createDefaultState,
} from '../data/mockData';

export const ROOT_STORAGE_KEY = 'roadsafe_state';

interface ProductStateContextType {
  // Domain Entities
  currentUser: UserProfile;
  emergencyContacts: EmergencyContact[];
  primaryContact: EmergencyContact | null;
  incidentCases: IncidentCase[];
  activeEmergencyCase: IncidentCase | null;
  activeEmergencyRecord: EmergencyRecord | null;
  emergencyFlowStage: EmergencyFlowStage;
  emergencyStatus: EmergencyStatus;
  locationTelemetry: LocationTelemetry;
  batteryTelemetry: BatteryTelemetry;
  hospitalCases: HospitalEmergencyCase[];
  safetyTips: SafetyTip[];
  preferences: RoadSafePreferences;

  // Core Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  addContact: (
    contact: Omit<EmergencyContact, 'id' | 'notifiedCount' | 'status' | 'notificationStatus'> & {
      isPrimary?: boolean;
      notificationStatus?: ContactNotificationStatus;
    }
  ) => void;
  updateContact: (id: string, updates: Partial<EmergencyContact>) => void;
  deleteContact: (id: string) => void;
  setPrimaryContact: (id: string) => void;

  createEmergency: (data?: Partial<EmergencyCase>) => IncidentCase;
  updateEmergencyStatus: (caseId: string, status: IncidentCaseStage) => void;
  updateEmergencyStage: (stage: EmergencyFlowStage) => void;
  cancelEmergency: () => void;
  resolveEmergency: (caseId?: string) => void;
  resetDemo: () => void;
  updatePreferences: (updates: Partial<RoadSafePreferences>) => void;

  // Telemetry & Utility Mutators
  instantDispatchEmergency: (type?: string) => IncidentCase;
  triggerEmergency: (type?: EmergencyStatus['incidentType']) => void;
  dispatchAmbulance: () => void;
  sendEmergencyAlert: (details?: { location?: string; accuracy?: string }) => void;
  toggleGpsQuality: () => void;
  toggleBatteryStatus: () => void;
  updateLocationAddress: (newAddress: string) => void;
  updateHospitalCaseStatus: (id: string, status: HospitalEmergencyCase['status']) => void;

  // Backward Compatibility Aliases
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  addEmergencyContact: (
    contact: Omit<EmergencyContact, 'id' | 'notifiedCount' | 'status' | 'notificationStatus'> & {
      isPrimary?: boolean;
    }
  ) => void;
  updateEmergencyContact: (id: string, updates: Partial<EmergencyContact>) => void;
  removeEmergencyContact: (id: string) => void;
  setPrimaryEmergencyContact: (id: string) => void;
  updateIncidentCaseStage: (id: string, stage: IncidentCaseStage) => void;
  resetDemoState: () => void;
}

/**
 * Hydrates persistent state from localStorage with safe validation and deterministic fallbacks.
 */
function hydratePersistentState(): RoadSafePersistentState {
  const fallback = createDefaultState();
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = localStorage.getItem(ROOT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<RoadSafePersistentState>;
      if (parsed && typeof parsed === 'object') {
        // 1. Validate User
        const currentUser: UserProfile = {
          ...fallback.currentUser,
          ...(parsed.currentUser || {}),
          id: parsed.currentUser?.id || fallback.currentUser.id,
          name: parsed.currentUser?.name || fallback.currentUser.name,
          email: parsed.currentUser?.email || fallback.currentUser.email,
          phone: parsed.currentUser?.phone || fallback.currentUser.phone,
          city: parsed.currentUser?.city || fallback.currentUser.city,
        };

        // 2. Validate Contacts & Enforce Primary Rule
        let emergencyContacts: EmergencyContact[] = Array.isArray(parsed.emergencyContacts)
          ? parsed.emergencyContacts
          : fallback.emergencyContacts;

        if (emergencyContacts.length > 0) {
          const hasPrimary = emergencyContacts.some(c => c.isPrimary);
          if (!hasPrimary) {
            emergencyContacts = emergencyContacts.map((c, idx) => ({
              ...c,
              isPrimary: idx === 0,
              notificationStatus: c.notificationStatus || 'idle',
            }));
          } else {
            let foundFirstPrimary = false;
            emergencyContacts = emergencyContacts.map(c => {
              if (c.isPrimary && !foundFirstPrimary) {
                foundFirstPrimary = true;
                return { ...c, notificationStatus: c.notificationStatus || 'idle' };
              }
              return { ...c, isPrimary: false, notificationStatus: c.notificationStatus || 'idle' };
            });
          }
        }

        // 3. Validate Incident Cases
        const incidentCases: IncidentCase[] =
          Array.isArray(parsed.incidentCases) && parsed.incidentCases.length > 0
            ? parsed.incidentCases
            : fallback.incidentCases;

        return {
          version: 1,
          currentUser,
          emergencyContacts,
          incidentCases,
          activeEmergencyCaseId: parsed.activeEmergencyCaseId ?? '2041',
          emergencyFlowStage: parsed.emergencyFlowStage || 'idle',
          emergencyStatus: parsed.emergencyStatus || fallback.emergencyStatus,
          locationTelemetry: parsed.locationTelemetry || fallback.locationTelemetry,
          batteryTelemetry: parsed.batteryTelemetry || fallback.batteryTelemetry,
          hospitalCases: Array.isArray(parsed.hospitalCases)
            ? parsed.hospitalCases
            : fallback.hospitalCases,
          preferences: parsed.preferences || fallback.preferences,
        };
      }
    }

    // 4. Migration from legacy scattered keys if roadsafe_state is not yet initialized
    const legacyUser = localStorage.getItem('roadsafe_demo_user');
    const legacyContacts = localStorage.getItem('roadsafe_demo_contacts');
    const legacyCases = localStorage.getItem('roadsafe_demo_cases');
    const legacyEmergency = localStorage.getItem('roadsafe_demo_emergency');

    if (legacyUser || legacyContacts || legacyCases || legacyEmergency) {
      const state: RoadSafePersistentState = {
        ...fallback,
        currentUser: legacyUser ? JSON.parse(legacyUser) : fallback.currentUser,
        emergencyContacts: legacyContacts ? JSON.parse(legacyContacts) : fallback.emergencyContacts,
        incidentCases: legacyCases ? JSON.parse(legacyCases) : fallback.incidentCases,
        emergencyStatus: legacyEmergency ? JSON.parse(legacyEmergency) : fallback.emergencyStatus,
      };

      if (state.emergencyContacts.length > 0 && !state.emergencyContacts.some(c => c.isPrimary)) {
        state.emergencyContacts[0].isPrimary = true;
      }
      return state;
    }
  } catch (err) {
    console.warn('Failed to hydrate RoadSafe state, safely reverting to deterministic defaults.', err);
  }

  return fallback;
}

/**
 * Persists application state to the single roadsafe_state namespace.
 */
function persistState(state: RoadSafePersistentState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ROOT_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Fail silently in restricted sandbox
  }
}

const ProductStateContext = createContext<ProductStateContextType | null>(null);

export const ProductStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from unified persistent storage
  const [persisted, setPersisted] = useState<RoadSafePersistentState>(hydratePersistentState);

  // Active Emergency Record for API sync
  const [activeEmergencyRecord, setActiveEmergencyRecord] = useState<EmergencyRecord | null>(null);

  // Safety Tips (Static Knowledge Base)
  const [safetyTips] = useState<SafetyTip[]>(DEMO_SAFETY_TIPS);

  // Save to localStorage whenever persisted state mutates
  useEffect(() => {
    persistState(persisted);
  }, [persisted]);

  // Initial synchronization with API
  useEffect(() => {
    const caseId = persisted.activeEmergencyCaseId || '2041';
    emergencyApi.getById(caseId).then(rec => {
      if (rec) setActiveEmergencyRecord(rec);
    }).catch(() => {});
  }, [persisted.activeEmergencyCaseId]);

  // Derived primary contact
  const primaryContact = useMemo(() => {
    return persisted.emergencyContacts.find(c => c.isPrimary) || null;
  }, [persisted.emergencyContacts]);

  // Derived active emergency case
  const activeEmergencyCase = useMemo(() => {
    if (persisted.activeEmergencyCaseId) {
      const match = persisted.incidentCases.find(c => c.id === persisted.activeEmergencyCaseId);
      if (match) return match;
    }
    return (
      persisted.incidentCases.find(c => c.id === '2041') ||
      persisted.incidentCases[0] ||
      null
    );
  }, [persisted.activeEmergencyCaseId, persisted.incidentCases]);

  // --- ACTIONS ---

  /**
   * 1. updateProfile: Updates user data safely and keeps state in sync.
   */
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setPersisted(prev => ({
      ...prev,
      currentUser: {
        ...prev.currentUser,
        ...updates,
      },
    }));
  }, []);

  /**
   * 2. addContact: Enforces primary contact rules upon addition.
   */
  const addContact = useCallback(
    (
      contact: Omit<EmergencyContact, 'id' | 'notifiedCount' | 'status' | 'notificationStatus'> & {
        isPrimary?: boolean;
        notificationStatus?: ContactNotificationStatus;
      }
    ) => {
      const newId = `ct_${Date.now()}`;
      setPersisted(prev => {
        const isFirst = prev.emergencyContacts.length === 0;
        const makePrimary = Boolean(contact.isPrimary || isFirst);

        const updatedContacts = prev.emergencyContacts.map(c =>
          makePrimary ? { ...c, isPrimary: false } : c
        );

        const newContact: EmergencyContact = {
          id: newId,
          name: contact.name,
          relationship: contact.relationship,
          phone: contact.phone,
          isPrimary: makePrimary,
          notifiedCount: 0,
          status: 'verified',
          notificationStatus: contact.notificationStatus || 'idle',
        };

        return {
          ...prev,
          emergencyContacts: [...updatedContacts, newContact],
        };
      });
    },
    []
  );

  /**
   * 3. updateContact: Updates an existing contact while maintaining primary contact integrity.
   */
  const updateContact = useCallback((id: string, updates: Partial<EmergencyContact>) => {
    setPersisted(prev => {
      let updated = prev.emergencyContacts.map(c => {
        if (c.id === id) {
          return { ...c, ...updates };
        }
        if (updates.isPrimary) {
          return { ...c, isPrimary: false };
        }
        return c;
      });

      // If contact was demoted from primary, ensure another contact becomes primary
      if (updates.isPrimary === false) {
        const hasPrimary = updated.some(c => c.isPrimary);
        if (!hasPrimary && updated.length > 0) {
          updated = updated.map((c, idx) => ({ ...c, isPrimary: idx === 0 }));
        }
      }

      return {
        ...prev,
        emergencyContacts: updated,
      };
    });
  }, []);

  /**
   * 4. deleteContact: Removes contact and promotes the next available contact to primary if needed.
   */
  const deleteContact = useCallback((id: string) => {
    setPersisted(prev => {
      const remaining = prev.emergencyContacts.filter(c => c.id !== id);
      const hadPrimary = remaining.some(c => c.isPrimary);

      if (!hadPrimary && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isPrimary: true };
      }

      return {
        ...prev,
        emergencyContacts: remaining,
      };
    });
  }, []);

  /**
   * 5. setPrimaryContact: Sets a single designated primary contact.
   */
  const setPrimaryContact = useCallback((id: string) => {
    setPersisted(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map(c => ({
        ...c,
        isPrimary: c.id === id,
      })),
    }));
  }, []);

  /**
   * 6. createEmergency: Creates or reactivates an emergency case deterministically.
   * Defaults to Case #2041 or generates predictable next sequence (#2042).
   */
  const createEmergency = useCallback(
    (data?: Partial<EmergencyCase>): IncidentCase => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const primary = primaryContact || persisted.emergencyContacts[0];

      // Determine deterministic case ID: always Case #2041 for the primary demo flow
      const targetId = '2041';
      const caseNumber = `#${targetId}`;
      const location = data?.location || persisted.locationTelemetry.address || 'Jubilee Hills, Hyderabad';
      const accuracy = data?.accuracy || `±${persisted.locationTelemetry.accuracyMeters} m` || '±8 m';

      const emergencyCase: IncidentCase = {
        id: targetId,
        caseNumber,
        type: data?.type || 'Road accident',
        incidentType: data?.type || 'Road accident',
        location,
        latitude: data?.latitude || persisted.locationTelemetry.latitude || 17.4325,
        longitude: data?.longitude || persisted.locationTelemetry.longitude || 78.4071,
        accuracy,
        distance: '2.4 km',
        receivedTime: timeStr,
        createdAt: timeStr,
        contactStatus: primary ? `${primary.name} notified` : 'Primary contact notified',
        contactNotificationStatus: 'sent',
        hospitalNotificationStatus: 'received',
        priority: 'HIGH',
        stage: 'received',
        status: 'received',
        responseStage: 'received',
        patientName: persisted.currentUser.name,
        bloodGroup: persisted.currentUser.bloodGroup,
        vehicle: `${persisted.currentUser.vehicle.make} ${persisted.currentUser.vehicle.model} (${persisted.currentUser.vehicle.licensePlate})`,
      };

      setPersisted(prev => {
        const filtered = prev.incidentCases.filter(c => c.id !== targetId);
        return {
          ...prev,
          incidentCases: [emergencyCase, ...filtered],
          activeEmergencyCaseId: targetId,
          emergencyFlowStage: 'alert_sent',
          emergencyStatus: {
            stage: 'triggered',
            countdownSeconds: 0,
            incidentType: 'manual_sos',
            triggeredAt: timeStr,
            assignedHospital: 'Apollo Emergency Centre, Jubilee Hills',
            estimatedAmbulanceEtaMinutes: 8,
            notifiedContactsCount: prev.emergencyContacts.length,
          },
        };
      });

      // Sync with emergency API
      emergencyApi
        .create({
          caseId: targetId,
          userName: persisted.currentUser.name,
          emergencyType: emergencyCase.type,
          location: emergencyCase.location,
          latitude: emergencyCase.latitude,
          longitude: emergencyCase.longitude,
          locationAccuracy: emergencyCase.accuracy,
          primaryContact: {
            name: primary?.name || 'Ananya Rao',
            relationship: primary?.relationship || 'Sister',
            phone: primary?.phone || '+91 98490 12345',
          },
          hospital: {
            name: 'Apollo Emergency Centre, Jubilee Hills',
            etaMinutes: 8,
          },
        })
        .then(rec => {
          if (rec) setActiveEmergencyRecord(rec);
        })
        .catch(() => {});

      return emergencyCase;
    },
    [persisted, primaryContact]
  );

  /**
   * 7. updateEmergencyStatus: Updates case status across shared state & syncs to API.
   * Enforces sequential lifecycle transition guards.
   */
  const updateEmergencyStatus = useCallback((caseId: string, stage: IncidentCaseStage) => {
    setPersisted(prev => {
      const existing = prev.incidentCases.find(c => c.id === caseId);
      if (!existing) {
        return prev;
      }

      // Transition guards: prevent invalid out-of-order transitions
      const currentStage = existing.stage;
      if (stage === currentStage) {
        return prev;
      }
      if (stage === 'acknowledged' && currentStage !== 'received') {
        return prev; // Can only acknowledge awaiting_review ('received') cases
      }
      if (stage === 'response_preparing' && currentStage !== 'acknowledged') {
        return prev; // Can only prepare response after acknowledgement
      }
      if (stage === 'resolved' && currentStage !== 'response_preparing') {
        return prev; // Can only resolve after response preparation
      }

      const updatedCases = prev.incidentCases.map(c => {
        if (c.id === caseId) {
          const contactStatus =
            stage === 'resolved'
              ? 'Case closed'
              : stage === 'acknowledged' || stage === 'response_preparing'
              ? 'Dispatched & verified'
              : c.contactStatus;

          return {
            ...c,
            stage,
            status: stage,
            responseStage: stage,
            contactStatus,
            hospitalNotificationStatus: 'received' as const,
            contactNotificationStatus: (stage === 'resolved' ? 'delivered' : 'sent') as ContactNotificationStatus,
          };
        }
        return c;
      });

      const isCurrentActive = prev.activeEmergencyCaseId === caseId || caseId === '2041';
      let nextEmergencyStatus = prev.emergencyStatus;
      let nextFlowStage = prev.emergencyFlowStage;

      if (isCurrentActive) {
        if (stage === 'resolved') {
          nextEmergencyStatus = { ...prev.emergencyStatus, stage: 'resolved' };
          nextFlowStage = 'resolved';
        } else if (stage === 'acknowledged') {
          nextEmergencyStatus = { ...prev.emergencyStatus, stage: 'triggered' };
          nextFlowStage = 'acknowledged';
        } else if (stage === 'response_preparing') {
          nextEmergencyStatus = { ...prev.emergencyStatus, stage: 'dispatched' };
          nextFlowStage = 'response_preparing';
        }
      }

      return {
        ...prev,
        incidentCases: updatedCases,
        emergencyStatus: nextEmergencyStatus,
        emergencyFlowStage: nextFlowStage,
      };
    });

    emergencyApi.updateStatus(caseId, stage).then(rec => {
      if (rec && rec.caseId === caseId) {
        setActiveEmergencyRecord(rec);
      }
    }).catch(() => {});
  }, []);

  /**
   * 8. updateEmergencyStage: Transitions emergency lifecycle stage safely.
   */
  const updateEmergencyStage = useCallback((stage: EmergencyFlowStage) => {
    setPersisted(prev => {
      let emergencyStatus = prev.emergencyStatus;
      if (stage === 'idle') {
        emergencyStatus = {
          stage: 'idle',
          countdownSeconds: 10,
          notifiedContactsCount: 0,
        };
      } else if (stage === 'alert_sent' || stage === 'hospital_received') {
        emergencyStatus = {
          ...prev.emergencyStatus,
          stage: 'triggered',
          countdownSeconds: 0,
        };
      } else if (stage === 'resolved') {
        emergencyStatus = {
          ...prev.emergencyStatus,
          stage: 'resolved',
        };
      }

      return {
        ...prev,
        emergencyFlowStage: stage,
        emergencyStatus,
      };
    });
  }, []);

  /**
   * 9. cancelEmergency: Gracefully cancels pending emergency without creating records.
   */
  const cancelEmergency = useCallback(() => {
    setPersisted(prev => ({
      ...prev,
      emergencyFlowStage: 'idle',
      emergencyStatus: {
        stage: 'idle',
        countdownSeconds: 10,
        notifiedContactsCount: 0,
      },
    }));
  }, []);

  /**
   * 10. resolveEmergency: Resolves active or target emergency.
   */
  const resolveEmergency = useCallback(
    (caseId?: string) => {
      const targetId = caseId || persisted.activeEmergencyCaseId || '2041';
      updateEmergencyStatus(targetId, 'resolved');
    },
    [persisted.activeEmergencyCaseId, updateEmergencyStatus]
  );

  /**
   * 11. resetDemo: Restores initial deterministic state across local storage & API.
   */
  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(ROOT_STORAGE_KEY);
      localStorage.removeItem('roadsafe_demo_user');
      localStorage.removeItem('roadsafe_demo_contacts');
      localStorage.removeItem('roadsafe_demo_cases');
      localStorage.removeItem('roadsafe_demo_emergency');
    } catch {
      // Safe catch
    }

    const defaultState = createDefaultState();
    setPersisted(defaultState);

    emergencyApi.reset().then(() => {
      emergencyApi.getById('2041').then(rec => {
        if (rec) setActiveEmergencyRecord(rec);
      });
    }).catch(() => {});
  }, []);

  const updatePreferences = useCallback((updates: Partial<RoadSafePreferences>) => {
    setPersisted(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...updates,
      },
    }));
  }, []);

  // --- Utility & Simulator Mutators ---

  const triggerEmergency = useCallback((type: EmergencyStatus['incidentType'] = 'manual_sos') => {
    setPersisted(prev => ({
      ...prev,
      emergencyStatus: {
        stage: 'countdown',
        countdownSeconds: 10,
        incidentType: type,
        triggeredAt: 'Initiated',
        notifiedContactsCount: 0,
      },
      emergencyFlowStage: 'locating',
    }));
  }, []);

  const dispatchAmbulance = useCallback(() => {
    setPersisted(prev => ({
      ...prev,
      emergencyStatus: {
        ...prev.emergencyStatus,
        stage: 'dispatched',
        estimatedAmbulanceEtaMinutes: 6,
        assignedHospital: 'Apollo Emergency Centre',
      },
    }));
  }, []);

  const instantDispatchEmergency = useCallback(
    (incidentType: string = 'Road accident'): IncidentCase => {
      const primary = primaryContact || persisted.emergencyContacts[0];
      const created = createEmergency({
        type: incidentType,
        location: persisted.locationTelemetry.address || 'Jubilee Hills, Hyderabad',
        accuracy: `±${persisted.locationTelemetry.accuracyMeters || 8} m`,
        status: 'alert_sent',
      });
      if (primary) {
        updateContact(primary.id, { notificationStatus: 'delivered' });
      }
      updateEmergencyStatus(created.id, 'received');
      updateEmergencyStage('hospital_received');
      return created;
    },
    [createEmergency, updateContact, updateEmergencyStatus, updateEmergencyStage, primaryContact, persisted]
  );

  const sendEmergencyAlert = useCallback(
    (details?: { location?: string; accuracy?: string }) => {
      createEmergency(details);
    },
    [createEmergency]
  );

  const toggleGpsQuality = useCallback(() => {
    setPersisted(prev => {
      const nextQuality: Record<string, LocationTelemetry['signalQuality']> = {
        locked: 'searching',
        searching: 'degraded',
        degraded: 'locked',
      };
      const signal = nextQuality[prev.locationTelemetry.signalQuality];
      return {
        ...prev,
        locationTelemetry: {
          ...prev.locationTelemetry,
          signalQuality: signal,
          accuracyMeters: signal === 'locked' ? 8.0 : signal === 'searching' ? 24.5 : 82.0,
          lastUpdated: 'Just now',
        },
      };
    });
  }, []);

  const toggleBatteryStatus = useCallback(() => {
    setPersisted(prev => {
      const isCharging = !prev.batteryTelemetry.isCharging;
      return {
        ...prev,
        batteryTelemetry: {
          ...prev.batteryTelemetry,
          isCharging,
          levelPercent: isCharging ? 88 : 54,
          status: isCharging ? 'optimal' : 'moderate',
          estimatedHoursRemaining: isCharging ? 6.2 : 3.8,
        },
      };
    });
  }, []);

  const updateLocationAddress = useCallback((newAddress: string) => {
    setPersisted(prev => ({
      ...prev,
      locationTelemetry: {
        ...prev.locationTelemetry,
        address: newAddress,
        lastUpdated: 'Just now',
      },
    }));
  }, []);

  const updateHospitalCaseStatus = useCallback(
    (id: string, status: HospitalEmergencyCase['status']) => {
      setPersisted(prev => ({
        ...prev,
        hospitalCases: prev.hospitalCases.map(c => (c.id === id ? { ...c, status } : c)),
      }));
    },
    []
  );

  return (
    <ProductStateContext.Provider
      value={{
        // Domain entities
        currentUser: persisted.currentUser,
        emergencyContacts: persisted.emergencyContacts,
        primaryContact,
        incidentCases: persisted.incidentCases,
        activeEmergencyCase,
        activeEmergencyRecord,
        emergencyFlowStage: persisted.emergencyFlowStage,
        emergencyStatus: persisted.emergencyStatus,
        locationTelemetry: persisted.locationTelemetry,
        batteryTelemetry: persisted.batteryTelemetry,
        hospitalCases: persisted.hospitalCases,
        safetyTips,
        preferences: persisted.preferences,

        // Core Actions
        updateProfile,
        addContact,
        updateContact,
        deleteContact,
        setPrimaryContact,
        createEmergency,
        updateEmergencyStatus,
        updateEmergencyStage,
        cancelEmergency,
        resolveEmergency,
        resetDemo,
        updatePreferences,

        // Telemetry & Utility Mutators
        instantDispatchEmergency,
        triggerEmergency,
        dispatchAmbulance,
        sendEmergencyAlert,
        toggleGpsQuality,
        toggleBatteryStatus,
        updateLocationAddress,
        updateHospitalCaseStatus,

        // Backward compatibility aliases
        updateCurrentUser: updateProfile,
        addEmergencyContact: addContact,
        updateEmergencyContact: updateContact,
        removeEmergencyContact: deleteContact,
        setPrimaryEmergencyContact: setPrimaryContact,
        updateIncidentCaseStage: updateEmergencyStatus,
        resetDemoState: resetDemo,
      }}
    >
      {children}
    </ProductStateContext.Provider>
  );
};

export const useProductState = (): ProductStateContextType => {
  const context = useContext(ProductStateContext);
  if (!context) {
    throw new Error('useProductState must be used within a ProductStateProvider');
  }
  return context;
};

export type AppRoute =
  | '/login'
  | '/home'
  | '/emergency'
  | '/emergency/sent'
  | '/safety'
  | `/safety/${string}`
  | '/contacts'
  | '/profile'
  | '/hospital'
  | '/hospital/emergencies'
  | `/hospital/emergencies/${string}`;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: 'driver' | 'paramedic' | 'hospital_staff';
  bloodGroup: string;
  allergies: string[];
  emergencyNotes: string;
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
    color: string;
  };
}

export type User = UserProfile;

export type ContactNotificationStatus = 'idle' | 'pending' | 'sent' | 'delivered' | 'failed';
export type HospitalNotificationStatus = 'idle' | 'pending' | 'sent' | 'received';
export type IncidentCaseStage = 'received' | 'acknowledged' | 'response_preparing' | 'resolved';
export type CasePriority = 'HIGH' | 'MEDIUM';

export type EmergencyFlowStage =
  | 'idle'
  | 'locating'
  | 'location_found'
  | 'ready_to_send'
  | 'alert_sent'
  | 'hospital_received'
  | 'acknowledged'
  | 'response_preparing'
  | 'resolved';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
  notifiedCount: number;
  lastNotified?: string;
  status: 'verified' | 'pending' | 'unreachable';
  notificationStatus: ContactNotificationStatus;
}

export interface EmergencyCase {
  id: string;
  caseNumber: string;
  type: string;
  location: string;
  latitude: number;
  longitude: number;
  accuracy: string;
  createdAt: string;
  status: IncidentCaseStage | 'alert_sent' | 'idle';
  stage: IncidentCaseStage;
  contactNotificationStatus: ContactNotificationStatus;
  hospitalNotificationStatus: HospitalNotificationStatus;
  responseStage: IncidentCaseStage | 'alert_received';
  // Patient and context metadata
  distance?: string;
  priority?: CasePriority;
  patientName?: string;
  bloodGroup?: string;
  vehicle?: string;
}

export type GpsSignalQuality = 'locked' | 'searching' | 'degraded';

export interface BatteryTelemetry {
  levelPercent: number;
  isCharging: boolean;
  status: 'optimal' | 'moderate' | 'low' | 'critical';
  estimatedHoursRemaining?: number;
}

export interface LocationTelemetry {
  latitude: number;
  longitude: number;
  address: string;
  accuracyMeters: number;
  speedKmh: number;
  heading: string;
  signalQuality: GpsSignalQuality;
  lastUpdated: string;
  battery?: BatteryTelemetry;
}

export type EmergencyStage = 'idle' | 'countdown' | 'triggered' | 'dispatched' | 'resolved';

export interface EmergencyStatus {
  stage: EmergencyStage;
  countdownSeconds: number;
  incidentType?: 'crash_detected' | 'manual_sos' | 'medical_distress' | 'breakdown';
  triggeredAt?: string;
  estimatedAmbulanceEtaMinutes?: number;
  assignedHospital?: string;
  notifiedContactsCount: number;
}

export type TriageSeverity = 'critical' | 'severe' | 'moderate' | 'minor';

export interface HospitalEmergencyCase {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  severity: TriageSeverity;
  incidentType: string;
  location: string;
  etaMinutes: number;
  ambulanceUnit: string;
  vitals: {
    heartRateBpm: number;
    bloodPressure: string;
    oxygenPercent: number;
  };
  reportedAt: string;
  status: 'en_route' | 'arrived' | 'triage_ready' | 'admitted';
}

export interface SafetyTip {
  id: string;
  category: 'collision_protocol' | 'highway_driving' | 'night_driving' | 'bad_weather';
  title: string;
  summary: string;
  readTime: string;
  priority: 'high' | 'standard';
}

export interface IncidentCase extends EmergencyCase {
  incidentType: string;
  receivedTime: string;
  contactStatus: string;
  priority: CasePriority;
}

export interface EmergencyEvent {
  id: string;
  step: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface EmergencyRecord {
  caseId: string;
  userName: string;
  emergencyType: string;
  location: string;
  latitude: number;
  longitude: number;
  locationAccuracy: string;
  primaryContact: {
    name: string;
    relationship: string;
    phone: string;
    notificationStatus: 'sent' | 'delivered';
    notifiedAt: string;
  };
  hospital: {
    name: string;
    notificationStatus: 'sent' | 'received';
    notifiedAt: string;
    etaMinutes: number;
  };
  createdAt: string;
  status: IncidentCaseStage;
  events: EmergencyEvent[];
}

export interface RoadSafePreferences {
  notificationsEnabled: boolean;
  audioAlerts: boolean;
  autoLockGps: boolean;
  theme: 'light';
  allowLocationSharing?: boolean;
  safetyReminders?: boolean;
  emergencyConfirmation?: boolean;
  reduceMotion?: boolean;
}

export interface RoadSafePersistentState {
  version: number;
  currentUser: UserProfile;
  emergencyContacts: EmergencyContact[];
  incidentCases: IncidentCase[];
  activeEmergencyCaseId: string | null;
  emergencyFlowStage: EmergencyFlowStage;
  emergencyStatus: EmergencyStatus;
  locationTelemetry: LocationTelemetry;
  batteryTelemetry: BatteryTelemetry;
  hospitalCases: HospitalEmergencyCase[];
  preferences: RoadSafePreferences;
}

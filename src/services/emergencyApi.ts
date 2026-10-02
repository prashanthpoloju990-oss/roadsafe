import { EmergencyRecord, IncidentCaseStage } from '../types';

export interface CreateEmergencyPayload {
  caseId?: string;
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
  };
  hospital: {
    name: string;
    etaMinutes: number;
  };
}

export const emergencyApi = {
  async getAll(): Promise<EmergencyRecord[]> {
    try {
      const res = await fetch('/api/emergencies');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch {
      // Graceful fallback from localStorage
      const cached = localStorage.getItem('roadsafe_demo_emergencies_records');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
      return [];
    }
  },

  async getById(caseId: string): Promise<EmergencyRecord | null> {
    try {
      const res = await fetch(`/api/emergencies/${caseId}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || null;
    } catch {
      const all = await this.getAll();
      return all.find(e => e.caseId === caseId) || null;
    }
  },

  async create(payload: CreateEmergencyPayload): Promise<EmergencyRecord> {
    try {
      const res = await fetch('/api/emergencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch {
      // Fallback local creation
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const timeFull = now.toLocaleTimeString();
      const caseId = payload.caseId || '2041';

      const fallbackRecord: EmergencyRecord = {
        caseId,
        userName: payload.userName,
        emergencyType: payload.emergencyType,
        location: payload.location,
        latitude: payload.latitude,
        longitude: payload.longitude,
        locationAccuracy: payload.locationAccuracy,
        primaryContact: {
          name: payload.primaryContact.name,
          relationship: payload.primaryContact.relationship,
          phone: payload.primaryContact.phone,
          notificationStatus: 'delivered',
          notifiedAt: timeStr,
        },
        hospital: {
          name: payload.hospital.name,
          notificationStatus: 'received',
          notifiedAt: timeStr,
          etaMinutes: payload.hospital.etaMinutes,
        },
        createdAt: timeStr,
        status: 'received',
        events: [
          {
            id: `evt_${Date.now()}_1`,
            step: 1,
            name: 'Emergency alert created',
            description: `Case #${caseId} generated with telemetry (±8 m).`,
            timestamp: timeFull,
            completed: true,
          },
          {
            id: `evt_${Date.now()}_2`,
            step: 2,
            name: 'Primary emergency contact notified',
            description: `Simulation: ${payload.primaryContact.name} notified.`,
            timestamp: timeFull,
            completed: true,
          },
          {
            id: `evt_${Date.now()}_3`,
            step: 3,
            name: 'Hospital notified',
            description: `${payload.hospital.name} triage intake pinged.`,
            timestamp: timeFull,
            completed: true,
          },
          {
            id: `evt_${Date.now()}_4`,
            step: 4,
            name: 'Hospital received emergency',
            description: 'Incident queued into active trauma admission system.',
            timestamp: timeFull,
            completed: true,
          },
        ],
      };
      return fallbackRecord;
    }
  },

  async updateStatus(caseId: string, status: IncidentCaseStage): Promise<EmergencyRecord | null> {
    try {
      const res = await fetch(`/api/emergencies/${caseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  async reset(): Promise<boolean> {
    try {
      const res = await fetch('/api/emergencies/reset', {
        method: 'POST',
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};

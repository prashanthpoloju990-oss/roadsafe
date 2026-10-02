import type { IncomingMessage, ServerResponse } from 'http';
import type { EmergencyRecord, IncidentCaseStage } from '../types/index.ts';
import { DEMO_EMERGENCY_RECORDS } from '../data/mockData.ts';

// In-memory store for server session
let emergencyDatabase: EmergencyRecord[] = JSON.parse(JSON.stringify(DEMO_EMERGENCY_RECORDS));

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        if (!body.trim()) return resolve({});
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

export function handleEmergencyApi(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = req.url || '';
  if (!url.startsWith('/api/emergencies')) {
    return next();
  }

  const cleanUrl = url.split('?')[0];
  const method = req.method || 'GET';

  // GET /api/emergencies - list all emergencies
  if (method === 'GET' && cleanUrl === '/api/emergencies') {
    return sendJson(res, 200, {
      success: true,
      data: emergencyDatabase,
    });
  }

  // POST /api/emergencies/reset - reset demo data
  if (method === 'POST' && cleanUrl === '/api/emergencies/reset') {
    emergencyDatabase = JSON.parse(JSON.stringify(DEMO_EMERGENCY_RECORDS));
    return sendJson(res, 200, {
      success: true,
      message: 'Demo emergency database reset successfully.',
      data: emergencyDatabase,
    });
  }

  // POST /api/emergencies - create emergency
  if (method === 'POST' && cleanUrl === '/api/emergencies') {
    parseJsonBody(req)
      .then(body => {
        const caseId = body.caseId || '2041';
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timeFull = now.toLocaleTimeString();

        const contactName = body.primaryContact?.name || 'Ananya Rao';
        const contactRelation = body.primaryContact?.relationship || 'Sister';
        const contactPhone = body.primaryContact?.phone || '+91 98490 12345';

        // 4 sequential simulated notification events
        const events = [
          {
            id: `evt_${Date.now()}_1`,
            step: 1 as const,
            name: 'Emergency alert created',
            description: `Case #${caseId} generated with high-accuracy telemetry (±8 m).`,
            timestamp: timeFull,
            completed: true,
          },
          {
            id: `evt_${Date.now()}_2`,
            step: 2 as const,
            name: 'Primary emergency contact notified',
            description: `Simulation: ${contactName} (${contactRelation} · ${contactPhone}) notified.`,
            timestamp: timeFull,
            completed: true,
          },
          {
            id: `evt_${Date.now()}_3`,
            step: 3 as const,
            name: 'Hospital notified',
            description: 'Apollo Emergency Centre, Jubilee Hills triage intake notified.',
            timestamp: timeFull,
            completed: true,
          },
          {
            id: `evt_${Date.now()}_4`,
            step: 4 as const,
            name: 'Hospital received emergency',
            description: 'Incident queued into active trauma admission system.',
            timestamp: timeFull,
            completed: true,
          },
        ];

        const newRecord: EmergencyRecord = {
          caseId,
          userName: body.userName || 'Prashanth Poloju',
          emergencyType: body.emergencyType || 'Road accident',
          location: body.location || 'Jubilee Hills, Hyderabad',
          latitude: body.latitude || 17.4325,
          longitude: body.longitude || 78.4071,
          locationAccuracy: body.locationAccuracy || '±8 m',
          primaryContact: {
            name: contactName,
            relationship: contactRelation,
            phone: contactPhone,
            notificationStatus: 'delivered',
            notifiedAt: timeStr,
          },
          hospital: {
            name: body.hospital?.name || 'Apollo Emergency Centre, Jubilee Hills',
            notificationStatus: 'received',
            notifiedAt: timeStr,
            etaMinutes: body.hospital?.etaMinutes || 8,
          },
          createdAt: timeStr,
          status: 'received',
          events,
        };

        // Upsert case in database (replace 2041 or prepend)
        const existingIdx = emergencyDatabase.findIndex(e => e.caseId === caseId);
        if (existingIdx >= 0) {
          emergencyDatabase[existingIdx] = newRecord;
        } else {
          emergencyDatabase.unshift(newRecord);
        }

        return sendJson(res, 201, {
          success: true,
          data: newRecord,
        });
      })
      .catch(err => {
        sendJson(res, 400, {
          success: false,
          error: 'Invalid emergency payload.',
        });
      });
    return;
  }

  // Parameterized routes: /api/emergencies/:caseId
  const match = cleanUrl.match(/^\/api\/emergencies\/([^/]+)$/);
  if (match) {
    const caseId = match[1];
    const record = emergencyDatabase.find(e => e.caseId === caseId);

    if (method === 'GET') {
      if (!record) {
        return sendJson(res, 404, {
          success: false,
          error: `Emergency case #${caseId} not found.`,
        });
      }
      return sendJson(res, 200, {
        success: true,
        data: record,
      });
    }

    if (method === 'PATCH') {
      parseJsonBody(req)
        .then(body => {
          if (!record) {
            return sendJson(res, 404, {
              success: false,
              error: `Emergency case #${caseId} not found.`,
            });
          }

          const validStages: IncidentCaseStage[] = [
            'received',
            'acknowledged',
            'response_preparing',
            'resolved',
          ];
          if (body.status && validStages.includes(body.status)) {
            record.status = body.status;
          }

          return sendJson(res, 200, {
            success: true,
            data: record,
          });
        })
        .catch(err => {
          sendJson(res, 400, {
            success: false,
            error: 'Failed to update emergency status.',
          });
        });
      return;
    }
  }

  // Not matched
  sendJson(res, 404, {
    success: false,
    error: 'Endpoint not found',
  });
}

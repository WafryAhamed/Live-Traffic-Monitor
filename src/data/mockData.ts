import type {
  Vehicle,
  TrafficAlert,
  TrafficData,
  HourlyDensity,
  AreaComparison,
  DashboardStats,
  TrafficPrediction,
  CongestionScore,
  CongestionGrade,
  EmergencyEvent,
  AIInsight,
  WeeklyReport } from
'../types/traffic';

// Helper to generate random coordinates near a center point
function getRandomCoord(
centerLat: number,
centerLng: number,
radiusKm: number)
: {lat: number;lng: number;} {
  const radiusInDeg = radiusKm / 111;
  const lat = centerLat + (Math.random() - 0.5) * 2 * radiusInDeg;
  const lng = centerLng + (Math.random() - 0.5) * 2 * radiusInDeg;
  return { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) };
}

// Colombo center coordinates
const COLOMBO_LAT = 6.9271;
const COLOMBO_LNG = 79.8612;

const zones = [
'Colombo Fort',
'Bambalapitiya',
'Wellawatte',
'Pettah',
'Rajagiriya',
'Dehiwala',
'Mount Lavinia',
'Maradana'];


const vehicleNames = [
'CAR-001',
'CAR-002',
'CAR-003',
'CAR-004',
'CAR-005',
'CAR-006',
'CAR-007',
'CAR-008',
'CAR-009',
'CAR-010',
'SLTB-1523',
'SLTB-1847',
'SLTB-2134',
'Private Bus-3456',
'Private Bus-4521',
'TUK-001',
'TUK-002',
'TUK-003',
'TUK-004',
'TUK-005',
'Ambulance-01',
'Police-01',
'Police-02',
'Ambulance-02',
'Fire-01',
'Delivery-01',
'Delivery-02',
'Motorbike-01'];


const vehicleTypes: Vehicle['type'][] = [
'car',
'car',
'car',
'car',
'car',
'car',
'car',
'car',
'car',
'car',
'bus',
'bus',
'bus',
'bus',
'bus',
'truck',
'truck',
'truck',
'truck',
'truck',
'emergency',
'emergency',
'emergency',
'emergency',
'emergency',
'car',
'car',
'car'];


const vehicleStatuses: Vehicle['status'][] = [
'active',
'active',
'active',
'active',
'idle',
'maintenance'];


function generatePlate(): string {
  const prefix = ['SRI', 'CMB', 'WP'];
  const selectedPrefix = prefix[Math.floor(Math.random() * prefix.length)];
  const nums = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${selectedPrefix}-${nums}-${suffix}`;
}

export function generateVehicles(): Vehicle[] {
  return vehicleNames.map((name, i) => {
    const coord = getRandomCoord(COLOMBO_LAT, COLOMBO_LNG, 8);
    const type = vehicleTypes[i] || 'car';
    return {
      id: `v-${i + 1}`,
      name,
      lat: coord.lat,
      lng: coord.lng,
      speed: Math.floor(Math.random() * 65) + 5,
      status:
      vehicleStatuses[Math.floor(Math.random() * vehicleStatuses.length)],
      type,
      heading: Math.floor(Math.random() * 360),
      plateNumber: generatePlate(),
      priority: type === 'emergency',
      fuelLevel: Math.floor(Math.random() * 60) + 40,
      distanceTraveled: Math.floor(Math.random() * 200) + 10,
      zone: zones[Math.floor(Math.random() * zones.length)]
    };
  });
}

const alertDescriptions: Record<TrafficAlert['type'], string[]> = {
  accident: [
  'Multi-vehicle collision on Galle Road',
  'Motorcyclist collision at Bambalapitiya junction',
  'Tuk tuk accident blocking traffic lane',
  'Vehicle collision near Colombo Fort'],

  congestion: [
  'Heavy traffic due to office hours',
  'Slow-moving traffic near Pettah market area',
  'Congestion building near Dehiwala junction',
  'Traffic backed up due to school zone'],

  roadblock: [
  'Police activity blocking Galle Road',
  'Road partially closed for emergency response',
  'Railway crossing causing traffic hold-up',
  'Market activity blocking adjacent roads'],

  construction: [
  'Lane closure for road resurfacing',
  'Construction work affecting traffic flow',
  'Water main repair blocking intersection',
  'Building demolition affecting adjacent road'],

  weather: [
  'Heavy rain causing traffic slowdown',
  'Reduced visibility due to wet conditions',
  'Flash flooding on low-lying roads',
  'Strong winds affecting vehicle movement']

};

const alertLocations = [
'Colombo Fort Junction',
'Bambalapitiya Cross Road',
'Wellawatte Main Road',
'Pettah Market Area',
'Rajagiriya Junction',
'Dehiwala Main Junction',
'Mount Lavinia Road',
'Maradana Junction',
'Slave Island Road',
'Borella Junction',
'Galle Road - Colombo',
'Keells Road Junction',
'Marine Drive Colombo',
'High Level Road',
'Duplication Road',
'Station Road Colombo',
'Chatham Street Area'];


const alertSeverities: TrafficAlert['severity'][] = [
'low',
'medium',
'high',
'critical'];

const alertTypes: TrafficAlert['type'][] = [
'accident',
'congestion',
'roadblock',
'construction',
'weather'];


export function generateAlerts(): TrafficAlert[] {
  return Array.from({ length: 18 }, (_, i) => {
    const type = alertTypes[i % alertTypes.length];
    const descriptions = alertDescriptions[type];
    const coord = getRandomCoord(COLOMBO_LAT, COLOMBO_LNG, 8);
    const hoursAgo = Math.floor(Math.random() * 48);
    return {
      id: `a-${i + 1}`,
      type,
      severity:
      alertSeverities[Math.floor(Math.random() * alertSeverities.length)],
      lat: coord.lat,
      lng: coord.lng,
      location: alertLocations[i % alertLocations.length],
      description:
      descriptions[Math.floor(Math.random() * descriptions.length)],
      timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
      resolved: Math.random() > 0.7
    };
  });
}

const areas = [
'Colombo Fort',
'Bambalapitiya',
'Wellawatte',
'Pettah',
'Rajagiriya',
'Dehiwala',
'Mount Lavinia',
'Maradana',
'Slave Island',
'Borella'];


export function generateTrafficData(): TrafficData[] {
  return areas.map((area) => ({
    area,
    density: Math.floor(Math.random() * 60) + 30,
    avgSpeed: Math.floor(Math.random() * 35) + 15,
    incidents: Math.floor(Math.random() * 8),
    peakHour: `${Math.floor(Math.random() * 4) + 7}:00 AM`,
    timestamp: new Date()
  }));
}

export function generateHourlyDensity(): HourlyDensity[] {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0');
    return `${h}:00`;
  });
  return hours.map((hour, i) => {
    let baseDensity = 15;
    if (i >= 6 && i <= 9) baseDensity = 50 + (i - 6) * 15;else
    if (i >= 10 && i <= 15) baseDensity = 55;else
    if (i >= 16 && i <= 19)
    baseDensity = 60 + (i === 17 ? 25 : i === 18 ? 20 : 10);else
    if (i >= 20 && i <= 23) baseDensity = 35 - (i - 20) * 5;else
    if (i >= 0 && i <= 5) baseDensity = 10 + Math.floor(Math.random() * 8);
    const density = Math.min(
      100,
      Math.max(5, baseDensity + Math.floor(Math.random() * 15 - 7))
    );
    const speed = Math.max(
      10,
      55 - Math.floor(density * 0.4) + Math.floor(Math.random() * 10)
    );
    return { hour, density, speed };
  });
}

export function generateAreaComparison(): AreaComparison[] {
  return areas.slice(0, 6).map((area) => ({
    area,
    density: Math.floor(Math.random() * 50) + 30,
    incidents: Math.floor(Math.random() * 10),
    avgSpeed: Math.floor(Math.random() * 30) + 20
  }));
}

export function generateDashboardStats(
vehicles: Vehicle[],
alerts: TrafficAlert[])
: DashboardStats {
  const activeVehicles = vehicles.filter((v) => v.status === 'active').length;
  const activeAlerts = alerts.filter((a) => !a.resolved).length;
  const avgSpeed = Math.round(
    vehicles.reduce((sum, v) => sum + v.speed, 0) / vehicles.length
  );
  const congestionLevel = Math.min(
    100,
    Math.round(activeAlerts * 4 + (100 - avgSpeed))
  );
  return {
    totalVehicles: activeVehicles,
    activeAlerts,
    avgSpeed,
    congestionLevel: Math.max(0, Math.min(100, congestionLevel))
  };
}

export function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── AI & Prediction Generators ──

function getGrade(score: number): CongestionGrade {
  if (score <= 20) return 'A';
  if (score <= 40) return 'B';
  if (score <= 60) return 'C';
  if (score <= 80) return 'D';
  return 'F';
}

export function generatePredictions(): TrafficPrediction[] {
  const now = new Date();
  const currentHour = now.getHours();
  const intervals = [10, 20, 30, 45, 60, 90, 120];

  return intervals.map((mins) => {
    const futureHour = (currentHour + Math.floor(mins / 60)) % 24;
    const isRush =
    futureHour >= 7 && futureHour <= 9 ||
    futureHour >= 16 && futureHour <= 19;
    const baseDensity = isRush ?
    70 + Math.floor(Math.random() * 20) :
    30 + Math.floor(Math.random() * 30);
    const baseSpeed = Math.max(12, 55 - Math.floor(baseDensity * 0.45));
    const trend =
    baseDensity > 65 ?
    'worsening' as const :
    baseDensity < 40 ?
    'improving' as const :
    'stable' as const;

    return {
      timeLabel: `+${mins}min`,
      minutesFromNow: mins,
      predictedDensity: baseDensity,
      predictedSpeed: baseSpeed + Math.floor(Math.random() * 8),
      confidence: Math.max(60, 95 - Math.floor(mins * 0.25)),
      trend
    };
  });
}

export function generateCongestionScore(
trafficData: TrafficData[])
: CongestionScore {
  const areaScores = trafficData.slice(0, 6).map((td) => ({
    area: td.area,
    score: Math.round(td.density * 0.7 + td.incidents * 5),
    grade: getGrade(Math.round(td.density * 0.7 + td.incidents * 5))
  }));
  const overall = Math.round(
    areaScores.reduce((s, a) => s + a.score, 0) / areaScores.length
  );
  const currentHour = new Date().getHours();
  const peakExpected =
  currentHour < 8 ?
  '8:00 AM' :
  currentHour < 17 ?
  '5:30 PM' :
  'Tomorrow 8:00 AM';

  return {
    overall: Math.min(100, overall),
    grade: getGrade(overall),
    areas: areaScores,
    trend: overall > 60 ? 'worsening' : overall < 35 ? 'improving' : 'stable',
    peakExpected
  };
}

const emergencyTypes: EmergencyEvent['type'][] = ['ambulance', 'fire', 'police'];
const emergencyDestinations = [
'National Hospital of Sri Lanka',
'Colombo South Hospital',
'Lady Ridgeway Hospital',
'Fire Station - Colombo Fort',
'Police Headquarters - Colombo',
'Sri Jayewardenepura Hospital'];


export function generateEmergencyEvents(vehicles: Vehicle[]): EmergencyEvent[] {
  const emergencyVehicles = vehicles.filter(
    (v) => v.type === 'emergency' && v.status === 'active'
  );
  return emergencyVehicles.slice(0, 3).map((v, i) => ({
    id: `em-${i + 1}`,
    vehicleId: v.id,
    vehicleName: v.name,
    type: emergencyTypes[i % emergencyTypes.length],
    origin: alertLocations[Math.floor(Math.random() * alertLocations.length)],
    destination:
    emergencyDestinations[
    Math.floor(Math.random() * emergencyDestinations.length)],

    eta: Math.floor(Math.random() * 12) + 3,
    priority: i === 0 ? 'critical' : 'high',
    status: i === 0 ? 'en-route' : i === 1 ? 'on-scene' : 'returning',
    clearedPath: i === 0,
    lat: v.lat,
    lng: v.lng,
    timestamp: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 60 * 1000
    )
  }));
}

export function generateAIInsights(): AIInsight[] {
  return [
  {
    id: 'ai-1',
    type: 'prediction',
    title: 'Office Hours Surge Expected',
    description:
    'AI models predict a 35% increase in traffic density on Galle Road between 8:00-9:30 AM. Recommend pre-positioning traffic officers at key intersections in Colombo Fort.',
    impact: 'high',
    confidence: 92,
    timestamp: new Date(),
    actionable: true,
    action: 'Deploy traffic management resources'
  },
  {
    id: 'ai-2',
    type: 'anomaly',
    title: 'Unusual Pattern Detected — Pettah Market',
    description:
    'Traffic flow in Pettah area is 40% below normal for this time. Possible unreported incident or event causing diversion near market area.',
    impact: 'medium',
    confidence: 87,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    actionable: true,
    action: 'Investigate and dispatch patrol'
  },
  {
    id: 'ai-3',
    type: 'optimization',
    title: 'Signal Timing Optimization Available',
    description:
    'Adjusting signal timing at Bambalapitiya junction could reduce average wait time by 23% and improve throughput by 15%.',
    impact: 'high',
    confidence: 89,
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    actionable: true,
    action: 'Apply optimized signal plan'
  },
  {
    id: 'ai-4',
    type: 'recommendation',
    title: 'Emergency Route Cleared — Ambulance Priority',
    description:
    'Smart routing has cleared a priority corridor for Ambulance-01 via Marine Drive. ETA to National Hospital reduced by 4 minutes.',
    impact: 'high',
    confidence: 95,
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    actionable: false
  },
  {
    id: 'ai-5',
    type: 'prediction',
    title: 'Congestion Relief Expected Soon',
    description:
    'Current congestion at Colombo Fort junction is expected to clear by 25 minutes based on outflow rate analysis.',
    impact: 'medium',
    confidence: 78,
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    actionable: false
  },
  {
    id: 'ai-6',
    type: 'anomaly',
    title: 'Sensor Anomaly — Wellawatte Road',
    description:
    'IoT sensor WW-042 reporting inconsistent readings. Data quality may be affected for Wellawatte traffic estimates.',
    impact: 'low',
    confidence: 94,
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    actionable: true,
    action: 'Schedule sensor maintenance'
  }];

}

export function generateWeeklyReport(): WeeklyReport[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => {
    const isWeekend = i >= 5;
    const baseDensity = isWeekend ? 35 : 55;
    return {
      day,
      avgDensity: baseDensity + Math.floor(Math.random() * 20 - 10),
      avgSpeed: isWeekend ?
      38 + Math.floor(Math.random() * 10) :
      25 + Math.floor(Math.random() * 12),
      incidents: isWeekend ?
      Math.floor(Math.random() * 5) :
      Math.floor(Math.random() * 12) + 3,
      congestionScore: baseDensity + Math.floor(Math.random() * 15 - 5)
    };
  });
}
export type VehicleStatus = 'active' | 'idle' | 'maintenance';
export type VehicleType = 'car' | 'bus' | 'truck' | 'emergency';
export type AlertType =
'accident' |
'congestion' |
'roadblock' |
'construction' |
'weather';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type TrafficLevel = 'low' | 'moderate' | 'heavy';
export type PageType =
'home' |
'dashboard' |
'map' |
'alerts' |
'vehicles' |
'routes' |
'ai-insights';

export interface Vehicle {
  id: string;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  status: VehicleStatus;
  type: VehicleType;
  heading: number;
  plateNumber: string;
  priority: boolean;
  fuelLevel: number;
  distanceTraveled: number;
  zone: string;
}

export interface TrafficAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  lat: number;
  lng: number;
  location: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

export interface TrafficData {
  area: string;
  density: number;
  avgSpeed: number;
  incidents: number;
  peakHour: string;
  timestamp: Date;
}

export interface Route {
  id: string;
  source: string;
  destination: string;
  waypoints: {lat: number;lng: number;}[];
  distance: number;
  eta: number;
  trafficLevel: TrafficLevel;
}

export interface DashboardStats {
  totalVehicles: number;
  activeAlerts: number;
  avgSpeed: number;
  congestionLevel: number;
}

export interface HourlyDensity {
  hour: string;
  density: number;
  speed: number;
}

export interface AreaComparison {
  area: string;
  density: number;
  incidents: number;
  avgSpeed: number;
}

export interface Trend {
  value: number;
  isPositive: boolean;
}

// ── AI & Prediction Types ──

export type CongestionGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface TrafficPrediction {
  timeLabel: string;
  minutesFromNow: number;
  predictedDensity: number;
  predictedSpeed: number;
  confidence: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface CongestionScore {
  overall: number;
  grade: CongestionGrade;
  areas: {area: string;score: number;grade: CongestionGrade;}[];
  trend: 'improving' | 'stable' | 'worsening';
  peakExpected: string;
}

export interface EmergencyEvent {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: 'ambulance' | 'fire' | 'police';
  origin: string;
  destination: string;
  eta: number;
  priority: 'high' | 'critical';
  status: 'en-route' | 'on-scene' | 'returning';
  clearedPath: boolean;
  lat: number;
  lng: number;
  timestamp: Date;
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'anomaly' | 'optimization';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  timestamp: Date;
  actionable: boolean;
  action?: string;
}

export interface WeeklyReport {
  day: string;
  avgDensity: number;
  avgSpeed: number;
  incidents: number;
  congestionScore: number;
}
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type {
  Vehicle,
  TrafficAlert,
  TrafficData,
  DashboardStats,
  TrafficPrediction,
  CongestionScore,
  EmergencyEvent,
  AIInsight } from
'../types/traffic';
import {
  generateVehicles,
  generateAlerts,
  generateTrafficData,
  generateDashboardStats,
  generatePredictions,
  generateCongestionScore,
  generateEmergencyEvents,
  generateAIInsights } from
'../data/mockData';

interface SimulationState {
  vehicles: Vehicle[];
  alerts: TrafficAlert[];
  trafficData: TrafficData[];
  stats: DashboardStats;
  predictions: TrafficPrediction[];
  congestionScore: CongestionScore;
  emergencyEvents: EmergencyEvent[];
  aiInsights: AIInsight[];
  isConnected: boolean;
  uptimeSeconds: number;
}

const alertTypes: TrafficAlert['type'][] = [
'accident',
'congestion',
'roadblock',
'construction',
'weather'];

const alertSeverities: TrafficAlert['severity'][] = [
'low',
'medium',
'high',
'critical'];

const alertLocations = [
'Broadway & W 42nd St',
'FDR Drive near E 34th St',
'Brooklyn Bridge Approach',
'Lincoln Tunnel Entrance',
'Times Square Area',
'Holland Tunnel Exit',
'Queens Blvd & 63rd Dr',
'Grand Concourse & E 161st',
'Atlantic Ave & Flatbush'];

const alertDescriptions = [
'New incident reported by traffic sensors',
'Congestion detected by monitoring system',
'Road obstruction reported by patrol unit',
'Weather-related hazard detected',
'Construction zone causing delays'];


function moveVehicle(vehicle: Vehicle): Vehicle {
  if (vehicle.status !== 'active') return vehicle;

  const latOffset = (Math.random() - 0.5) * 0.002;
  const lngOffset = (Math.random() - 0.5) * 0.002;
  const speedChange = Math.floor(Math.random() * 20) - 10;
  const newSpeed = Math.max(0, Math.min(80, vehicle.speed + speedChange));
  const newHeading =
  (vehicle.heading + Math.floor(Math.random() * 30) - 15 + 360) % 360;
  const fuelDrain = vehicle.speed > 0 ? Math.random() * 0.3 : 0;

  return {
    ...vehicle,
    lat: parseFloat((vehicle.lat + latOffset).toFixed(6)),
    lng: parseFloat((vehicle.lng + lngOffset).toFixed(6)),
    speed: newSpeed,
    heading: newHeading,
    fuelLevel: Math.max(5, vehicle.fuelLevel - fuelDrain),
    distanceTraveled: vehicle.distanceTraveled + newSpeed * 2 / 3600
  };
}

function generateNewAlert(existingCount: number): TrafficAlert {
  const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  return {
    id: `a-live-${existingCount + 1}-${Date.now()}`,
    type,
    severity:
    alertSeverities[Math.floor(Math.random() * alertSeverities.length)],
    lat: 40.7128 + (Math.random() - 0.5) * 0.14,
    lng: -74.006 + (Math.random() - 0.5) * 0.14,
    location: alertLocations[Math.floor(Math.random() * alertLocations.length)],
    description:
    alertDescriptions[Math.floor(Math.random() * alertDescriptions.length)],
    timestamp: new Date(),
    resolved: false
  };
}

export function useTrafficSimulation(): SimulationState {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => generateVehicles());
  const [alerts, setAlerts] = useState<TrafficAlert[]>(() => generateAlerts());
  const [trafficData, setTrafficData] = useState<TrafficData[]>(() =>
  generateTrafficData()
  );
  const [predictions, setPredictions] = useState<TrafficPrediction[]>(() =>
  generatePredictions()
  );
  const [aiInsights] = useState<AIInsight[]>(() => generateAIInsights());
  const [isConnected, setIsConnected] = useState(false);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const tickRef = useRef(0);

  const updateSimulation = useCallback(() => {
    tickRef.current += 1;

    // Move vehicles every tick
    setVehicles((prev) => prev.map(moveVehicle));

    // Update uptime
    setUptimeSeconds((prev) => prev + 2);

    // Generate new alert every ~5 ticks (~10 seconds)
    if (tickRef.current % 5 === 0) {
      setAlerts((prev) => {
        const updated = prev.map((a) =>
        !a.resolved && Math.random() > 0.85 ? { ...a, resolved: true } : a
        );
        const newAlert = generateNewAlert(updated.length);
        return [newAlert, ...updated].slice(0, 30);
      });
    }

    // Update traffic density every ~8 ticks — with traffic spikes
    if (tickRef.current % 8 === 0) {
      const isSpiking = Math.random() > 0.85; // 15% chance of traffic spike
      setTrafficData((prev) =>
      prev.map((td) => {
        const spikeBoost = isSpiking && Math.random() > 0.5 ? 15 : 0;
        return {
          ...td,
          density: Math.max(
            10,
            Math.min(
              95,
              td.density + Math.floor(Math.random() * 10) - 5 + spikeBoost
            )
          ),
          avgSpeed: Math.max(
            10,
            Math.min(
              55,
              td.avgSpeed +
              Math.floor(Math.random() * 8) -
              4 -
              Math.floor(spikeBoost * 0.3)
            )
          ),
          incidents: Math.max(
            0,
            td.incidents + (
            Math.random() > 0.7 ? 1 : Math.random() > 0.5 ? -1 : 0)
          ),
          timestamp: new Date()
        };
      })
      );
    }

    // Update predictions every ~15 ticks (~30 seconds)
    if (tickRef.current % 15 === 0) {
      setPredictions(generatePredictions());
    }
  }, []);

  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
    }, 800);

    const interval = setInterval(updateSimulation, 2000);

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(interval);
    };
  }, [updateSimulation]);

  const stats = generateDashboardStats(vehicles, alerts);
  const congestionScore = useMemo(
    () => generateCongestionScore(trafficData),
    [trafficData]
  );
  const emergencyEvents = useMemo(
    () => generateEmergencyEvents(vehicles),
    [vehicles]
  );

  return {
    vehicles,
    alerts,
    trafficData,
    stats,
    predictions,
    congestionScore,
    emergencyEvents,
    aiInsights,
    isConnected,
    uptimeSeconds
  };
}
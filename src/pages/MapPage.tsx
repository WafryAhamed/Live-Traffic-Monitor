import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  createElement } from
'react';
import type { Vehicle, TrafficAlert, TrafficData } from '../types/traffic';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Switch } from '../components/Switch';
import { ScrollArea } from '../components/ScrollArea';
import { Separator } from '../components/Separator';
import { getTimeAgo } from '../data/mockData';
import {
  Car,
  Bus,
  Truck,
  Siren,
  AlertTriangle,
  Layers,
  X,
  MapPin,
  Activity,
  ShieldAlert,
  Construction,
  CloudRain,
  TrafficCone,
  Locate,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft } from
'lucide-react';
interface MapPageProps {
  vehicles: Vehicle[];
  alerts: TrafficAlert[];
  trafficData: TrafficData[];
}
const vehicleTypeIcons: Record<Vehicle['type'], React.ReactNode> = {
  car: <Car className="h-3.5 w-3.5" />,
  bus: <Bus className="h-3.5 w-3.5" />,
  truck: <Truck className="h-3.5 w-3.5" />,
  emergency: <Siren className="h-3.5 w-3.5" />
};
const vehicleTypeColors: Record<Vehicle['type'], string> = {
  car: '#328cc1',
  bus: '#10b981',
  truck: '#f59e0b',
  emergency: '#ef4444'
};
const alertTypeIcons: Record<TrafficAlert['type'], React.ReactNode> = {
  accident: <ShieldAlert className="h-3.5 w-3.5" />,
  congestion: <Activity className="h-3.5 w-3.5" />,
  roadblock: <TrafficCone className="h-3.5 w-3.5" />,
  construction: <Construction className="h-3.5 w-3.5" />,
  weather: <CloudRain className="h-3.5 w-3.5" />
};
const severityColors: Record<TrafficAlert['severity'], string> = {
  low: '#3b82f6',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444'
};
const severityBadgeClasses: Record<TrafficAlert['severity'], string> = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  medium:
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};
const statusColors: Record<Vehicle['status'], string> = {
  active: '#10b981',
  idle: '#f59e0b',
  maintenance: '#ef4444'
};
interface SelectedItem {
  type: 'vehicle' | 'alert';
  id: string;
}
export function MapPage({ vehicles, alerts, trafficData }: MapPageProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const activeAlerts = useMemo(
    () => alerts.filter((a) => !a.resolved),
    [alerts]
  );
  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;
    const loadLeaflet = async () => {
      try {
        const L = await import('leaflet');
        // Add Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }
        const map = L.map(mapRef.current!, {
          center: [6.9271, 79.8612],
          zoom: 12,
          zoomControl: false
        });
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
            maxZoom: 19
          }
        ).addTo(map);
        leafletMapRef.current = map;
        setMapReady(true);
      } catch (err) {
        console.error('Failed to load Leaflet:', err);
      }
    };
    loadLeaflet();
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);
  // Update markers when data changes
  useEffect(() => {
    if (!leafletMapRef.current || !mapReady) return;
    const updateMarkers = async () => {
      const L = await import('leaflet');
      const map = leafletMapRef.current;
      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      // Add heatmap circles (traffic density)
      if (showHeatmap) {
        trafficData.forEach((td) => {
          const areaCoords: Record<string, [number, number]> = {
            'Colombo Fort': [6.9343, 79.8467],
            'Bambalapitiya': [6.9417, 79.8617],
            'Wellawatte': [6.9500, 79.8683],
            'Pettah': [6.9271, 79.8589],
            'Rajagiriya': [6.9085, 79.8904],
            'Dehiwala': [6.9714, 79.8794],
            'Mount Lavinia': [6.9880, 79.8708],
            'Maradana': [6.9287, 79.8450],
            'Slave Island': [6.9306, 79.8517],
            'Borella': [6.9034, 79.8662]
          };
          const coords = areaCoords[td.area];
          if (coords) {
            const color =
            td.density > 70 ?
            '#ef4444' :
            td.density > 45 ?
            '#f59e0b' :
            '#10b981';
            const circle = L.circleMarker(coords, {
              radius: Math.max(15, td.density * 0.4),
              fillColor: color,
              fillOpacity: 0.2,
              color: color,
              weight: 1,
              opacity: 0.4
            }).addTo(map);
            circle.bindTooltip(`${td.area}: ${td.density}% density`, {
              className: 'leaflet-tooltip-custom'
            });
            markersRef.current.push(circle);
          }
        });
      }
      // Add vehicle markers
      if (showVehicles) {
        vehicles.forEach((v) => {
          const color = vehicleTypeColors[v.type];
          const statusColor = statusColors[v.status];
          const icon = L.divIcon({
            className: 'custom-vehicle-marker',
            html: `<div style="
              width: 28px; height: 28px;
              background: ${color};
              border: 2px solid ${statusColor};
              border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 2px 8px ${color}66;
              cursor: pointer;
              transition: transform 0.3s;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                ${v.type === 'car' ? '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>' : v.type === 'bus' ? '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="15" cy="18" r="2"/>' : v.type === 'truck' ? '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>' : '<path d="M7 18v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/><path d="M12 4v4"/><path d="m4.9 4.9 2.8 2.8"/><path d="m19.1 4.9-2.8 2.8"/>'}
              </svg>
            </div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });
          const marker = L.marker([v.lat, v.lng], {
            icon
          }).addTo(map);
          marker.bindPopup(`
            <div style="font-family: Geist, sans-serif; min-width: 180px;">
              <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">${v.name}</div>
              <div style="font-size: 11px; color: #707070; margin-bottom: 8px;">${v.plateNumber}</div>
              <div style="display: flex; gap: 12px; font-size: 11px;">
                <span><strong>Speed:</strong> ${v.speed} km/h</span>
                <span><strong>Status:</strong> ${v.status}</span>
              </div>
              <div style="font-size: 11px; margin-top: 4px;">
                <strong>Type:</strong> ${v.type}
              </div>
            </div>
          `);
          markersRef.current.push(marker);
        });
      }
      // Add alert markers
      if (showAlerts) {
        activeAlerts.forEach((a) => {
          const color = severityColors[a.severity];
          const icon = L.divIcon({
            className: 'custom-alert-marker',
            html: `<div style="
              width: 24px; height: 24px;
              background: ${color};
              border: 2px solid white;
              border-radius: 4px;
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 2px 8px ${color}88;
              cursor: pointer;
              animation: pulse 2s infinite;
            ">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
              </svg>
            </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });
          const marker = L.marker([a.lat, a.lng], {
            icon
          }).addTo(map);
          marker.bindPopup(`
            <div style="font-family: Geist, sans-serif; min-width: 200px;">
              <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px; text-transform: capitalize;">${a.type} Alert</div>
              <div style="font-size: 11px; color: #707070; margin-bottom: 4px;">${a.location}</div>
              <div style="font-size: 11px; margin-bottom: 4px;">${a.description}</div>
              <div style="display: flex; gap: 8px; font-size: 11px; align-items: center;">
                <span style="background: ${color}22; color: ${color}; padding: 1px 6px; border-radius: 4px; font-weight: 600; text-transform: uppercase; font-size: 10px;">${a.severity}</span>
                <span style="color: #707070;">${getTimeAgo(a.timestamp)}</span>
              </div>
            </div>
          `);
          markersRef.current.push(marker);
        });
      }
    };
    updateMarkers();
  }, [
  vehicles,
  activeAlerts,
  trafficData,
  showVehicles,
  showAlerts,
  showHeatmap,
  mapReady]
  );
  const selectedVehicle =
  selectedItem?.type === 'vehicle' ?
  vehicles.find((v) => v.id === selectedItem.id) :
  null;
  const selectedAlert =
  selectedItem?.type === 'alert' ?
  alerts.find((a) => a.id === selectedItem.id) :
  null;
  function focusOnCoord(lat: number, lng: number) {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([lat, lng], 15, {
        animate: true
      });
    }
  }
  return (
    <div className="flex h-[calc(100vh-5rem)] -m-6 relative">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* Map Controls Overlay */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="bg-white dark:bg-card shadow-lg"
            onClick={() => leafletMapRef.current?.zoomIn()}
            aria-label="Zoom in">
            
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-white dark:bg-card shadow-lg"
            onClick={() => leafletMapRef.current?.zoomOut()}
            aria-label="Zoom out">
            
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-white dark:bg-card shadow-lg"
            onClick={() =>
            leafletMapRef.current?.setView([40.7128, -74.006], 12, {
              animate: true
            })
            }
            aria-label="Reset view">
            
            <Locate className="h-4 w-4" />
          </Button>
        </div>

        {/* Panel Toggle */}
        <Button
          size="icon-sm"
          variant="secondary"
          className="absolute top-4 left-4 z-[1000] bg-white dark:bg-card shadow-lg"
          onClick={() => setPanelOpen(!panelOpen)}
          aria-label={panelOpen ? 'Close panel' : 'Open panel'}>
          
          {panelOpen ?
          <ChevronLeft className="h-4 w-4" /> :

          <ChevronRight className="h-4 w-4" />
          }
        </Button>

        {/* Loading overlay */}
        {!mapReady &&
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-[#f4f4f4] dark:bg-background">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-[#328cc1] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#707070] dark:text-muted-foreground">
                Loading map...
              </p>
            </div>
          </div>
        }
      </div>

      {/* Side Panel */}
      {panelOpen &&
      <div className="w-[320px] border-l border-border bg-card flex flex-col flex-shrink-0">
          {/* Layer Controls */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4 text-[#328cc1]" />
              <h3 className="text-sm font-semibold text-foreground">
                Map Layers
              </h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-3.5 w-3.5 text-[#328cc1]" />
                  <span className="text-xs text-foreground">
                    Vehicles ({vehicles.length})
                  </span>
                </div>
                <Switch
                size="sm"
                checked={showVehicles}
                onCheckedChange={setShowVehicles} />
              
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs text-foreground">
                    Alerts ({activeAlerts.length})
                  </span>
                </div>
                <Switch
                size="sm"
                checked={showAlerts}
                onCheckedChange={setShowAlerts} />
              
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs text-foreground">
                    Density Heatmap
                  </span>
                </div>
                <Switch
                size="sm"
                checked={showHeatmap}
                onCheckedChange={setShowHeatmap} />
              
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 border-b border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Legend
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5">
                <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: '#328cc1'
                }} />
              
                <span className="text-[10px] text-muted-foreground">Car</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: '#10b981'
                }} />
              
                <span className="text-[10px] text-muted-foreground">Bus</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: '#f59e0b'
                }} />
              
                <span className="text-[10px] text-muted-foreground">Truck</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: '#ef4444'
                }} />
              
                <span className="text-[10px] text-muted-foreground">
                  Emergency
                </span>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5">
                <div
                className="w-3 h-3 rounded"
                style={{
                  background: '#10b981'
                }} />
              
                <span className="text-[10px] text-muted-foreground">
                  Low density
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                className="w-3 h-3 rounded"
                style={{
                  background: '#f59e0b'
                }} />
              
                <span className="text-[10px] text-muted-foreground">
                  Medium
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                className="w-3 h-3 rounded"
                style={{
                  background: '#ef4444'
                }} />
              
                <span className="text-[10px] text-muted-foreground">
                  High density
                </span>
              </div>
            </div>
          </div>

          {/* Active Alerts List */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 pt-3 pb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Alerts ({activeAlerts.length})
              </h3>
            </div>
            <ScrollArea className="flex-1 px-2">
              <div className="space-y-1 pb-2">
                {activeAlerts.slice(0, 15).map((alert) =>
              <button
                key={alert.id}
                className="w-full text-left p-2.5 rounded-lg hover:bg-[#f4f4f4] dark:hover:bg-muted/50 transition-colors"
                onClick={() => {
                  setSelectedItem({
                    type: 'alert',
                    id: alert.id
                  });
                  focusOnCoord(alert.lat, alert.lng);
                }}>
                
                    <div className="flex items-start gap-2">
                      <div
                    className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded mt-0.5"
                    style={{
                      background: `${severityColors[alert.severity]}22`,
                      color: severityColors[alert.severity]
                    }}>
                    
                        {alertTypeIcons[alert.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate capitalize">
                          {alert.type} — {alert.location}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                        variant="secondary"
                        className={`text-[9px] px-1 py-0 h-4 ${severityBadgeClasses[alert.severity]}`}>
                        
                            {alert.severity}
                          </Badge>
                          <span className="text-[9px] text-muted-foreground">
                            {getTimeAgo(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
              )}
                {activeAlerts.length === 0 &&
              <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertTriangle className="h-6 w-6 text-muted-foreground/40 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      No active alerts
                    </p>
                  </div>
              }
              </div>
            </ScrollArea>
          </div>
        </div>
      }

      {/* Pulse animation style */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 10px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        }
        .leaflet-popup-content {
          margin: 12px 14px !important;
        }
      `}</style>
    </div>);

}
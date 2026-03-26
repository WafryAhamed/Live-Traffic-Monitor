import React, { useMemo, useState } from 'react';
import type { Route, TrafficLevel } from '../types/traffic';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter } from
'../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { Separator } from '../components/Separator';
import {
  Navigation,
  MapPin,
  Clock,
  Route as RouteIcon,
  ArrowRight,
  Star,
  Zap,
  AlertTriangle,
  CheckCircle2,
  CornerDownRight,
  Timer,
  TrendingUp,
  Search } from
'lucide-react';
interface RoutesPageProps {}
const trafficLevelConfig: Record<
  TrafficLevel,
  {
    label: string;
    color: string;
    badgeClass: string;
  }> =
{
  low: {
    label: 'Low Traffic',
    color: '#10b981',
    badgeClass:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  },
  moderate: {
    label: 'Moderate Traffic',
    color: '#f59e0b',
    badgeClass:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  },
  heavy: {
    label: 'Heavy Traffic',
    color: '#ef4444',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
};
interface MockRouteResult {
  id: string;
  name: string;
  distance: number;
  eta: number;
  trafficLevel: TrafficLevel;
  recommended: boolean;
  description: string;
  savings: string;
}
function generateMockRoutes(
source: string,
destination: string)
: MockRouteResult[] {
  return [
  {
    id: 'r-1',
    name: 'Via Galle Road',
    distance: 8.2,
    eta: 22,
    trafficLevel: 'low',
    recommended: true,
    description: `Take Galle Road south, continue to ${destination}. Light traffic expected.`,
    savings: '12 min faster than alternate'
  },
  {
    id: 'r-2',
    name: 'Via Marine Drive',
    distance: 7.5,
    eta: 34,
    trafficLevel: 'moderate',
    recommended: false,
    description: `Head via Marine Drive through coastal route, continue to ${destination}. Moderate congestion expected.`,
    savings: ''
  },
  {
    id: 'r-3',
    name: 'Via Rajagiriya',
    distance: 9.8,
    eta: 28,
    trafficLevel: 'low',
    recommended: false,
    description: `Take route via Rajagiriya, head east to ${destination}. Slightly longer but less congested.`,
    savings: '6 min faster than Marine Drive'
  }];

}
const popularRoutes = [
{
  source: 'Colombo Fort',
  destination: 'Dehiwala'
},
{
  source: 'Pettah Market',
  destination: 'Mount Lavinia'
},
{
  source: 'Bambalapitiya',
  destination: 'Borella'
},
{
  source: 'Maradana',
  destination: 'Wellawatte'
},
{
  source: 'Slave Island',
  destination: 'Mount Lavinia'
}];

export function RoutesPage({}: RoutesPageProps) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState<MockRouteResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  function handleSearch() {
    if (!source.trim() || !destination.trim()) return;
    setLoading(true);
    setSearched(false);
    // Simulate API delay
    setTimeout(() => {
      setRoutes(generateMockRoutes(source, destination));
      setSearched(true);
      setLoading(false);
    }, 800);
  }
  function handlePopularRoute(s: string, d: string) {
    setSource(s);
    setDestination(d);
    setLoading(true);
    setSearched(false);
    setTimeout(() => {
      setRoutes(generateMockRoutes(s, d));
      setSearched(true);
      setLoading(false);
    }, 800);
  }
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Route Planning
        </h1>
        <p className="text-sm text-[#707070] dark:text-muted-foreground mt-1">
          Find the best routes with real-time traffic-aware suggestions
        </p>
      </div>

      {/* Search Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">A</span>
                </div>
                Source
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter starting location..."
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="pl-9"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center w-10 h-10 mb-0.5">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">B</span>
                </div>
                Destination
              </label>
              <div className="relative">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter destination..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-9"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                
              </div>
            </div>

            <Button
              className="bg-[#328cc1] hover:bg-[#2a7ab0] text-white min-w-[120px]"
              onClick={handleSearch}
              disabled={!source.trim() || !destination.trim() || loading}>
              
              {loading ?
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> :

              <>
                  <Search className="h-4 w-4 mr-1.5" />
                  Find Routes
                </>
              }
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Routes */}
      {!searched && !loading &&
      <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Popular Routes</CardTitle>
            <CardDescription>
              Quick access to frequently searched routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {popularRoutes.map((route, idx) =>
            <button
              key={idx}
              className="p-3 rounded-lg border border-border hover:border-[#328cc1]/30 hover:bg-[#d9e8f5]/30 dark:hover:bg-[#328cc1]/10 transition-all text-left group"
              onClick={() =>
              handlePopularRoute(route.source, route.destination)
              }>
              
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-[8px] text-white font-bold">A</span>
                    </div>
                    <span className="text-xs font-medium text-foreground truncate">
                      {route.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-[8px] text-white font-bold">B</span>
                    </div>
                    <span className="text-xs font-medium text-foreground truncate">
                      {route.destination}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-[#328cc1] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Search className="h-3 w-3" />
                    Search this route
                  </div>
                </button>
            )}
            </div>
          </CardContent>
        </Card>
      }

      {/* Loading State */}
      {loading &&
      <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-[#328cc1] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">
                Finding best routes...
              </p>
            </div>
          </CardContent>
        </Card>
      }

      {/* Route Results */}
      {searched && !loading &&
      <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              {routes.length} routes found
            </h2>
            <p className="text-xs text-muted-foreground">
              {source} → {destination}
            </p>
          </div>

          {routes.map((route) =>
        <Card
          key={route.id}
          className={`transition-all hover:shadow-md ${route.recommended ? 'border-[#328cc1] border-2 shadow-sm' : ''}`}>
          
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div
                className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl ${route.recommended ? 'bg-[#328cc1] text-white' : 'bg-[#f4f4f4] dark:bg-muted text-muted-foreground'}`}>
                
                    <Navigation className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">
                        {route.name}
                      </h3>
                      {route.recommended &&
                  <Badge className="bg-[#328cc1] text-white text-[10px] gap-1">
                          <Star className="h-3 w-3" />
                          Recommended
                        </Badge>
                  }
                      <Badge
                    variant="secondary"
                    className={`text-[10px] ${trafficLevelConfig[route.trafficLevel].badgeClass}`}>
                    
                        {trafficLevelConfig[route.trafficLevel].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/70 mt-1.5">
                      {route.description}
                    </p>
                    {route.savings &&
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {route.savings}
                      </p>
                }
                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-1.5">
                        <RouteIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-foreground">
                          {route.distance} mi
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-foreground">
                          {route.eta} min
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          ~{Math.round(route.distance / route.eta * 60)} km/h
                          avg
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                variant={route.recommended ? 'default' : 'outline'}
                size="sm"
                className={
                route.recommended ? 'bg-[#328cc1] hover:bg-[#2a7ab0]' : ''
                }>
                
                    <Navigation className="h-3.5 w-3.5 mr-1" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
        )}

          {/* AI Prediction Card */}
          <Card className="bg-gradient-to-r from-[#0b3c5d] to-[#328cc1] text-white">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 flex-shrink-0">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">
                    AI Congestion Prediction
                  </h3>
                  <p className="text-xs text-white/80 mt-1">
                    Based on historical patterns and current conditions, traffic
                    on your recommended route is expected to remain light for
                    the next 45 minutes. After 5:30 PM, expect moderate
                    congestion near Colombo Fort area.
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                      <span className="text-xs text-white/90">
                        Best departure: Now
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />
                      <span className="text-xs text-white/90">
                        Avoid after 5:30 PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    </div>);

}
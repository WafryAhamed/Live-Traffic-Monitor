import React, { useMemo, Fragment } from 'react';
import type {
  Vehicle,
  TrafficAlert,
  TrafficData,
  DashboardStats,
  TrafficPrediction,
  CongestionScore,
  CongestionGrade,
  EmergencyEvent,
  AIInsight } from
'../types/traffic';
import { generateHourlyDensity, getTimeAgo } from '../data/mockData';
import { StatCard } from '../components/dashboard/StatCard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent } from
'../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ScrollArea } from '../components/ScrollArea';
import { Separator } from '../components/Separator';
import { ChartContainer, ChartTooltipContent } from '../components/Chart';
import type { ChartConfig } from '../components/Chart';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid } from
'recharts';
import {
  Car,
  AlertTriangle,
  Gauge,
  Activity,
  Map,
  Navigation,
  Bell,
  ArrowRight,
  Brain,
  Zap,
  Construction,
  CloudRain,
  ShieldAlert,
  TrafficCone,
  TrendingUp,
  TrendingDown,
  Minus,
  Siren,
  Flame,
  Shield,
  Lightbulb,
  Target,
  Clock,
  MapPin,
  Timer,
  Sparkles,
  CheckCircle2 } from
'lucide-react';
import type { PageType } from '../types/traffic';
interface HomePageProps {
  stats: DashboardStats;
  alerts: TrafficAlert[];
  vehicles: Vehicle[];
  trafficData: TrafficData[];
  predictions: TrafficPrediction[];
  congestionScore: CongestionScore;
  emergencyEvents: EmergencyEvent[];
  aiInsights: AIInsight[];
  onNavigate: (page: PageType) => void;
}
const alertTypeIcons: Record<TrafficAlert['type'], React.ReactNode> = {
  accident: <ShieldAlert className="h-4 w-4" />,
  congestion: <Activity className="h-4 w-4" />,
  roadblock: <TrafficCone className="h-4 w-4" />,
  construction: <Construction className="h-4 w-4" />,
  weather: <CloudRain className="h-4 w-4" />
};
const severityColors: Record<TrafficAlert['severity'], string> = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  medium:
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};
const chartConfig: ChartConfig = {
  density: {
    label: 'Traffic Density',
    color: '#328cc1'
  },
  speed: {
    label: 'Avg Speed',
    color: '#10b981'
  }
};
const predictionMiniConfig: ChartConfig = {
  predictedDensity: {
    label: 'Predicted Density',
    color: '#8b5cf6'
  }
};
const gradeColors: Record<CongestionGrade, string> = {
  A: '#10b981',
  B: '#328cc1',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444'
};
const emergencyTypeIcons: Record<EmergencyEvent['type'], React.ReactNode> = {
  ambulance: <Siren className="h-3.5 w-3.5" />,
  fire: <Flame className="h-3.5 w-3.5" />,
  police: <Shield className="h-3.5 w-3.5" />
};
const emergencyTypeColors: Record<EmergencyEvent['type'], string> = {
  ambulance: '#ef4444',
  fire: '#f97316',
  police: '#328cc1'
};
const insightTypeIcons: Record<AIInsight['type'], React.ReactNode> = {
  prediction: <TrendingUp className="h-3.5 w-3.5" />,
  recommendation: <Lightbulb className="h-3.5 w-3.5" />,
  anomaly: <AlertTriangle className="h-3.5 w-3.5" />,
  optimization: <Zap className="h-3.5 w-3.5" />
};
const insightTypeBg: Record<AIInsight['type'], string> = {
  prediction: 'bg-[#d9e8f5] text-[#328cc1] dark:bg-[#328cc1]/20',
  recommendation:
  'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  anomaly:
  'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  optimization:
  'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'
};
function MiniCongestionGauge({
  score,
  grade



}: {score: number;grade: CongestionGrade;}) {
  const color = gradeColors[grade];
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 100 * circumference;
  const dashOffset = circumference - progress;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 90 90" className="-rotate-90">
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-border" />
        
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out'
          }} />
        
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{score}</span>
        <span
          className="text-sm font-bold"
          style={{
            color
          }}>
          
          {grade}
        </span>
      </div>
    </div>);

}
export function HomePage({
  stats,
  alerts,
  vehicles,
  trafficData,
  predictions,
  congestionScore,
  emergencyEvents,
  aiInsights,
  onNavigate
}: HomePageProps) {
  const hourlyData = useMemo(() => generateHourlyDensity(), []);
  const recentAlerts = useMemo(
    () =>
    [...alerts].
    filter((a) => !a.resolved).
    sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).
    slice(0, 6),
    [alerts]
  );
  const topInsights = useMemo(() => aiInsights.slice(0, 3), [aiInsights]);
  const now = new Date();
  const greeting =
  now.getHours() < 12 ?
  'Good Morning' :
  now.getHours() < 18 ?
  'Good Afternoon' :
  'Good Evening';
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const overallTrend = congestionScore.trend;
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {greeting}, Admin
        </h1>
        <p className="text-sm text-[#707070] dark:text-muted-foreground mt-1">
          {dateStr} — AI-powered traffic intelligence for Colombo, Sri Lanka
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Vehicles"
          value={stats.totalVehicles.toLocaleString()}
          icon={<Car className="h-5 w-5" />}
          trend={{
            value: 12,
            isPositive: true
          }}
          color="#328cc1" />
        
        <StatCard
          title="Active Alerts"
          value={stats.activeAlerts}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{
            value: 8,
            isPositive: false
          }}
          color="#f59e0b" />
        
        <StatCard
          title="Avg Speed"
          value={`${stats.avgSpeed} km/h`}
          icon={<Gauge className="h-5 w-5" />}
          trend={{
            value: 5,
            isPositive: true
          }}
          color="#10b981" />
        
        <StatCard
          title="Congestion Level"
          value={`${stats.congestionLevel}%`}
          icon={<Activity className="h-5 w-5" />}
          trend={{
            value: 3,
            isPositive: stats.congestionLevel < 60
          }}
          color={stats.congestionLevel > 60 ? '#ef4444' : '#10b981'} />
        
      </div>

      {/* AI Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Congestion Score */}
        <Card className="bg-gradient-to-br from-[#328cc1]/5 to-transparent border-[#328cc1]/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-5">
              <MiniCongestionGauge
                score={congestionScore.overall}
                grade={congestionScore.grade} />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-[#328cc1]" />
                  <h3 className="text-sm font-semibold text-foreground">
                    AI Congestion Score
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  City-wide congestion index powered by AI analysis
                </p>
                <div className="flex items-center gap-3">
                  {overallTrend === 'improving' ?
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] gap-0.5">
                    
                      <TrendingDown className="h-3 w-3" /> Improving
                    </Badge> :
                  overallTrend === 'worsening' ?
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] gap-0.5">
                    
                      <TrendingUp className="h-3 w-3" /> Worsening
                    </Badge> :

                  <Badge variant="secondary" className="text-[10px] gap-0.5">
                      <Minus className="h-3 w-3" /> Stable
                    </Badge>
                  }
                  <span className="text-[10px] text-muted-foreground">
                    Peak: {congestionScore.peakExpected}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#328cc1] hover:text-[#328cc1] hover:bg-[#d9e8f5] dark:hover:bg-[#328cc1]/20 self-start"
                onClick={() => onNavigate('ai-insights')}>
                
                Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Predictions Mini */}
        <Card className="bg-gradient-to-br from-purple-500/5 to-transparent border-purple-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-foreground">
                  AI Traffic Predictions
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#328cc1] hover:text-[#328cc1] hover:bg-[#d9e8f5] dark:hover:bg-[#328cc1]/20"
                onClick={() => onNavigate('ai-insights')}>
                
                View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
            <ChartContainer
              config={predictionMiniConfig}
              className="h-[80px] w-full">
              
              <LineChart
                data={predictions}
                margin={{
                  top: 5,
                  right: 5,
                  left: -20,
                  bottom: 0
                }}>
                
                <XAxis
                  dataKey="timeLabel"
                  tick={{
                    fontSize: 9
                  }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground" />
                
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Line
                  type="monotone"
                  dataKey="predictedDensity"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false} />
                
              </LineChart>
            </ChartContainer>
            <div className="flex items-center gap-3 mt-2">
              {predictions.slice(0, 3).map((p) =>
              <div key={p.timeLabel} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {p.timeLabel}
                  </span>
                  <span className="text-[10px] font-bold text-foreground">
                    {p.predictedDensity}%
                  </span>
                  {p.trend === 'worsening' ?
                <TrendingUp className="h-2.5 w-2.5 text-red-500" /> :
                p.trend === 'improving' ?
                <TrendingDown className="h-2.5 w-2.5 text-emerald-500" /> :

                <Minus className="h-2.5 w-2.5 text-muted-foreground" />
                }
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column: Recent Alerts + Traffic Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Alerts</CardTitle>
                <CardDescription>Latest traffic incidents</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#328cc1] hover:text-[#328cc1] hover:bg-[#d9e8f5] dark:hover:bg-[#328cc1]/20"
                onClick={() => onNavigate('alerts')}>
                
                View All
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[320px] pr-3">
              <div className="space-y-1">
                {recentAlerts.map((alert, idx) =>
                <Fragment key={alert.id}>
                    <div className="flex items-start gap-3 py-3 px-2 rounded-lg hover:bg-[#f4f4f4] dark:hover:bg-muted/50 transition-colors cursor-pointer">
                      <div
                      className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${alert.severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : alert.severity === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : alert.severity === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      
                        {alertTypeIcons[alert.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {alert.description}
                        </p>
                        <p className="text-xs text-[#707070] dark:text-muted-foreground mt-0.5 truncate">
                          {alert.location}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 h-5 ${severityColors[alert.severity]}`}>
                        
                          {alert.severity}
                        </Badge>
                        <span className="text-[10px] text-[#707070] dark:text-muted-foreground whitespace-nowrap">
                          {getTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                    {idx < recentAlerts.length - 1 &&
                  <Separator className="opacity-50" />
                  }
                  </Fragment>
                )}
                {recentAlerts.length === 0 &&
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No active alerts
                    </p>
                  </div>
                }
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Traffic Density Chart */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Today's Traffic Density in Colombo</CardTitle>
            <CardDescription>
              24-hour traffic density and average speed overview
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[320px] w-full">
              <AreaChart
                data={hourlyData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 0
                }}>
                
                <defs>
                  <linearGradient
                    id="densityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    
                    <stop offset="0%" stopColor="#328cc1" stopOpacity={0.3} />
                    <stop
                      offset="100%"
                      stopColor="#328cc1"
                      stopOpacity={0.02} />
                    
                  </linearGradient>
                  <linearGradient
                    id="speedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop
                      offset="100%"
                      stopColor="#10b981"
                      stopOpacity={0.02} />
                    
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border" />
                
                <XAxis
                  dataKey="hour"
                  tick={{
                    fontSize: 11
                  }}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                  className="fill-muted-foreground" />
                
                <YAxis
                  tick={{
                    fontSize: 11
                  }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground" />
                
                <Tooltip content={<ChartTooltipContent indicator="line" />} />
                <Area
                  type="monotone"
                  dataKey="density"
                  stroke="#328cc1"
                  strokeWidth={2}
                  fill="url(#densityGradient)" />
                
                <Area
                  type="monotone"
                  dataKey="speed"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#speedGradient)" />
                
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Emergency + AI Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Emergency Priority */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Siren className="h-4 w-4 text-red-500" />
                <CardTitle className="text-base">Emergency Priority</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#328cc1] hover:text-[#328cc1] hover:bg-[#d9e8f5] dark:hover:bg-[#328cc1]/20"
                onClick={() => onNavigate('ai-insights')}>
                
                View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {emergencyEvents.length === 0 ?
            <div className="flex items-center justify-center py-6 text-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500/50 mr-2" />
                <p className="text-sm text-muted-foreground">
                  No active emergencies
                </p>
              </div> :

            <div className="space-y-2">
                {emergencyEvents.slice(0, 3).map((event) => {
                const typeColor = emergencyTypeColors[event.type];
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[#f4f4f4] dark:bg-muted/50">
                    
                      <div
                      className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${typeColor}18`,
                        color: typeColor
                      }}>
                      
                        {emergencyTypeIcons[event.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {event.vehicleName}
                          </p>
                          {event.status === 'en-route' &&
                        <span className="relative flex h-1.5 w-1.5">
                              <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{
                              backgroundColor: typeColor
                            }} />
                          
                              <span
                            className="relative inline-flex rounded-full h-1.5 w-1.5"
                            style={{
                              backgroundColor: typeColor
                            }} />
                          
                            </span>
                        }
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {event.destination}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {event.clearedPath &&
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1 py-0 h-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        
                            Cleared
                          </Badge>
                      }
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {event.eta}m
                        </span>
                      </div>
                    </div>);

              })}
              </div>
            }
          </CardContent>
        </Card>

        {/* Latest AI Insights */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-[#328cc1]" />
                <CardTitle className="text-base">Latest AI Insights</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#328cc1] hover:text-[#328cc1] hover:bg-[#d9e8f5] dark:hover:bg-[#328cc1]/20"
                onClick={() => onNavigate('ai-insights')}>
                
                View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {topInsights.map((insight) =>
              <div
                key={insight.id}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f4f4f4] dark:bg-muted/50">
                
                  <div
                  className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${insightTypeBg[insight.type]}`}>
                  
                    {insightTypeIcons[insight.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {insight.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                      {insight.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge
                    variant="secondary"
                    className={`text-[9px] px-1 py-0 h-4 ${insight.impact === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : insight.impact === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                    
                      {insight.impact}
                    </Badge>
                    <span className="text-[9px] text-muted-foreground">
                      {insight.confidence}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="group cursor-pointer transition-all hover:shadow-md hover:border-[#328cc1]/30"
          onClick={() => onNavigate('map')}>
          
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#d9e8f5] dark:bg-[#328cc1]/20 group-hover:bg-[#328cc1] transition-colors">
                <Map className="h-5 w-5 text-[#328cc1] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">
                  View Live Map
                </h3>
                <p className="text-xs text-[#707070] dark:text-muted-foreground mt-1">
                  Real-time traffic visualization with vehicle tracking
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="group cursor-pointer transition-all hover:shadow-md hover:border-[#328cc1]/30"
          onClick={() => onNavigate('routes')}>
          
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors">
                <Navigation className="h-5 w-5 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Check Routes
                </h3>
                <p className="text-xs text-[#707070] dark:text-muted-foreground mt-1">
                  Find the best routes with traffic-aware ETA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="group cursor-pointer transition-all hover:shadow-md hover:border-[#328cc1]/30"
          onClick={() => onNavigate('alerts')}>
          
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-500/20 group-hover:bg-amber-500 transition-colors">
                <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Manage Alerts
                </h3>
                <p className="text-xs text-[#707070] dark:text-muted-foreground mt-1">
                  Review traffic alerts and emergency notifications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="group cursor-pointer transition-all hover:shadow-md hover:border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent"
          onClick={() => onNavigate('ai-insights')}>
          
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-500/20 group-hover:bg-purple-500 transition-colors">
                <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  AI Insights
                  <Badge className="bg-purple-500 text-white text-[8px] px-1 py-0 h-3.5">
                    NEW
                  </Badge>
                </h3>
                <p className="text-xs text-[#707070] dark:text-muted-foreground mt-1">
                  AI predictions, anomaly detection, and optimization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Traffic Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Area Traffic Summary</CardTitle>
              <CardDescription>
                Current traffic conditions across Colombo areas
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#328cc1] hover:text-[#328cc1] hover:bg-[#d9e8f5] dark:hover:bg-[#328cc1]/20"
              onClick={() => onNavigate('dashboard')}>
              
              Full Dashboard
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {trafficData.slice(0, 5).map((td) => {
              const densityColor =
              td.density > 70 ?
              'text-red-600 dark:text-red-400' :
              td.density > 45 ?
              'text-amber-600 dark:text-amber-400' :
              'text-emerald-600 dark:text-emerald-400';
              const densityBg =
              td.density > 70 ?
              'bg-red-500' :
              td.density > 45 ?
              'bg-amber-500' :
              'bg-emerald-500';
              return (
                <div
                  key={td.area}
                  className="p-3 rounded-lg bg-[#f4f4f4] dark:bg-muted/50 space-y-2">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {td.area}
                    </span>
                    <span className={`text-xs font-bold ${densityColor}`}>
                      {td.density}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${densityBg}`}
                      style={{
                        width: `${td.density}%`
                      }} />
                    
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#707070] dark:text-muted-foreground">
                    <span>{td.avgSpeed} km/h avg</span>
                    <span>{td.incidents} incidents</span>
                  </div>
                </div>);

            })}
          </div>
        </CardContent>
      </Card>
    </div>);

}
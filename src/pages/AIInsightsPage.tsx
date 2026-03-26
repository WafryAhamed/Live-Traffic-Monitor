import React, { useMemo } from 'react';
import type {
  TrafficPrediction,
  CongestionScore,
  CongestionGrade,
  EmergencyEvent,
  AIInsight,
  TrafficData,
  WeeklyReport } from
'../types/traffic';
import { generateWeeklyReport, getTimeAgo } from '../data/mockData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent } from
'../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ScrollArea } from '../components/ScrollArea';
import { Separator } from '../components/Separator';
import { Progress } from '../components/Progress';
import { ChartContainer, ChartTooltipContent } from '../components/Chart';
import type { ChartConfig } from '../components/Chart';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip } from
'recharts';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Zap,
  AlertTriangle,
  Siren,
  Flame,
  Shield,
  Activity,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Target,
  Eye,
  CheckCircle2,
  Minus,
  Timer } from
'lucide-react';
interface AIInsightsPageProps {
  predictions: TrafficPrediction[];
  congestionScore: CongestionScore;
  emergencyEvents: EmergencyEvent[];
  aiInsights: AIInsight[];
  trafficData: TrafficData[];
}
const gradeColors: Record<CongestionGrade, string> = {
  A: '#10b981',
  B: '#328cc1',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444'
};
const gradeLabels: Record<CongestionGrade, string> = {
  A: 'Excellent',
  B: 'Good',
  C: 'Moderate',
  D: 'Poor',
  F: 'Critical'
};
const emergencyTypeIcons: Record<EmergencyEvent['type'], React.ReactNode> = {
  ambulance: <Siren className="h-4 w-4" />,
  fire: <Flame className="h-4 w-4" />,
  police: <Shield className="h-4 w-4" />
};
const emergencyTypeColors: Record<EmergencyEvent['type'], string> = {
  ambulance: '#ef4444',
  fire: '#f97316',
  police: '#328cc1'
};
const insightTypeIcons: Record<AIInsight['type'], React.ReactNode> = {
  prediction: <TrendingUp className="h-4 w-4" />,
  recommendation: <Lightbulb className="h-4 w-4" />,
  anomaly: <AlertTriangle className="h-4 w-4" />,
  optimization: <Zap className="h-4 w-4" />
};
const insightTypeColors: Record<
  AIInsight['type'],
  {
    bg: string;
    text: string;
    badge: string;
  }> =
{
  prediction: {
    bg: 'bg-[#d9e8f5] dark:bg-[#328cc1]/20',
    text: 'text-[#328cc1]',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  },
  recommendation: {
    bg: 'bg-emerald-100 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  },
  anomaly: {
    bg: 'bg-amber-100 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    badge:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  },
  optimization: {
    bg: 'bg-purple-100 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    badge:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  }
};
const impactBadgeColors: Record<string, string> = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  medium:
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};
const predictionChartConfig: ChartConfig = {
  predictedDensity: {
    label: 'Predicted Density (%)',
    color: '#328cc1'
  },
  predictedSpeed: {
    label: 'Predicted Speed (km/h)',
    color: '#10b981'
  }
};
const weeklyChartConfig: ChartConfig = {
  congestionScore: {
    label: 'Congestion Score',
    color: '#328cc1'
  },
  incidents: {
    label: 'Incidents',
    color: '#f59e0b'
  }
};
function CongestionGauge({
  score,
  grade



}: {score: number;grade: CongestionGrade;}) {
  const color = gradeColors[grade];
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 100 * circumference;
  const dashOffset = circumference - progress;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width="160"
        height="160"
        viewBox="0 0 100 100"
        className="-rotate-90">
        
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-border" />
        
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out'
          }} />
        
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span
          className="text-lg font-bold"
          style={{
            color
          }}>
          
          {grade}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {gradeLabels[grade]}
        </span>
      </div>
    </div>);

}
function MiniGauge({
  score,
  grade



}: {score: number;grade: CongestionGrade;}) {
  const color = gradeColors[grade];
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 100 * circumference;
  const dashOffset = circumference - progress;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-border" />
        
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset} />
        
      </svg>
      <span
        className="absolute text-xs font-bold"
        style={{
          color
        }}>
        
        {grade}
      </span>
    </div>);

}
export function AIInsightsPage({
  predictions,
  congestionScore,
  emergencyEvents,
  aiInsights,
  trafficData
}: AIInsightsPageProps) {
  const weeklyData = useMemo(() => generateWeeklyReport(), []);
  const avgConfidence = useMemo(
    () =>
    Math.round(
      predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length
    ),
    [predictions]
  );
  const anomalyCount = aiInsights.filter((i) => i.type === 'anomaly').length;
  const bestDay = useMemo(() => {
    const sorted = [...weeklyData].sort(
      (a, b) => a.congestionScore - b.congestionScore
    );
    return sorted[0];
  }, [weeklyData]);
  const worstDay = useMemo(() => {
    const sorted = [...weeklyData].sort(
      (a, b) => b.congestionScore - a.congestionScore
    );
    return sorted[0];
  }, [weeklyData]);
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#328cc1] to-[#0b3c5d]">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            AI Traffic Intelligence
          </h1>
          <p className="text-sm text-[#707070] dark:text-muted-foreground mt-0.5">
            AI-powered predictions, anomaly detection, and smart optimization
            for Colombo traffic
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#328cc1]/5 to-transparent border-[#328cc1]/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  AI Confidence
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {avgConfidence}%
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Average model accuracy
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#d9e8f5] dark:bg-[#328cc1]/20">
                <Target className="h-5 w-5 text-[#328cc1]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Predictions Active
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {predictions.length}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Next 2-hour forecast
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20">
                <Sparkles className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Anomalies Detected
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {anomalyCount}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Requires attention
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/20">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Timeline + Congestion Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prediction Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#328cc1]" />
              <CardTitle className="text-base">
                Traffic Prediction — Next 2 Hours
              </CardTitle>
            </div>
            <CardDescription>
              AI-generated forecast based on historical patterns and real-time
              data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={predictionChartConfig}
              className="h-[220px] w-full mb-4">
              
              <LineChart
                data={predictions}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border" />
                
                <XAxis
                  dataKey="timeLabel"
                  tick={{
                    fontSize: 11
                  }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground" />
                
                <YAxis
                  tick={{
                    fontSize: 11
                  }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground" />
                
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Line
                  type="monotone"
                  dataKey="predictedDensity"
                  stroke="#328cc1"
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: '#328cc1'
                  }} />
                
                <Line
                  type="monotone"
                  dataKey="predictedSpeed"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: '#10b981'
                  }} />
                
              </LineChart>
            </ChartContainer>

            <div className="grid grid-cols-7 gap-2">
              {predictions.map((p) => {
                const trendIcon =
                p.trend === 'improving' ?
                <TrendingDown className="h-3 w-3 text-emerald-500" /> :
                p.trend === 'worsening' ?
                <TrendingUp className="h-3 w-3 text-red-500" /> :

                <Minus className="h-3 w-3 text-muted-foreground" />;

                return (
                  <div
                    key={p.timeLabel}
                    className="p-2 rounded-lg bg-[#f4f4f4] dark:bg-muted/50 text-center space-y-1">
                    
                    <p className="text-[10px] font-medium text-muted-foreground">
                      {p.timeLabel}
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {p.predictedDensity}%
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      {trendIcon}
                      <span className="text-[9px] text-muted-foreground">
                        {p.confidence}%
                      </span>
                    </div>
                  </div>);

              })}
            </div>
          </CardContent>
        </Card>

        {/* Congestion Score */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#328cc1]" />
              <CardTitle className="text-base">Congestion Score</CardTitle>
            </div>
            <CardDescription>
              Real-time city-wide congestion index
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-4">
              <CongestionGauge
                score={congestionScore.overall}
                grade={congestionScore.grade} />
              
              <div className="flex items-center gap-2 mt-3">
                {congestionScore.trend === 'improving' ?
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 gap-1">
                  
                    <TrendingDown className="h-3 w-3" /> Improving
                  </Badge> :
                congestionScore.trend === 'worsening' ?
                <Badge
                  variant="secondary"
                  className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 gap-1">
                  
                    <TrendingUp className="h-3 w-3" /> Worsening
                  </Badge> :

                <Badge variant="secondary" className="gap-1">
                    <Minus className="h-3 w-3" /> Stable
                  </Badge>
                }
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <Clock className="h-3 w-3 inline mr-1" />
                Peak expected: {congestionScore.peakExpected}
              </p>
            </div>

            <Separator className="mb-3" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Area Scores
            </p>
            <div className="space-y-2">
              {congestionScore.areas.map((area) =>
              <div key={area.area} className="flex items-center gap-2">
                  <MiniGauge score={area.score} grade={area.grade} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground truncate">
                        {area.area}
                      </span>
                      <span
                      className="text-xs font-bold"
                      style={{
                        color: gradeColors[area.grade]
                      }}>
                      
                        {area.score}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-border rounded-full overflow-hidden mt-1">
                      <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${area.score}%`,
                        backgroundColor: gradeColors[area.grade]
                      }} />
                    
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Feed + Emergency Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* AI Insights Feed */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-[#328cc1]" />
              <CardTitle className="text-base">AI Insights Feed</CardTitle>
            </div>
            <CardDescription>
              Real-time AI-generated intelligence and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[400px] pr-3">
              <div className="space-y-3">
                {aiInsights.map((insight) => {
                  const colors = insightTypeColors[insight.type];
                  return (
                    <div
                      key={insight.id}
                      className="p-3 rounded-lg border border-border hover:border-[#328cc1]/20 transition-colors">
                      
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg ${colors.bg} ${colors.text}`}>
                          
                          {insightTypeIcons[insight.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="text-sm font-semibold text-foreground">
                              {insight.title}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={`text-[9px] px-1.5 py-0 h-4 ${colors.badge}`}>
                              
                              {insight.type}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={`text-[9px] px-1.5 py-0 h-4 ${impactBadgeColors[insight.impact]}`}>
                              
                              {insight.impact} impact
                            </Badge>
                          </div>
                          <p className="text-xs text-foreground/70 leading-relaxed">
                            {insight.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Target className="h-3 w-3" />{' '}
                              {insight.confidence}% confidence
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />{' '}
                              {getTimeAgo(insight.timestamp)}
                            </span>
                          </div>
                          {insight.actionable && insight.action &&
                          <Button
                            size="sm"
                            className="mt-2 bg-[#328cc1] hover:bg-[#2a7ab0] text-white text-xs h-7">
                            
                              <Zap className="h-3 w-3 mr-1" />
                              {insight.action}
                            </Button>
                          }
                        </div>
                      </div>
                    </div>);

                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Emergency Priority Tracker */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Siren className="h-4 w-4 text-red-500" />
              <CardTitle className="text-base">Emergency Priority</CardTitle>
            </div>
            <CardDescription>
              Active emergency vehicle tracking with smart routing
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {emergencyEvents.length === 0 ?
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No active emergencies
                </p>
              </div> :

            <div className="space-y-3">
                {emergencyEvents.map((event) => {
                const typeColor = emergencyTypeColors[event.type];
                return (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border border-border">
                    
                      <div className="flex items-start gap-3">
                        <div
                        className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg"
                        style={{
                          backgroundColor: `${typeColor}18`,
                          color: typeColor
                        }}>
                        
                          {emergencyTypeIcons[event.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-foreground">
                              {event.vehicleName}
                            </h4>
                            {event.status === 'en-route' &&
                          <span className="relative flex h-2 w-2">
                                <span
                              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                              style={{
                                backgroundColor: typeColor
                              }} />
                            
                                <span
                              className="relative inline-flex rounded-full h-2 w-2"
                              style={{
                                backgroundColor: typeColor
                              }} />
                            
                              </span>
                          }
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{event.origin}</span>
                            <ArrowRight className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {event.destination}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge
                            variant="secondary"
                            className={`text-[9px] px-1.5 py-0 h-4 ${event.priority === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                            
                              {event.priority}
                            </Badge>
                            <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0 h-4 capitalize">
                            
                              {event.status}
                            </Badge>
                            {event.clearedPath &&
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0 h-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 gap-0.5">
                            
                                <CheckCircle2 className="h-2.5 w-2.5" /> Path
                                Cleared
                              </Badge>
                          }
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 ml-auto">
                              <Timer className="h-3 w-3" /> ETA {event.eta} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>);

              })}
              </div>
            }
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#328cc1]" />
            <CardTitle className="text-base">Weekly Traffic Trends</CardTitle>
          </div>
          <CardDescription>
            7-day congestion score and incident overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartContainer
                config={weeklyChartConfig}
                className="h-[220px] w-full">
                
                <BarChart
                  data={weeklyData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -10,
                    bottom: 0
                  }}>
                  
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border" />
                  
                  <XAxis
                    dataKey="day"
                    tick={{
                      fontSize: 11
                    }}
                    tickLine={false}
                    axisLine={false}
                    className="fill-muted-foreground" />
                  
                  <YAxis
                    tick={{
                      fontSize: 11
                    }}
                    tickLine={false}
                    axisLine={false}
                    className="fill-muted-foreground" />
                  
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="congestionScore"
                    fill="var(--color-congestionScore)"
                    radius={[4, 4, 0, 0]} />
                  
                  <Bar
                    dataKey="incidents"
                    fill="var(--color-incidents)"
                    radius={[4, 4, 0, 0]} />
                  
                </BarChart>
              </ChartContainer>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Best Day
                </p>
                <p className="text-lg font-bold text-foreground mt-1">
                  {bestDay.day}
                </p>
                <p className="text-xs text-muted-foreground">
                  Score: {bestDay.congestionScore} · {bestDay.incidents}{' '}
                  incidents
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <p className="text-[10px] font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">
                  Worst Day
                </p>
                <p className="text-lg font-bold text-foreground mt-1">
                  {worstDay.day}
                </p>
                <p className="text-xs text-muted-foreground">
                  Score: {worstDay.congestionScore} · {worstDay.incidents}{' '}
                  incidents
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#f4f4f4] dark:bg-muted/50">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Weekly Average
                </p>
                <p className="text-lg font-bold text-foreground mt-1">
                  {Math.round(
                    weeklyData.reduce((s, d) => s + d.congestionScore, 0) / 7
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(
                    weeklyData.reduce((s, d) => s + d.incidents, 0) / 7
                  )}{' '}
                  avg incidents/day
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

}
import React, { useMemo, useState } from 'react';
import type {
  Vehicle,
  TrafficAlert,
  TrafficData,
  DashboardStats,
  HourlyDensity,
  AreaComparison } from
'../types/traffic';
import { generateHourlyDensity, generateAreaComparison } from '../data/mockData';
import { StatCard } from '../components/dashboard/StatCard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent } from
'../components/Card';
import { Badge } from '../components/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem } from
'../components/Select';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent } from
'../components/Chart';
import type { ChartConfig } from '../components/Chart';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer } from
'recharts';
import {
  Car,
  AlertTriangle,
  Gauge,
  Activity,
  TrendingUp,
  Clock,
  MapPin,
  Truck,
  Bus,
  Siren,
  ShieldAlert,
  Construction,
  CloudRain,
  TrafficCone } from
'lucide-react';
interface DashboardPageProps {
  stats: DashboardStats;
  alerts: TrafficAlert[];
  vehicles: Vehicle[];
  trafficData: TrafficData[];
}
const densityChartConfig: ChartConfig = {
  density: {
    label: 'Traffic Density (%)',
    color: '#328cc1'
  },
  speed: {
    label: 'Avg Speed (km/h)',
    color: '#10b981'
  }
};
const areaChartConfig: ChartConfig = {
  density: {
    label: 'Density',
    color: '#328cc1'
  },
  incidents: {
    label: 'Incidents',
    color: '#f59e0b'
  },
  avgSpeed: {
    label: 'Avg Speed',
    color: '#10b981'
  }
};
const incidentChartConfig: ChartConfig = {
  accident: {
    label: 'Accidents',
    color: '#ef4444'
  },
  congestion: {
    label: 'Congestion',
    color: '#f59e0b'
  },
  roadblock: {
    label: 'Roadblocks',
    color: '#8b5cf6'
  },
  construction: {
    label: 'Construction',
    color: '#6366f1'
  },
  weather: {
    label: 'Weather',
    color: '#06b6d4'
  }
};
const vehicleChartConfig: ChartConfig = {
  car: {
    label: 'Cars',
    color: '#328cc1'
  },
  bus: {
    label: 'Buses',
    color: '#10b981'
  },
  truck: {
    label: 'Trucks',
    color: '#f59e0b'
  },
  emergency: {
    label: 'Emergency',
    color: '#ef4444'
  }
};
const PIE_COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#6366f1', '#06b6d4'];
const VEHICLE_PIE_COLORS = ['#328cc1', '#10b981', '#f59e0b', '#ef4444'];
export function DashboardPage({
  stats,
  alerts,
  vehicles,
  trafficData
}: DashboardPageProps) {
  const [timeRange, setTimeRange] = useState('today');
  const hourlyData = useMemo(() => generateHourlyDensity(), []);
  const areaData = useMemo(() => generateAreaComparison(), []);
  const incidentBreakdown = useMemo(() => {
    const activeAlerts = alerts.filter((a) => !a.resolved);
    const counts: Record<string, number> = {
      accident: 0,
      congestion: 0,
      roadblock: 0,
      construction: 0,
      weather: 0
    };
    activeAlerts.forEach((a) => {
      counts[a.type] = (counts[a.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }));
  }, [alerts]);
  const vehicleBreakdown = useMemo(() => {
    const counts: Record<string, number> = {
      car: 0,
      bus: 0,
      truck: 0,
      emergency: 0
    };
    vehicles.forEach((v) => {
      counts[v.type] = (counts[v.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }));
  }, [vehicles]);
  const peakHoursData = useMemo(() => {
    return hourlyData.
    filter((_, i) => i >= 6 && i <= 22).
    map((h) => ({
      ...h,
      label: h.hour
    }));
  }, [hourlyData]);
  const speedDistribution = useMemo(() => {
    const ranges = [
    {
      range: '0-15',
      min: 0,
      max: 15
    },
    {
      range: '16-25',
      min: 16,
      max: 25
    },
    {
      range: '26-35',
      min: 26,
      max: 35
    },
    {
      range: '36-45',
      min: 36,
      max: 45
    },
    {
      range: '46-55',
      min: 46,
      max: 55
    },
    {
      range: '56-65',
      min: 56,
      max: 65
    },
    {
      range: '65+',
      min: 66,
      max: 999
    }];

    return ranges.map((r) => ({
      range: r.range,
      count: vehicles.filter((v) => v.speed >= r.min && v.speed <= r.max).
      length
    }));
  }, [vehicles]);
  const speedChartConfig: ChartConfig = {
    count: {
      label: 'Vehicles',
      color: '#328cc1'
    }
  };
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-[#707070] dark:text-muted-foreground mt-1">
            Comprehensive traffic analytics and performance metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
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

      {/* Main Charts */}
      <Tabs defaultValue="density">
        <TabsList>
          <TabsTrigger value="density">
            <TrendingUp className="h-4 w-4 mr-1.5" />
            Traffic Density
          </TabsTrigger>
          <TabsTrigger value="peak">
            <Clock className="h-4 w-4 mr-1.5" />
            Peak Hours
          </TabsTrigger>
          <TabsTrigger value="areas">
            <MapPin className="h-4 w-4 mr-1.5" />
            Area Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="density">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Traffic Density & Speed Over Time
              </CardTitle>
              <CardDescription>
                24-hour traffic density and average speed trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={densityChartConfig}
                className="h-[350px] w-full">
                
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
                      id="dashDensityGrad"
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
                      id="dashSpeedGrad"
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
                  <Legend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="density"
                    stroke="#328cc1"
                    strokeWidth={2}
                    fill="url(#dashDensityGrad)" />
                  
                  <Area
                    type="monotone"
                    dataKey="speed"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#dashSpeedGrad)" />
                  
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="peak">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Peak Hours Analysis</CardTitle>
              <CardDescription>
                Traffic density distribution during active hours (6AM - 10PM)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={densityChartConfig}
                className="h-[350px] w-full">
                
                <BarChart
                  data={peakHoursData}
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
                    dataKey="label"
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
                  <Bar dataKey="density" fill="#328cc1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="speed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Area Comparison</CardTitle>
              <CardDescription>
                Traffic metrics across Colombo areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={areaChartConfig}
                className="h-[350px] w-full">
                
                <BarChart
                  data={areaData}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 30,
                    left: 60,
                    bottom: 0
                  }}>
                  
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border" />
                  
                  <XAxis
                    type="number"
                    tick={{
                      fontSize: 11
                    }}
                    tickLine={false}
                    axisLine={false}
                    className="fill-muted-foreground" />
                  
                  <YAxis
                    type="category"
                    dataKey="area"
                    tick={{
                      fontSize: 11
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                    className="fill-muted-foreground" />
                  
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="density"
                    fill="var(--color-density)"
                    radius={[0, 4, 4, 0]} />
                  
                  <Bar
                    dataKey="incidents"
                    fill="var(--color-incidents)"
                    radius={[0, 4, 4, 0]} />
                  
                  <Bar
                    dataKey="avgSpeed"
                    fill="var(--color-avgSpeed)"
                    radius={[0, 4, 4, 0]} />
                  
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Row: Incident Breakdown + Vehicle Distribution + Speed Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Type Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Incident Breakdown</CardTitle>
            <CardDescription>Active incidents by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={incidentChartConfig}
              className="h-[250px] w-full">
              
              <PieChart>
                <Pie
                  data={incidentBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name">
                  
                  {incidentBreakdown.map((_, index) =>
                  <Cell
                    key={`incident-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]} />

                  )}
                </Pie>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Legend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Vehicle Type Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Vehicle Distribution</CardTitle>
            <CardDescription>Tracked vehicles by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={vehicleChartConfig}
              className="h-[250px] w-full">
              
              <PieChart>
                <Pie
                  data={vehicleBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name">
                  
                  {vehicleBreakdown.map((_, index) =>
                  <Cell
                    key={`vehicle-${index}`}
                    fill={
                    VEHICLE_PIE_COLORS[index % VEHICLE_PIE_COLORS.length]
                    } />

                  )}
                </Pie>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Legend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Speed Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Speed Distribution</CardTitle>
            <CardDescription>Vehicle speed ranges (km/h)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={speedChartConfig}
              className="h-[250px] w-full">
              
              <BarChart
                data={speedDistribution}
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
                  dataKey="range"
                  tick={{
                    fontSize: 10
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
                <Bar dataKey="count" fill="#328cc1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Area Details Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Area Traffic Details</CardTitle>
          <CardDescription>
            Current conditions across all monitored areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {trafficData.map((td) => {
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
                    <span>{td.avgSpeed} mph avg</span>
                    <span>{td.incidents} incidents</span>
                  </div>
                  <div className="text-[10px] text-[#707070] dark:text-muted-foreground">
                    Peak: {td.peakHour}
                  </div>
                </div>);

            })}
          </div>
        </CardContent>
      </Card>
    </div>);

}
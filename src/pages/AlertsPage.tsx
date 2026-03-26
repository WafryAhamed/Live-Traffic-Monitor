import React, { useMemo, useState } from 'react';
import type {
  TrafficAlert,
  AlertType,
  AlertSeverity,
  PageType } from
'../types/traffic';
import { getTimeAgo } from '../data/mockData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent } from
'../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem } from
'../components/Select';
import { ScrollArea } from '../components/ScrollArea';
import { Separator } from '../components/Separator';
import {
  AlertTriangle,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  ShieldAlert,
  Construction,
  CloudRain,
  TrafficCone,
  Eye,
  ChevronDown } from
'lucide-react';
interface AlertsPageProps {
  alerts: TrafficAlert[];
  onNavigate: (page: PageType) => void;
}
const alertTypeIcons: Record<AlertType, React.ReactNode> = {
  accident: <ShieldAlert className="h-4 w-4" />,
  congestion: <Activity className="h-4 w-4" />,
  roadblock: <TrafficCone className="h-4 w-4" />,
  construction: <Construction className="h-4 w-4" />,
  weather: <CloudRain className="h-4 w-4" />
};
const alertTypeLabels: Record<AlertType, string> = {
  accident: 'Accident',
  congestion: 'Congestion',
  roadblock: 'Roadblock',
  construction: 'Construction',
  weather: 'Weather'
};
const severityBadgeClasses: Record<AlertSeverity, string> = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  medium:
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};
const severityIconBg: Record<AlertSeverity, string> = {
  low: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  medium:
  'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
};
const severityOrder: Record<AlertSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3
};
export function AlertsPage({ alerts, onNavigate }: AlertsPageProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [sortBy, setSortBy] = useState<string>('time');
  const filteredAlerts = useMemo(() => {
    let result = [...alerts];
    // Status filter
    if (statusFilter === 'active') {
      result = result.filter((a) => !a.resolved);
    } else if (statusFilter === 'resolved') {
      result = result.filter((a) => a.resolved);
    }
    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((a) => a.type === typeFilter);
    }
    // Severity filter
    if (severityFilter !== 'all') {
      result = result.filter((a) => a.severity === severityFilter);
    }
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
        a.location.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      );
    }
    // Sort
    if (sortBy === 'time') {
      result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else if (sortBy === 'severity') {
      result.sort(
        (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
      );
    }
    return result;
  }, [alerts, search, typeFilter, severityFilter, statusFilter, sortBy]);
  const activeCount = alerts.filter((a) => !a.resolved).length;
  const resolvedCount = alerts.filter((a) => a.resolved).length;
  const criticalCount = alerts.filter(
    (a) => !a.resolved && a.severity === 'critical'
  ).length;
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Traffic Alerts
        </h1>
        <p className="text-sm text-[#707070] dark:text-muted-foreground mt-1">
          Monitor and manage traffic incidents across the network
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[#328cc1]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Active Alerts
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {activeCount}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#d9e8f5] dark:bg-[#328cc1]/20">
                <AlertTriangle className="h-5 w-5 text-[#328cc1]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Critical
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {criticalCount}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/20">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Resolved
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {resolvedCount}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts by location, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9" />
              
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="congestion">Congestion</SelectItem>
                <SelectItem value="roadblock">Roadblock</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Newest First</SelectItem>
                <SelectItem value="severity">By Severity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 &&
        <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <AlertTriangle className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <h3 className="text-sm font-semibold text-foreground">
                  No alerts found
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your filters or search query
                </p>
              </div>
            </CardContent>
          </Card>
        }

        {filteredAlerts.map((alert) =>
        <Card
          key={alert.id}
          className={`transition-all hover:shadow-md ${alert.resolved ? 'opacity-60' : ''} ${alert.severity === 'critical' && !alert.resolved ? 'border-l-4 border-l-red-500' : alert.severity === 'high' && !alert.resolved ? 'border-l-4 border-l-orange-500' : ''}`}>
          
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div
                className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${severityIconBg[alert.severity]}`}>
                
                  {alertTypeIcons[alert.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">
                      {alertTypeLabels[alert.type]}
                    </h3>
                    <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 h-5 ${severityBadgeClasses[alert.severity]}`}>
                    
                      {alert.severity}
                    </Badge>
                    {alert.resolved &&
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    
                        Resolved
                      </Badge>
                  }
                  </div>
                  <p className="text-sm text-foreground/80 mt-1">
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(alert.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#328cc1] hover:text-[#328cc1] hover:bg-[#d9e8f5] dark:hover:bg-[#328cc1]/20"
                  onClick={() => onNavigate('map')}>
                  
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View on Map
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground text-center">
        Showing {filteredAlerts.length} of {alerts.length} alerts
      </p>
    </div>);

}
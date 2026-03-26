import React, { useMemo, useState } from 'react';
import type { Vehicle, VehicleType, VehicleStatus } from '../types/traffic';
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell } from
'../components/Table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription } from
'../components/Dialog';
import { Progress } from '../components/Progress';
import {
  Car,
  Bus,
  Truck,
  Siren,
  Search,
  Gauge,
  MapPin,
  Compass,
  Info,
  Activity,
  CheckCircle2,
  Clock,
  Wrench } from
'lucide-react';
interface VehiclesPageProps {
  vehicles: Vehicle[];
}
const vehicleTypeIcons: Record<VehicleType, React.ReactNode> = {
  car: <Car className="h-4 w-4" />,
  bus: <Bus className="h-4 w-4" />,
  truck: <Truck className="h-4 w-4" />,
  emergency: <Siren className="h-4 w-4" />
};
const vehicleTypeLabels: Record<VehicleType, string> = {
  car: 'Car',
  bus: 'Bus',
  truck: 'Truck',
  emergency: 'Emergency'
};
const vehicleTypeColors: Record<VehicleType, string> = {
  car: 'bg-[#d9e8f5] text-[#328cc1] dark:bg-[#328cc1]/20',
  bus: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  truck: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  emergency: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
};
const statusConfig: Record<
  VehicleStatus,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
  }> =
{
  active: {
    label: 'Active',
    color:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: <CheckCircle2 className="h-3 w-3" />
  },
  idle: {
    label: 'Idle',
    color:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: <Clock className="h-3 w-3" />
  },
  maintenance: {
    label: 'Maintenance',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: <Wrench className="h-3 w-3" />
  }
};
export function VehiclesPage({ vehicles }: VehiclesPageProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];
    if (typeFilter !== 'all') {
      result = result.filter((v) => v.type === typeFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter((v) => v.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
        v.name.toLowerCase().includes(q) ||
        v.plateNumber.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => {
      const statusOrder: Record<VehicleStatus, number> = {
        active: 0,
        idle: 1,
        maintenance: 2
      };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [vehicles, search, typeFilter, statusFilter]);
  const activeCount = vehicles.filter((v) => v.status === 'active').length;
  const idleCount = vehicles.filter((v) => v.status === 'idle').length;
  const maintenanceCount = vehicles.filter(
    (v) => v.status === 'maintenance'
  ).length;
  const avgSpeed = Math.round(
    vehicles.reduce((s, v) => s + v.speed, 0) / vehicles.length
  );
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Vehicle Tracking
        </h1>
        <p className="text-sm text-[#707070] dark:text-muted-foreground mt-1">
          Monitor and track all vehicles in real-time
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Total Vehicles
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {vehicles.length}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#d9e8f5] dark:bg-[#328cc1]/20">
                <Car className="h-5 w-5 text-[#328cc1]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Active
                </p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {activeCount}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20">
                <Activity className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Idle
                </p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {idleCount}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/20">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Avg Speed
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {avgSpeed}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    km/h
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/20">
                <Gauge className="h-5 w-5 text-purple-500" />
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
                placeholder="Search by name or plate number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9" />
              
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Vehicle</TableHead>
                <TableHead>Plate</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Speed</TableHead>
                <TableHead>Heading</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length === 0 &&
              <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <Car className="h-8 w-8 text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No vehicles found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              }
              {filteredVehicles.map((vehicle) =>
              <TableRow
                key={vehicle.id}
                className="cursor-pointer"
                onClick={() => setSelectedVehicle(vehicle)}>
                
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${vehicleTypeColors[vehicle.type]}`}>
                      
                        {vehicleTypeIcons[vehicle.type]}
                      </div>
                      <span className="font-medium text-sm">
                        {vehicle.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">
                      {vehicle.plateNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize">
                      {vehicleTypeLabels[vehicle.type]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                    variant="secondary"
                    className={`text-[10px] gap-1 ${statusConfig[vehicle.status].color}`}>
                    
                      {statusConfig[vehicle.status].icon}
                      {statusConfig[vehicle.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">
                        {vehicle.speed}
                      </span>
                      <span className="text-xs text-muted-foreground">km/h</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Compass
                      className="h-3.5 w-3.5 text-muted-foreground"
                      style={{
                        transform: `rotate(${vehicle.heading}deg)`
                      }} />
                    
                      <span className="text-xs text-muted-foreground">
                        {vehicle.heading}°
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground font-mono">
                      {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVehicle(vehicle);
                    }}
                    aria-label={`View details for ${vehicle.name}`}>
                    
                      <Info className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-xs text-muted-foreground text-center">
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </p>

      {/* Vehicle Detail Dialog */}
      <Dialog
        open={!!selectedVehicle}
        onOpenChange={(open) => !open && setSelectedVehicle(null)}>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedVehicle &&
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg ${vehicleTypeColors[selectedVehicle.type]}`}>
                
                  {vehicleTypeIcons[selectedVehicle.type]}
                </div>
              }
              {selectedVehicle?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedVehicle?.plateNumber} —{' '}
              {selectedVehicle && vehicleTypeLabels[selectedVehicle.type]}
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle &&
          <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-[#f4f4f4] dark:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge
                  variant="secondary"
                  className={`${statusConfig[selectedVehicle.status].color}`}>
                  
                    {statusConfig[selectedVehicle.status].icon}
                    <span className="ml-1">
                      {statusConfig[selectedVehicle.status].label}
                    </span>
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-[#f4f4f4] dark:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Speed</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-foreground">
                      {selectedVehicle.speed}
                    </span>
                    <span className="text-xs text-muted-foreground">mph</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#f4f4f4] dark:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Heading</p>
                  <div className="flex items-center gap-1.5">
                    <Compass
                    className="h-4 w-4 text-[#328cc1]"
                    style={{
                      transform: `rotate(${selectedVehicle.heading}deg)`
                    }} />
                  
                    <span className="text-sm font-medium">
                      {selectedVehicle.heading}°
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#f4f4f4] dark:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Location</p>
                  <span className="text-xs font-mono text-foreground">
                    {selectedVehicle.lat.toFixed(4)},{' '}
                    {selectedVehicle.lng.toFixed(4)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Speed Gauge
                </p>
                <Progress
                value={Math.min(100, selectedVehicle.speed / 80 * 100)}
                className="h-2" />
              
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    0 mph
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    80 mph
                  </span>
                </div>
              </div>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>);

}
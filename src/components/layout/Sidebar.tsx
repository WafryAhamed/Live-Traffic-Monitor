import React, { Fragment } from 'react';
import type { PageType } from '../../types/traffic';
import {
  LayoutDashboard,
  BarChart3,
  Map,
  AlertTriangle,
  Car,
  Navigation,
  Activity,
  ChevronLeft,
  ChevronRight,
  Brain } from
'lucide-react';
import { Button } from '../Button';
import { Tooltip, TooltipTrigger, TooltipContent } from '../Tooltip';
interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}
interface NavItem {
  page: PageType;
  label: string;
  icon: React.ReactNode;
}
const navItems: NavItem[] = [
{
  page: 'home',
  label: 'Home',
  icon: <LayoutDashboard className="h-5 w-5" />
},
{
  page: 'dashboard',
  label: 'Dashboard',
  icon: <BarChart3 className="h-5 w-5" />
},
{
  page: 'map',
  label: 'Live Map',
  icon: <Map className="h-5 w-5" />
},
{
  page: 'alerts',
  label: 'Alerts',
  icon: <AlertTriangle className="h-5 w-5" />
},
{
  page: 'vehicles',
  label: 'Vehicles',
  icon: <Car className="h-5 w-5" />
},
{
  page: 'routes',
  label: 'Routes',
  icon: <Navigation className="h-5 w-5" />
},
{
  page: 'ai-insights',
  label: 'AI Insights',
  icon: <Brain className="h-5 w-5" />
}];

export function Sidebar({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse
}: SidebarProps) {
  return (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ease-in-out ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}
      style={{
        backgroundColor: '#0b3c5d'
      }}>
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#328cc1] flex-shrink-0">
          <Activity className="h-5 w-5 text-white" />
        </div>
        {!collapsed &&
        <span className="text-lg font-bold text-white tracking-tight whitespace-nowrap">
            TrafficIQ
          </span>
        }
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          const buttonContent =
          <button
            onClick={() => onNavigate(item.page)}
            className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'} ${isActive ? 'bg-[#328cc1] text-white shadow-lg shadow-[#328cc1]/25' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}>
            
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed &&
            <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
            }
            </button>;

          if (collapsed) {
            return (
              <Tooltip key={item.page}>
                <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>);

          }
          return <Fragment key={item.page}>{buttonContent}</Fragment>;
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-white/10 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={`w-full text-white/70 hover:text-white hover:bg-white/10 ${collapsed ? 'justify-center' : 'justify-start'}`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          
          {collapsed ?
          <ChevronRight className="h-4 w-4" /> :

          <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          }
        </Button>
      </div>
    </aside>);

}
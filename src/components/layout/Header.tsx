import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Wifi, WifiOff, MapPin } from 'lucide-react';
import { Input } from '../Input';
import { Switch } from '../Switch';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../Avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator } from
'../DropdownMenu';
interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  isConnected: boolean;
  alertCount: number;
}
export function Header({
  isDark,
  onToggleDark,
  isConnected,
  alertCount
}: HeaderProps) {
  const [currentCity, setCurrentCity] = useState('Colombo');
  
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-card border-b border-border flex-shrink-0">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707070] dark:text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search locations, vehicles, alerts..."
          className="pl-10 bg-[#f4f4f4] dark:bg-muted border-transparent focus:border-[#328cc1] focus:bg-white dark:focus:bg-background" />
        
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3 ml-4">
        {/* Connection status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4f4f4] dark:bg-muted">
          {isConnected ?
          <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Live
              </span>
            </> :

          <>
              <WifiOff className="h-3.5 w-3.5 text-[#707070]" />
              <span className="text-xs font-medium text-[#707070]">
                Connecting...
              </span>
            </>
          }
        </div>

        {/* City Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs flex items-center gap-1.5 text-[#707070] dark:text-muted-foreground hover:bg-[#f4f4f4] dark:hover:bg-muted"
              aria-label="Change city">
              <MapPin className="h-3.5 w-3.5" />
              {currentCity}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={() => setCurrentCity('Colombo')} className={currentCity === 'Colombo' ? 'bg-[#d9e8f5] dark:bg-[#328cc1]/20' : ''}>
              Colombo (Current)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentCity('Kandy')} className={currentCity === 'Kandy' ? 'bg-[#d9e8f5] dark:bg-[#328cc1]/20' : ''}>
              Kandy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentCity('Galle')} className={currentCity === 'Galle' ? 'bg-[#d9e8f5] dark:bg-[#328cc1]/20' : ''}>
              Galle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`${alertCount} notifications`}>
          
          <Bell className="h-4.5 w-4.5 text-[#707070] dark:text-muted-foreground" />
          {alertCount > 0 &&
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          }
        </Button>

        {/* Dark mode toggle */}
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-[#707070] dark:text-muted-foreground" />
          <Switch
            checked={isDark}
            onCheckedChange={onToggleDark}
            size="sm"
            aria-label="Toggle dark mode" />
          
          <Moon className="h-4 w-4 text-[#707070] dark:text-muted-foreground" />
        </div>

        {/* User avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="User menu">
              
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                  alt="User" />
                
                <AvatarFallback className="bg-[#328cc1] text-white text-xs font-medium">
                  TC
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">Traffic Admin</p>
              <p className="text-xs text-muted-foreground">
                admin@trafficiq.com
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>);

}
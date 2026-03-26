import React, { useState } from 'react';
import type { PageType } from '../../types/traffic';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ScrollArea } from '../ScrollArea';
interface AppLayoutProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isDark: boolean;
  onToggleDark: () => void;
  isConnected: boolean;
  alertCount: number;
  children: React.ReactNode;
}
export function AppLayout({
  currentPage,
  onNavigate,
  isDark,
  onToggleDark,
  isConnected,
  alertCount,
  children
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4f4f4] dark:bg-background">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)} />
      

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          isDark={isDark}
          onToggleDark={onToggleDark}
          isConnected={isConnected}
          alertCount={alertCount} />
        

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>);

}
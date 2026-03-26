import React, { useState } from 'react';
import type { PageType } from './types/traffic';
import { useTrafficSimulation } from './hooks/useTrafficSimulation';
import { useDarkMode } from './hooks/useDarkMode';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { AlertsPage } from './pages/AlertsPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { RoutesPage } from './pages/RoutesPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { TrafficChatbot } from './components/chat/TrafficChatbot';
import { TooltipProvider } from './components/Tooltip';
export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const {
    vehicles,
    alerts,
    trafficData,
    stats,
    predictions,
    congestionScore,
    emergencyEvents,
    aiInsights,
    isConnected,
    uptimeSeconds
  } = useTrafficSimulation();
  const { isDark, toggle: toggleDark } = useDarkMode();
  const activeAlertCount = alerts.filter((a) => !a.resolved).length;
  function renderPage() {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            stats={stats}
            alerts={alerts}
            vehicles={vehicles}
            trafficData={trafficData}
            predictions={predictions}
            congestionScore={congestionScore}
            emergencyEvents={emergencyEvents}
            aiInsights={aiInsights}
            onNavigate={setCurrentPage} />);


      case 'dashboard':
        return (
          <DashboardPage
            stats={stats}
            alerts={alerts}
            vehicles={vehicles}
            trafficData={trafficData} />);


      case 'map':
        return (
          <MapPage
            vehicles={vehicles}
            alerts={alerts}
            trafficData={trafficData} />);


      case 'alerts':
        return <AlertsPage alerts={alerts} onNavigate={setCurrentPage} />;
      case 'vehicles':
        return <VehiclesPage vehicles={vehicles} />;
      case 'routes':
        return <RoutesPage />;
      case 'ai-insights':
        return (
          <AIInsightsPage
            predictions={predictions}
            congestionScore={congestionScore}
            emergencyEvents={emergencyEvents}
            aiInsights={aiInsights}
            trafficData={trafficData} />);


      default:
        return null;
    }
  }
  return (
    <TooltipProvider>
      <AppLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDark={isDark}
        onToggleDark={toggleDark}
        isConnected={isConnected}
        alertCount={activeAlertCount}>
        
        {renderPage()}
      </AppLayout>
      <TrafficChatbot
        stats={stats}
        vehicles={vehicles}
        alerts={alerts}
        trafficData={trafficData}
        predictions={predictions}
        congestionScore={congestionScore}
        emergencyEvents={emergencyEvents}
        aiInsights={aiInsights} />
      
    </TooltipProvider>);

}
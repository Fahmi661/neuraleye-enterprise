import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PDFReport from './components/PDFReport';
import { AppView, LogEntry } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  // Store logs at the App level so they persist between views
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const handleAddLog = useCallback((newLog: LogEntry) => {
    setLogs(prev => {
      // Keep the last 1000 entries for analytics history
      // This is larger than the dashboard list view to provide better analytics
      const updated = [newLog, ...prev];
      return updated.slice(0, 1000);
    });
  }, []);

  // Helper to render view with animation
  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING:
        return (
          <div className="view-transition">
            <LandingPage onLaunch={() => setCurrentView(AppView.DASHBOARD)} />
          </div>
        );
      case AppView.DASHBOARD:
        return (
          <div className="view-transition">
            <Dashboard 
              logs={logs}
              onAddLog={handleAddLog}
              // Strictly go to Analytics only when exiting/stopping the session
              onExit={() => setCurrentView(AppView.ANALYTICS)} 
            />
          </div>
        );
      case AppView.ANALYTICS:
        return (
          <div className="view-transition">
            <AnalyticsDashboard 
              logs={logs}
              // Back from analytics goes to LANDING to complete the session cycle
              onBack={() => setCurrentView(AppView.LANDING)}
              // Navigate to PDF Report
              onPdfReport={() => setCurrentView(AppView.PDF_REPORT)}
            />
          </div>
        );
      case AppView.PDF_REPORT:
        return (
          <div className="view-transition">
            <PDFReport 
              logs={logs} // Pass real-time logs here
              onBack={() => setCurrentView(AppView.ANALYTICS)} 
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0a0c14]">
      {renderView()}
    </div>
  );
};

export default App;
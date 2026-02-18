import React, { useState, useCallback } from 'react';
import ObjectDetector from './ObjectDetector';
import { LogEntry } from '../types';

interface DashboardProps {
  logs: LogEntry[];
  onAddLog: (log: LogEntry) => void;
  onExit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, onAddLog, onExit }) => {
  const [fps, setFps] = useState<number>(0);
  const [threshold, setThreshold] = useState<number>(0.65);
  const [detectPerson, setDetectPerson] = useState(true);
  const [detectVehicle, setDetectVehicle] = useState(true);
  const [lastLogTime, setLastLogTime] = useState<number>(0);
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  // Filter detected objects based on config
  const handleDetection = useCallback((fpsVal: number, detectedObjects: any[]) => {
    setFps(fpsVal);
    
    // Filter objects based on settings
    const filteredObjects = detectedObjects.filter(obj => {
        if (!detectPerson && obj.class === 'person') return false;
        if (!detectVehicle && (obj.class === 'car' || obj.class === 'truck' || obj.class === 'bus' || obj.class === 'bicycle' || obj.class === 'motorcycle')) return false;
        return true;
    });

    if (filteredObjects.length > 0) {
      const now = Date.now();
      const bestDetection = filteredObjects[0]; 

      // Throttle logs (max 1 log per 800ms)
      if (now - lastLogTime > 800) {
          const date = new Date();
          const timeString = date.toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

          const newLog: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            label: bestDetection.class,
            score: bestDetection.score,
            timestamp: timeString,
            camera: 'Cam-01'
          };

          onAddLog(newLog);
          setLastLogTime(now);
      }
    }
  }, [onAddLog, lastLogTime, detectPerson, detectVehicle]);

  // Reusable Config Component
  const DetectionConfig = () => (
    <div className="space-y-4">
        <div className="flex items-center justify-between group">
            <span className="text-sm text-slate-300 transition-colors">Person Detection</span>
            <div 
                onClick={() => setDetectPerson(!detectPerson)}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${detectPerson ? 'bg-primary' : 'bg-slate-700'}`}
            >
                <div className={`absolute top-[2px] left-[2px] h-5 w-5 bg-white rounded-full shadow-sm transition-transform ${detectPerson ? 'translate-x-full' : ''}`}></div>
            </div>
        </div>
        <div className="flex items-center justify-between group">
            <span className="text-sm text-slate-300 transition-colors">Vehicle Detection</span>
            <div 
                onClick={() => setDetectVehicle(!detectVehicle)}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${detectVehicle ? 'bg-primary' : 'bg-slate-700'}`}
            >
                <div className={`absolute top-[2px] left-[2px] h-5 w-5 bg-white rounded-full shadow-sm transition-transform ${detectVehicle ? 'translate-x-full' : ''}`}></div>
            </div>
        </div>
        <div className="pt-4 border-t border-white/5">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span className="uppercase tracking-wider font-bold">Sensitivity Threshold</span>
                <span className="text-accent font-mono">{threshold.toFixed(2)}</span>
            </div>
            <input 
            type="range" 
            min="0.1" 
            max="0.95" 
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary hover:bg-slate-600 transition-colors"
            />
        </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-background-dark overflow-hidden relative">
      
      {/* --- MOBILE HEADER (Visible only on Mobile) --- */}
      <header className="md:hidden h-16 bg-[#0a0c14] border-b border-white/10 flex items-center justify-between px-4 z-40 shrink-0">
         <div className="flex items-center gap-3">
             <div className="h-8 w-8 relative">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
                  <g>
                      <path className="ne-stroke ne-sclera" d="M15,50 Q50,20 85,50 Q50,80 15,50 Z" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8" />
                      <circle className="ne-stroke ne-iris-outer" cx="50" cy="50" r="14" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2, 4" opacity="0.6" />
                      <g>
                          <circle className="ne-stroke ne-iris-inner" cx="50" cy="50" r="8" fill="none" stroke="#00D4FF" strokeWidth="1" opacity="0.9" />
                          <circle cx="50" cy="50" r="3" fill="#00D4FF" />
                      </g>
                  </g>
                </svg>
             </div>
             <span className="text-lg font-bold text-white tracking-tight">Neural<span className="text-accent">Eye</span></span>
         </div>
         <button 
           onClick={() => setShowMobileSettings(true)}
           className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10"
         >
             <span className="material-symbols-outlined">tune</span>
         </button>
      </header>

      {/* --- MOBILE SETTINGS OVERLAY --- */}
      {showMobileSettings && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm p-6 flex flex-col md:hidden animate-[fadeIn_0.2s_ease-out]">
             <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-bold text-white">Detection Config</h2>
                 <button onClick={() => setShowMobileSettings(false)} className="p-2 bg-white/10 rounded-full text-white">
                    <span className="material-symbols-outlined">close</span>
                 </button>
             </div>
             <div className="flex-1">
                 <DetectionConfig />
             </div>
             <button 
                onClick={() => setShowMobileSettings(false)}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl mt-4"
             >
                 Apply Settings
             </button>
          </div>
      )}

      {/* --- DESKTOP LEFT SIDEBAR --- */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-sidebar-dark z-20 shadow-xl">
         <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0a0c14]">
            {/* Consistent Animated Logo */}
            <div className="flex items-center gap-3">
                 <div className="h-8 w-8 relative flex-none">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
                      <g className="ne-main-group">
                          <path className="ne-stroke ne-sclera" d="M15,50 Q50,20 85,50 Q50,80 15,50 Z" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8" />
                          <circle className="ne-stroke ne-iris-outer" cx="50" cy="50" r="14" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2, 4" opacity="0.6" />
                          <g className="ne-pupil-group">
                              <circle className="ne-stroke ne-iris-inner" cx="50" cy="50" r="8" fill="none" stroke="#00D4FF" strokeWidth="1" opacity="0.9" />
                              <circle className="ne-pupil" cx="50" cy="50" r="3" fill="#00D4FF" />
                          </g>
                      </g>
                      <path className="ne-stroke ne-arc-bg" d="M30,20 Q50,10 70,20" fill="none" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="2" />
                    </svg>
                 </div>
                 <div className="leading-none">
                    <span className="text-lg font-bold text-white tracking-tight block">Neural<span className="text-accent">Eye</span></span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Enterprise</span>
                 </div>
            </div>
         </div>
         
         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-white bg-primary/10 border border-primary/20 rounded-lg transition-all hover:bg-primary/20 cursor-default">
               <span className="material-symbols-outlined text-primary">dashboard</span>
               <span className="text-sm font-bold">Live Monitor</span>
            </button>
            
            <button 
                onClick={onExit} 
                className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-white hover:bg-red-600/20 border border-transparent hover:border-red-500/30 rounded-lg transition-all group"
            >
               <span className="material-symbols-outlined group-hover:scale-110 transition-transform">stop_circle</span>
               <span className="text-sm font-bold">Stop Session</span>
            </button>

            {/* Desktop Config Panel */}
            <div className="pt-6 mt-4 border-t border-white/5">
                <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Detection Config</p>
                <div className="px-3">
                   <DetectionConfig />
                </div>
            </div>
         </nav>

         <div className="p-4 border-t border-white/5 bg-[#0a0c14]">
            <div className="flex items-center gap-3">
               <div className="size-9 rounded-full bg-gradient-to-tr from-primary to-accent shadow-lg shadow-primary/20"></div>
               <div>
                  <p className="text-xs font-bold text-white">Admin User</p>
                  <p className="text-[10px] text-green-400 flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    System Online
                  </p>
               </div>
            </div>
         </div>
      </aside>

      {/* --- CENTER - MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-black h-full">
         {/* Top Info Bar */}
         <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-4 md:p-6 pointer-events-none">
             <div className="flex flex-col gap-1">
                 <div className="px-3 py-1.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] md:text-xs font-mono text-white w-fit">
                    CAM_01: MAIN_ENTRANCE
                 </div>
                 {/* Hide resolution on mobile to save space */}
                 <div className="hidden md:block px-3 py-1.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300 w-fit">
                    RES: 1920x1080 | 60Hz
                 </div>
             </div>
             
             {/* Overlay Controls */}
             <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
                 <div className="px-3 py-1.5 md:px-4 md:py-2 rounded bg-red-950/80 backdrop-blur-md border border-red-500/30 text-[10px] md:text-xs font-bold text-red-400 flex items-center gap-2 animate-pulse shadow-lg">
                    <span className="material-symbols-outlined text-[10px] md:text-sm">fiber_manual_record</span>
                    LIVE
                 </div>
                 <button 
                    onClick={onExit}
                    className="flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2 bg-black/60 hover:bg-red-900/80 backdrop-blur-md border border-white/20 hover:border-red-500 rounded text-[10px] md:text-xs font-bold text-white transition-all group shadow-xl hover:shadow-red-900/20 active:scale-95"
                 >
                    <span className="material-symbols-outlined text-sm text-red-500 group-hover:text-white transition-colors">stop_circle</span>
                    <span className="hidden md:inline">FINISH SESSION</span>
                    <span className="md:hidden">STOP</span>
                 </button>
             </div>
         </div>

         {/* Camera Viewport */}
         <div className="relative w-full flex-1 bg-black overflow-hidden group">
            <ObjectDetector 
                    modelType="coco-ssd"
                    threshold={threshold}
                    onFrame={handleDetection}
                    onModelLoaded={() => {}}
            />

            {/* Decorative Scan Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%]"></div>
            
            {/* Active Scan Animation */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-1 bg-accent/30 shadow-[0_0_20px_rgba(0,212,255,0.4)] animate-scan"></div>
            </div>
         </div>
      </main>

      {/* --- DESKTOP RIGHT SIDEBAR (Logs) --- */}
      <aside className="hidden md:flex w-80 flex-col border-l border-white/5 bg-card-dark z-20 shadow-xl">
            <div className="p-5 border-b border-white/5 bg-[#0a0c14]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">monitoring</span>
                    Performance Metrics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background-dark p-3 rounded-lg border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">FPS</p>
                        <p className="text-2xl font-bold text-white mt-1">{fps.toFixed(0)}</p>
                        <div className="w-full bg-white/5 h-1 rounded-full mt-2">
                            <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(fps * 1.6, 100)}%` }}></div>
                        </div>
                    </div>
                    <div className="bg-background-dark p-3 rounded-lg border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors"></div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Latency</p>
                        <p className="text-2xl font-bold text-accent mt-1">14<span className="text-xs ml-1 font-normal text-slate-400">ms</span></p>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col bg-[#0e111d]">
                <div className="p-3 bg-[#161b2e] border-y border-white/5 flex justify-between items-center shadow-md z-10">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Detection Stream</span>
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/20">Auto-scroll</span>
                </div>
                <div className="flex-1 overflow-y-auto desktop-scroll p-3 space-y-2">
                    {logs.map((log, idx) => (
                        <div key={`${log.id}-${idx}`} className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1f33] border border-white/5 hover:border-primary/50 transition-all hover:translate-x-1 group">
                            <div className={`size-8 rounded flex items-center justify-center bg-black/40 border border-white/5 ${log.label === 'person' ? 'text-primary' : 'text-orange-400'}`}>
                                <span className="material-symbols-outlined text-lg">
                                    {log.label === 'person' ? 'person' : 'sensors'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <p className="text-xs font-bold text-slate-200 capitalize group-hover:text-white transition-colors">{log.label}</p>
                                    <span className="text-xs font-mono font-bold text-accent">{(log.score * 100).toFixed(0)}%</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">schedule</span>
                                    {log.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
      </aside>

      {/* --- MOBILE BOTTOM SHEET (Logs) --- */}
      <div className="md:hidden h-[35vh] flex flex-col bg-[#0e111d] border-t border-white/10 shrink-0 z-30">
          <div className="px-4 py-3 bg-[#161b2e] border-b border-white/5 flex justify-between items-center shadow-md">
              <span className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                 Latest Detections
              </span>
              <span className="text-[10px] font-mono text-slate-400">{fps.toFixed(0)} FPS</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
             {logs.length === 0 ? (
                 <div className="h-full flex items-center justify-center text-slate-600">
                    <p className="text-xs">No activity detected</p>
                 </div>
             ) : (
                 logs.slice(0, 20).map((log, idx) => (
                    <div key={`${log.id}-${idx}`} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#1a1f33] border border-white/5">
                        <div className={`size-7 rounded flex items-center justify-center bg-black/40 border border-white/5 ${log.label === 'person' ? 'text-primary' : 'text-orange-400'}`}>
                            <span className="material-symbols-outlined text-sm">
                                {log.label === 'person' ? 'person' : 'sensors'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-bold text-slate-200 capitalize">{log.label}</p>
                                <span className="text-xs font-mono font-bold text-accent">{(log.score * 100).toFixed(0)}%</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono">{log.timestamp}</p>
                        </div>
                    </div>
                ))
             )}
          </div>
      </div>

    </div>
  );
};

export default Dashboard;
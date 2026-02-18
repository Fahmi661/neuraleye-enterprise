import React, { useMemo } from 'react';
import { 
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip
} from 'recharts';
import { LogEntry } from '../types';

interface AnalyticsDashboardProps {
  logs: LogEntry[];
  onBack: () => void;
  onPdfReport: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ logs, onBack, onPdfReport }) => {
  
  // Calculate stats
  const totalSessions = logs.length;
  const avgConfidence = logs.length > 0 
      ? (logs.reduce((acc, log) => acc + log.score, 0) / logs.length * 100) 
      : 0;

  // Breakdown Logic
  const breakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach(l => {
        counts[l.label] = (counts[l.label] || 0) + 1;
    });
    const total = logs.length || 1;
    return Object.keys(counts).map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        count: counts[key],
        percentage: Math.round((counts[key] / total) * 100)
    })).sort((a, b) => b.count - a.count).slice(0, 4);
  }, [logs]);

  // Chart Data Simulation (Trend)
  const chartData = useMemo(() => {
     return Array.from({length: 20}, (_, i) => ({
         time: `${i + 8}:00`,
         value: Math.floor(Math.random() * 40) + (i * 2) + (logs.length > 0 ? 15 : 0)
     }));
  }, [logs]);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-background-dark shadow-2xl overflow-x-hidden text-slate-200">
        
        {/* Top Nav Bar */}
        <header className="sticky top-0 z-50 flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-8 py-4 bg-[#0a0c14]/90 backdrop-blur-md border-b border-white/5 gap-4 md:gap-0">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={onBack}>
                <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                    <span className="material-symbols-outlined text-accent text-xl md:text-2xl leading-none">arrow_back</span>
                </div>
                <div>
                    <h1 className="text-lg md:text-xl font-bold tracking-tight text-white uppercase">Analytics Suite</h1>
                    <p className="text-[10px] md:text-xs text-slate-500 font-mono">NEURAL_EYE_V2.4_ENTERPRISE</p>
                </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-300">Live Data Sync</span>
                </div>
                <button 
                  onClick={onPdfReport}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 h-10 md:h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                >
                    <span className="material-symbols-outlined text-lg md:text-xl">picture_as_pdf</span>
                    <span className="text-sm">Generate Report</span>
                </button>
            </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 md:px-8 py-4 md:py-8 max-w-[1600px] mx-auto w-full">
            
            {/* Grid Layout: 1 column on mobile, 12 columns on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                
                {/* KPI Cards */}
                <div className="col-span-1 lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-2">
                    {[
                        { title: "Total Detections", value: totalSessions.toLocaleString(), icon: "grid_view", color: "text-white" },
                        { title: "Avg. Confidence", value: `${avgConfidence.toFixed(1)}%`, icon: "verified", color: "text-accent" },
                        { title: "Active Cameras", value: "04", icon: "videocam", color: "text-primary" },
                        { title: "System Uptime", value: "99.9%", icon: "dns", color: "text-green-400" }
                    ].map((kpi, idx) => (
                        <div key={idx} className="p-4 md:p-6 rounded-2xl bg-[#161b2e] border border-white/5 hover:border-white/10 transition-all group">
                            <div className="flex justify-between items-start mb-2 md:mb-4">
                                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest truncate">{kpi.title}</p>
                                <span className={`material-symbols-outlined ${kpi.color} text-lg md:text-2xl opacity-80 group-hover:scale-110 transition-transform`}>{kpi.icon}</span>
                            </div>
                            <h3 className={`text-2xl md:text-4xl font-black ${kpi.color} tracking-tight`}>{kpi.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Main Trend Chart */}
                <div className="col-span-1 lg:col-span-8 p-6 md:p-8 rounded-2xl bg-[#161b2e] border border-white/5 min-h-[300px] md:min-h-[400px] flex flex-col">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
                        <div>
                            <h3 className="font-bold text-white text-lg md:text-xl">Detection Traffic</h3>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">Real-time object identification frequency</p>
                        </div>
                        {/* Removed Time Filter Buttons (1H, 24H, 7D) */}
                    </div>
                    <div className="flex-1 w-full h-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#627bea" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#627bea" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#475569'}} />
                                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#475569'}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0A0F1E', borderColor: '#334155', color: '#fff', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#627bea" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorVal)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Object Distribution */}
                <div className="col-span-1 lg:col-span-4 p-6 md:p-8 rounded-2xl bg-[#161b2e] border border-white/5 flex flex-col">
                    <h3 className="font-bold text-white text-lg md:text-xl mb-2">Class Distribution</h3>
                    <p className="text-xs md:text-sm text-slate-500 mb-8">Categorized by object type</p>
                    
                    <div className="flex flex-col gap-6 justify-center flex-1">
                        {breakdown.length > 0 ? breakdown.map((item, i) => (
                             <div key={item.label} className="flex flex-col gap-2 group">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-300 font-bold group-hover:text-white transition-colors">{item.label}</span>
                                    <span className="text-white font-mono">{item.percentage}%</span>
                                </div>
                                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-accent' : i === 1 ? 'bg-primary' : 'bg-slate-600'}`} 
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 opacity-50">
                                <span className="material-symbols-outlined text-4xl mb-2">pie_chart</span>
                                <p className="text-sm">No data available yet.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <button className="w-full py-3 rounded-lg border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/40 transition-all text-sm font-bold flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Configure Classes
                        </button>
                    </div>
                </div>

            </div>
        </main>
    </div>
  );
};

export default AnalyticsDashboard;
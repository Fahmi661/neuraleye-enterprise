import React from 'react';
import { LogEntry } from '../types';

interface DetectionLogListProps {
  logs: LogEntry[];
}

const DetectionLogList: React.FC<DetectionLogListProps> = ({ logs }) => {
  return (
    <>
      <div className="p-6 border-b border-[#252b46] flex items-center justify-between bg-[#111421] z-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Detection Log</h3>
        <span className="text-[10px] bg-[#252b46] px-2 py-1 rounded text-slate-400 animate-pulse">REAL-TIME</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
        {logs.length === 0 ? (
           <div className="text-center py-10 opacity-50">
              <p className="text-xs text-slate-500">Waiting for detection...</p>
           </div>
        ) : (
            logs.map((log) => (
                <div key={log.id} className="p-3 bg-[#1a1e2e]/50 border border-[#252b46] rounded-lg flex items-center justify-between group hover:border-primary-light/30 transition-all hover:translate-x-1 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-white capitalize">{log.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-mono font-bold ${log.score > 0.8 ? 'text-success' : 'text-primary-light'}`}>
                        {(log.score * 100).toFixed(1)}%
                    </span>
                    <span className="text-[9px] text-slate-600 bg-slate-800/50 px-1 rounded">{log.camera}</span>
                </div>
                </div>
            ))
        )}
        
        {/* Skeleton items for filler if list is short */}
        {logs.length < 5 && (
            <div className="opacity-10 p-3 border border-[#252b46] border-dashed rounded-lg">
                <div className="h-3 w-1/3 bg-slate-700 rounded mb-2"></div>
                <div className="h-2 w-1/5 bg-slate-800 rounded"></div>
            </div>
        )}
      </div>
      <div className="p-4 bg-[#111421] border-t border-[#252b46]">
        <button className="w-full py-2 bg-[#252b46] hover:bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded transition-colors">
            Export Session Log
        </button>
      </div>
    </>
  );
};

export default DetectionLogList;
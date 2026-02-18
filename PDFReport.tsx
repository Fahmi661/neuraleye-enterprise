import React, { useMemo, useState } from 'react';
import { LogEntry } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PDFReportProps {
  logs: LogEntry[];
  onBack: () => void;
}

const PDFReport: React.FC<PDFReportProps> = ({ logs, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Calculate Statistics dynamically
  const stats = useMemo(() => {
    const totalObjects = logs.length;
    
    // Average Confidence
    const totalScore = logs.reduce((acc, log) => acc + log.score, 0);
    const avgConfidence = totalObjects > 0 ? (totalScore / totalObjects) * 100 : 0;

    // Class Distribution
    const distribution: Record<string, { count: number; maxScore: number }> = {};
    logs.forEach(log => {
        const label = log.label.charAt(0).toUpperCase() + log.label.slice(1);
        if (!distribution[label]) {
            distribution[label] = { count: 0, maxScore: 0 };
        }
        distribution[label].count += 1;
        distribution[label].maxScore = Math.max(distribution[label].maxScore, log.score);
    });

    // Sort by count for Top Entities
    const sortedClasses = Object.entries(distribution)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count);

    // Timeline Data
    const timelinePoints: number[] = new Array(10).fill(0);
    if (logs.length > 0) {
        const chronological = [...logs].reverse();
        const chunkSize = Math.ceil(chronological.length / 10);
        for (let i = 0; i < 10; i++) {
            const chunk = chronological.slice(i * chunkSize, (i + 1) * chunkSize);
            timelinePoints[i] = chunk.length;
        }
    }

    // SVG Path Generator
    const maxPoint = Math.max(...timelinePoints, 1);
    const pointsString = timelinePoints.map((val, idx) => {
        const x = (idx / 9) * 800; // Width 800
        const y = 120 - (val / maxPoint) * 100; // Height 120
        return `${idx === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
    
    const fillPathString = pointsString + ` L800,120 L0,120 Z`;
    
    return {
        totalObjects,
        avgConfidence,
        sortedClasses,
        timelinePath: pointsString,
        fillPath: fillPathString,
        topObject: sortedClasses.length > 0 ? sortedClasses[0].name : 'None'
    };
  }, [logs]);

  const currentDate = new Date();
  const reportId = `NE-${currentDate.getFullYear()}-${Math.floor(Math.random() * 10000)}`;

  const handlePrint = () => {
      window.print();
  };

  const handleDownload = async () => {
      try {
          setIsGenerating(true);
          const element = document.querySelector('.page-container') as HTMLElement;
          if (!element) {
              setIsGenerating(false);
              return;
          }

          // Scroll to top to ensure complete capture
          window.scrollTo(0, 0);

          // Force wait for images or fonts if needed
          await new Promise(resolve => setTimeout(resolve, 100));

          const canvas = await html2canvas(element, {
              scale: 2, 
              useCORS: true,
              logging: false,
              backgroundColor: '#0A0F1E',
              // CRITICAL FIX: Force window width to simulate desktop view even on mobile
              // This ensures the PDF looks like the A4 Desktop layout (3 columns), not the stacked Mobile layout
              windowWidth: 1280, 
              scrollY: 0,
              scrollX: 0,
          });

          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const imgProps = pdf.getImageProperties(imgData);
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
          pdf.save(`NeuralEye-Report-${reportId}.pdf`);
          setIsGenerating(false);

      } catch (error) {
          console.error("Error generating PDF:", error);
          setIsGenerating(false);
          alert("Failed to generate PDF.");
      }
  };

  return (
    <div className="bg-[#0A0F1E] text-slate-200 font-sans min-h-screen pb-12 selection:bg-accent/30">
      {/* Top Navigation Bar - Responsive */}
      <header className="no-print sticky top-0 z-50 w-full bg-[#0A0F1E]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/25">
            <span className="material-symbols-outlined text-lg md:text-xl">description</span>
          </div>
          <h1 className="text-sm md:text-lg font-bold tracking-tight text-white leading-tight">
            NeuralEye <span className="text-primary font-light block md:inline">Report Gen</span>
          </h1>
        </div>
        
        {/* Actions - Icon only on mobile to save space */}
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 px-2 py-1.5 md:px-3 rounded-lg hover:bg-white/5">
             <span className="material-symbols-outlined text-xl md:text-sm">arrow_back</span>
             <span className="hidden md:inline text-sm font-bold">Return</span>
          </button>
          <div className="h-6 w-px bg-white/10 mx-1"></div>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-[#161b2e] hover:bg-[#1f253a] border border-white/5 px-3 py-2 md:px-4 rounded-lg text-white transition-all">
            <span className="material-symbols-outlined text-xl md:text-[20px]">print</span>
            <span className="hidden md:inline text-sm font-bold">Print</span>
          </button>
          <button 
            onClick={handleDownload} 
            disabled={isGenerating}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-wait px-3 py-2 md:px-5 rounded-lg text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {isGenerating ? (
               <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
               <span className="material-symbols-outlined text-xl md:text-[20px]">download</span>
            )}
            <span className="hidden md:inline text-sm font-bold">{isGenerating ? 'Processing...' : 'Download PDF'}</span>
            {/* Mobile label */}
            <span className="md:hidden text-xs font-bold">PDF</span>
          </button>
        </div>
      </header>

      {/* Report Container - Responsive Wrapper */}
      {/* Visual: Responsive on screen (w-full, p-4). Capture: Forced desktop width via html2canvas config */}
      <div className="page-container relative flex flex-col w-full md:max-w-[210mm] mx-auto mt-4 md:mt-8 bg-[#0e111d] p-4 md:p-10 shadow-2xl border border-white/5 min-h-[auto] md:min-h-[297mm]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-primary/30 pb-6 md:pb-8 mb-6 md:mb-8 gap-6 md:gap-0">
          <div className="flex flex-col gap-4">
            {/* Consistent Logo Implementation */}
            <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 md:h-12 md:w-12 flex-none">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
                    <g>
                        <path className="ne-stroke ne-sclera" d="M15,50 Q50,20 85,50 Q50,80 15,50 Z" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8" />
                        <circle className="ne-stroke ne-iris-outer" cx="50" cy="50" r="14" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2, 4" opacity="0.6" />
                        <g>
                            <circle className="ne-stroke ne-iris-inner" cx="50" cy="50" r="8" fill="none" stroke="#00D4FF" strokeWidth="1" opacity="0.9" />
                            <circle cx="50" cy="50" r="3" fill="#00D4FF" />
                        </g>
                    </g>
                    <path d="M30,20 Q50,10 70,20" fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                    <div className="text-xl md:text-2xl tracking-tight flex items-center leading-none">
                        <span className="text-white font-light opacity-90">Neural</span>
                        <span className="text-accent font-bold">Eye</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">Enterprise Analytics</p>
                </div>
            </div>
            
            <p className="text-xs md:text-sm font-mono text-slate-400 flex flex-wrap items-center gap-2 md:gap-3 mt-1">
              <span className="uppercase tracking-widest text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded">Confidential</span>
              <span>ID: {reportId}</span>
            </p>
          </div>
          <div className="text-left md:text-right w-full md:w-auto">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Generated By</div>
            <p className="text-lg font-bold text-white">NeuralEye Enterprise</p>
            <p className="text-xs text-slate-500 font-mono">{currentDate.toLocaleString()}</p>
          </div>
        </div>

        {/* Executive Summary - Grid Stack on Mobile */}
        <div className="mb-8 md:mb-10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Executive Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="p-4 md:p-5 rounded-xl border border-white/10 bg-[#161b2e]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Objects</span>
                <span className="material-symbols-outlined text-primary text-xl">deployed_code</span>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white">{stats.totalObjects.toLocaleString()}</div>
            </div>
            <div className="p-4 md:p-5 rounded-xl border border-white/10 bg-[#161b2e]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Top Entity</span>
                <span className="material-symbols-outlined text-accent text-xl">star</span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-white leading-normal pb-1 truncate">{stats.topObject}</div>
            </div>
            <div className="p-4 md:p-5 rounded-xl border border-white/10 bg-[#161b2e]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Confidence</span>
                <span className="material-symbols-outlined text-green-400 text-xl">verified</span>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white">{stats.avgConfidence.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Timeline Graph */}
        <div className="mb-8 md:mb-10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              Detection Timeline
          </h3>
          <div className="w-full h-32 md:h-48 rounded-xl border border-white/10 p-4 md:p-6 relative bg-[#161b2e] overflow-hidden">
            {stats.totalObjects > 0 ? (
                <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradientDark" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#00D4FF', stopOpacity: 0.3 }}></stop>
                    <stop offset="100%" style={{ stopColor: '#00D4FF', stopOpacity: 0 }}></stop>
                    </linearGradient>
                </defs>
                <path d={stats.fillPath} fill="url(#gradientDark)"></path>
                <path d={stats.timelinePath} fill="none" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm font-mono uppercase">No data recorded</div>
            )}
            
            {/* Graph Labels */}
            <div className="flex justify-between mt-2 md:mt-4 border-t border-white/5 pt-2">
               <span className="text-[10px] font-mono text-slate-500">START</span>
               <span className="text-[10px] font-mono text-slate-500">END</span>
            </div>
          </div>
        </div>

        {/* Detailed Data - Stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Class Distribution</h3>
            <div className="flex flex-col gap-4 md:gap-5">
              {stats.sortedClasses.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>{item.name}</span>
                        <span className="text-white">{item.count}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div 
                           className={`h-full rounded-full ${idx === 0 ? 'bg-accent' : 'bg-primary'}`} 
                           style={{ width: `${(item.count / (stats.sortedClasses[0].count || 1)) * 100}%` }}
                        ></div>
                    </div>
                  </div>
              ))}
              {stats.sortedClasses.length === 0 && <p className="text-xs text-slate-600 font-mono">No classes detected.</p>}
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Top Entities</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[200px]">
                <thead>
                    <tr className="border-b border-white/10">
                    <th className="py-2 text-[10px] font-bold text-slate-500 uppercase">Entity</th>
                    <th className="py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Count</th>
                    <th className="py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Max Conf.</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {stats.sortedClasses.slice(0, 6).map((item, idx) => (
                        <tr key={idx}>
                            <td className="py-3 text-xs font-bold text-white">{item.name}</td>
                            <td className="py-3 text-xs text-slate-400 text-right font-mono">{item.count}</td>
                            <td className="py-3 text-xs font-bold text-green-400 text-right font-mono">{(item.maxScore * 100).toFixed(0)}%</td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-auto pt-8 md:pt-10">
          <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] text-slate-500 font-mono gap-2 md:gap-0">
            <div>© NEURAL_EYE_ENTERPRISE_SYSTEMS</div>
            <div className="flex items-center gap-2">
               <span className="size-2 bg-green-500 rounded-full"></span>
               SECURE_INFERENCE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReport;
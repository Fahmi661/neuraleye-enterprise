import React, { useState } from 'react';

interface LandingPageProps {
  onLaunch: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  const triggerBlink = () => {
    if (isBlinking) return;
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 350);
  };

  return (
    <div className="bg-[#0a0c14] min-h-screen text-slate-200 font-sans selection:bg-primary/30 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-nav border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={triggerBlink}
          >
            {/* Premium Logo Container */}
            <div className={`relative h-10 w-10 flex-none ${isBlinking ? 'ne-blink-active' : ''}`}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
                <g className="ne-main-group">
                    <path className="ne-stroke ne-sclera" d="M15,50 Q50,20 85,50 Q50,80 15,50 Z" />
                    <circle className="ne-stroke ne-iris-outer" cx="50" cy="50" r="14" fill="none" />
                    <g className="ne-pupil-group">
                        <circle className="ne-stroke ne-iris-inner" cx="50" cy="50" r="8" fill="none" />
                        <circle className="ne-pupil" cx="50" cy="50" r="3" />
                    </g>
                </g>
                <path className="ne-stroke ne-arc-bg" d="M30,20 Q50,10 70,20" fill="none" />
                <path className="ne-stroke ne-arc-active" d="M30,20 Q50,10 70,20" fill="none" />
              </svg>
            </div>

            <div className="text-xl tracking-tight flex items-center">
              <span className="text-white font-light opacity-90">Neural</span>
              <span className="text-accent font-bold">Eye</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-6 mr-4">
                <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Platform</a>
                <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Solutions</a>
                <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Enterprise</a>
             </div>
            <button 
              onClick={onLaunch}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-24 overflow-hidden flex-1 flex items-center">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(43,79,238,0.15)_0%,rgba(10,12,20,0)_70%)]"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* Text Content */}
          <div className="flex flex-col gap-8 relative z-10 animate-[fadeIn_0.8s_ease-out] text-center lg:text-left items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">v2.4 Enterprise Release</span>
            </div>
            <h1 className="text-white text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight drop-shadow-2xl">
              Precision AI Detection for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Enterprise</span>
            </h1>
            <p className="text-slate-400 text-lg lg:text-xl leading-relaxed max-w-xl">
              The Future of Perception is Here. Real-time intelligence that sees, understands, and reacts entirely within your infrastructure. Zero latency. Zero compromise.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
              <button 
                onClick={onLaunch}
                className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-primary/30 active:translate-y-0.5"
              >
                Get Started Free
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button className="px-8 py-4 rounded-lg font-bold text-white border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2">
                 <span className="material-symbols-outlined">description</span>
                 Documentation
              </button>
            </div>
          </div>
          
          {/* Visual Content */}
          <div className="relative flex justify-center lg:justify-end animate-[slideInRight_1s_ease-out]">
            <div className="w-full max-w-[500px] aspect-square relative rounded-3xl overflow-hidden bg-[#1e2235]/30 border border-white/5 shadow-2xl backdrop-blur-sm group cursor-pointer hover:shadow-primary/20 transition-all" onClick={onLaunch}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
              {/* Abstract decorative image */}
              <img 
                src="https://picsum.photos/800/800?grayscale&blur=2" 
                alt="Neural Network Visualization" 
                className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
              
              {/* Floating UI Elements */}
              <div className="absolute bottom-6 left-6 right-6 p-4 glass-nav border border-white/10 rounded-xl flex items-center justify-between shadow-2xl backdrop-blur-md">
                <div className="flex gap-3 items-center">
                  <div className="size-8 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                    <span className="material-symbols-outlined text-accent text-sm">visibility</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Status</p>
                    <p className="text-white text-sm font-bold">Scanning active...</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Inference</p>
                  <p className="text-accent text-sm font-bold">12.4ms</p>
                </div>
              </div>

               {/* Central Play Button */}
               <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                   <div className="size-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <span className="material-symbols-outlined text-4xl text-white ml-1 fill-1">play_arrow</span>
                   </div>
               </div>
            </div>
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 size-60 bg-primary/30 blur-[120px] rounded-full pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#0a0c14] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "bolt",
                color: "text-primary",
                bg: "bg-primary/20",
                title: "Real-time Detection",
                desc: "Execute complex object detection with sub-10ms latency. Optimized WebGL2 GPU backend."
              },
              {
                icon: "edgesensor_low",
                color: "text-accent",
                bg: "bg-accent/20",
                title: "Local Processing",
                desc: "Zero server-side image storage. All visual data stays within the client browser instance."
              },
              {
                icon: "shield_lock",
                color: "text-purple-400",
                bg: "bg-purple-500/20",
                title: "Secure Data",
                desc: "Enterprise-grade encryption and SOC2 Type II compliance standards for fintech."
              }
            ].map((feature, idx) => (
              <div key={idx} className="group bg-[#1e2235]/40 border border-white/5 p-8 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                <div className={`size-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  <span className={`material-symbols-outlined ${feature.color} text-2xl`}>{feature.icon}</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-6 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
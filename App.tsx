
import React, { useState, useEffect } from 'react';
import { Match, ScanResult } from './types';
import { UPCOMING_MATCHES } from './constants';
import { scanMatch } from './geminiService';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(UPCOMING_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<'matches' | 'history' | 'stats'>('matches');

  const handleScan = async (match: Match) => {
    setSelectedMatch(match);
    setScanning(true);
    setScanResult(null);

    try {
      const result = await scanMatch(match);
      setScanResult(result);
      
      // Mark match as ready in the list
      setMatches(prev => prev.map(m => 
        m.id === match.id ? { ...m, status: 'ready' } : m
      ));
    } catch (error) {
      console.error("Scanning failed", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  const postToTelegram = (matchId: string) => {
    setMatches(prev => prev.map(m => 
      m.id === matchId ? { ...m, status: 'posted' } : m
    ));
    alert("Post sent to Telegram Channel!");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 pulsar-gradient rounded-xl flex items-center justify-center text-white font-bold brand-font text-xl pulsar-glow">
            P
          </div>
          <h1 className="brand-font font-bold text-xl tracking-tighter">PULSAR <span className="text-blue-500">2026</span></h1>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <button 
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'matches' ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Live Scanner
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'history' ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            History
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'stats' ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Analytics
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium">Bot Connected</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-slate-950 p-6 lg:p-10 overflow-y-auto custom-scrollbar">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Scanner Dashboard</h2>
            <p className="text-slate-400">Manage 2025/2026 season auto-posting logic</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <img key={i} className="w-8 h-8 rounded-full border-2 border-slate-950" src={`https://picsum.photos/seed/${i}/40`} alt="User" />
               ))}
               <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">+12</div>
             </div>
             <div className="h-8 w-px bg-slate-800"></div>
             <p className="text-sm text-slate-400 font-medium">124 Pre-match Scans Today</p>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Matches List */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Target Leagues (Upcoming)</h3>
            {matches.map(match => (
              <div 
                key={match.id}
                className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${selectedMatch?.id === match.id ? 'bg-slate-900 border-blue-500/50' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
                onClick={() => setSelectedMatch(match)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold uppercase tracking-tighter">
                    {match.league}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(match.kickoff).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' })} MSK
                  </span>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center">
                    <img src={match.homeLogo} className="w-12 h-12 mx-auto rounded-full mb-2 bg-slate-800 p-1" alt={match.homeTeam} />
                    <p className="font-bold text-sm line-clamp-1">{match.homeTeam}</p>
                  </div>
                  <div className="text-slate-600 font-black text-xl italic">VS</div>
                  <div className="flex-1 text-center">
                    <img src={match.awayLogo} className="w-12 h-12 mx-auto rounded-full mb-2 bg-slate-800 p-1" alt={match.awayTeam} />
                    <p className="font-bold text-sm line-clamp-1">{match.awayTeam}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button 
                    disabled={scanning}
                    onClick={(e) => { e.stopPropagation(); handleScan(match); }}
                    className={`flex-grow py-2 rounded-xl text-xs font-bold transition-all ${match.status === 'ready' ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-blue-600 text-white hover:bg-blue-500 pulsar-glow'}`}
                  >
                    {scanning && selectedMatch?.id === match.id ? 'Scanning...' : match.status === 'ready' ? 'Rescan Match' : 'Full Scan & Predict'}
                  </button>
                  {match.status === 'ready' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); postToTelegram(match.id); }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500"
                    >
                      Post
                    </button>
                  )}
                </div>

                {match.status === 'posted' && (
                  <div className="absolute inset-0 bg-slate-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">Successfully Posted</span>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Analysis View */}
          <section>
            <div className="sticky top-10">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Scanner Output Preview</h3>
              
              {!selectedMatch ? (
                <div className="h-96 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600 p-10 text-center">
                  <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <p className="font-medium text-lg">Select a match to view PULSAR deep scan results</p>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Telegram Preview Mockup */}
                  <div className="bg-[#17212b] p-4 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">P</div>
                    <div>
                      <p className="text-white text-sm font-bold">PULSAR Scanner Channel</p>
                      <p className="text-[#6ab3f3] text-[10px]">124,500 subscribers</p>
                    </div>
                  </div>

                  <div className="p-4 custom-scrollbar max-h-[70vh] overflow-y-auto">
                    {scanning ? (
                      <div className="space-y-6 py-10 text-center">
                        <div className="relative inline-block">
                          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-black uppercase text-blue-400">SCAN</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xl font-bold animate-pulse">Analyzing xG Patterns...</p>
                          <p className="text-slate-500 text-sm mt-1">Fetching Flashscore & WhoScored Data</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                           {[1,2,3,4].map(i => (
                             <div key={i} className="h-1 bg-slate-800 overflow-hidden rounded-full">
                               <div className="h-full bg-blue-500 animate-[loading_2s_infinite]" style={{ animationDelay: `${i*0.5}s` }}></div>
                             </div>
                           ))}
                        </div>
                      </div>
                    ) : scanResult ? (
                      <div className="space-y-4">
                        {scanResult.imageUrl && (
                          <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800 group">
                            <img src={scanResult.imageUrl} className="w-full h-full object-cover" alt="Banner" />
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                              Generated by AI
                            </div>
                          </div>
                        )}
                        
                        <div className="bg-[#242f3d] p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap font-mono text-slate-200 border border-slate-800/50">
                          {scanResult.postText}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                             <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">1st Half xG Heatmap</p>
                             <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                                <div className="h-full bg-blue-500" style={{ width: `${scanResult.prediction.p1}%` }}></div>
                                <div className="h-full bg-indigo-900" style={{ width: `${100 - scanResult.prediction.p1}%` }}></div>
                             </div>
                             <div className="flex justify-between mt-1 text-[10px] font-bold">
                                <span>H: {scanResult.prediction.p1}%</span>
                                <span>A: {100 - scanResult.prediction.p1}%</span>
                             </div>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                             <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">2nd Half Fatigue Forecast</p>
                             <p className="text-xs font-medium text-red-400">Risk: {scanResult.confidence > 80 ? 'HIGH' : 'LOW'}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl">
                          <h4 className="text-blue-400 font-bold text-xs uppercase mb-2">Deep Logic Insights</h4>
                          <div className="space-y-2">
                             <div>
                               <p className="text-[10px] text-slate-500 uppercase font-bold">1st Half Analysis</p>
                               <p className="text-xs text-slate-300">{scanResult.firstHalf}</p>
                             </div>
                             <div>
                               <p className="text-[10px] text-slate-500 uppercase font-bold">2nd Half Analysis</p>
                               <p className="text-xs text-slate-300">{scanResult.secondHalf}</p>
                             </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => postToTelegram(selectedMatch.id)}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z" />
                          </svg>
                          Publish to Telegram Channel
                        </button>
                      </div>
                    ) : (
                      <div className="py-20 text-center opacity-50">
                        <p className="text-sm font-medium">Ready for Pulsar Scan Sequence</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default App;

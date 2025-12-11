import React, { useState, useEffect, useCallback } from 'react';
import { SCENARIO_DATA } from './constants';
import { Scenario, ChatMessage } from './types';
import { SensorPanel } from './components/SensorPanel';
import { TacticalMap } from './components/TacticalMap';
import { ChatInterface } from './components/ChatInterface';
import { Shield, Radio, CheckCircle, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { getGeminiResponse } from './services/geminiService';

const App: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIO_DATA[0]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Helper to format current time
  const getTime = () => new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " UTC";

  // Generate the "Thought Chain" message
  const generateSystemAnalysis = useCallback((scenario: Scenario) => {
    const s = scenario.sensors;
    
    // Constructing the structured analysis string based on data
    let analysis = `🔍 ANALYZING SENSOR DATA...\n\n`;
    
    analysis += `Step 1: RF Analysis\n`;
    analysis += `✓ ${s.rf.details}\n`;
    analysis += s.rf.status !== 'OK' ? `⚠️ Status: ${s.rf.status} (${(s.rf.confidence * 100).toFixed(1)}% Conf.)\n\n` : `✓ Status: CLEARED\n\n`;

    analysis += `Step 2: Visual Analysis\n`;
    analysis += `✓ ${s.visual.value} Identified\n`;
    analysis += `ℹ️ ${s.visual.details}\n\n`;

    analysis += `Step 3: Contradiction Detection\n`;
    if (scenario.reasoning.includes("CONTRADICTION") || scenario.reasoning.includes("MISMATCH") || s.rf.status !== s.visual.status) {
        analysis += `⚠️ MISMATCH DETECTED: Sensor fusion anomaly.\n`;
    } else {
        analysis += `✓ Sensors Align. No anomalies.\n`;
    }
    analysis += `\nStep 4: Threat Assessment\n`;
    if (scenario.type === 'HIGH_THREAT') analysis += `🚨 HIGH THREAT CONFIRMED\n`;
    else if (scenario.type === 'MEDIUM_THREAT') analysis += `⚠️ POTENTIAL THREAT (Low Confidence)\n`;
    else analysis += `✓ AUTHORIZED FLIGHT\n`;

    analysis += `\nRECOMMENDED ACTION: ${scenario.reasoning.split('RECOMMENDED ACTION:')[1] || scenario.reasoning.split('ACTION:')[1] || 'MONITOR'}`;

    return {
      id: Date.now().toString(),
      sender: 'system',
      text: analysis,
      timestamp: getTime(),
    } as ChatMessage;
  }, []);

  // Effect to handle scenario change
  useEffect(() => {
    // Reset chat or mark new section
    const newSystemMsg = generateSystemAnalysis(currentScenario);
    
    setChatMessages(prev => {
      // Keep last few messages or clear? Let's clear to focus on current threat context
      // But adding a divider is better UX usually. For this dashboard, clear feels cleaner for "Switching Context"
      return [
        {
          id: 'init-' + Date.now(),
          sender: 'system',
          text: `🔄 CONTEXT SWITCHED TO: ${currentScenario.name}\nLOC: ${currentScenario.location}`,
          timestamp: getTime()
        },
        newSystemMsg
      ];
    });

  }, [currentScenario, generateSystemAnalysis]);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: getTime()
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const responseText = await getGeminiResponse(text, currentScenario, chatMessages);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: getTime()
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearChat = () => {
    const newSystemMsg = generateSystemAnalysis(currentScenario);
    setChatMessages([
      {
        id: 'reset-' + Date.now(),
        sender: 'system',
        text: `🔄 TERMINAL RESET. MEMORY FLUSHED.\nREADY FOR NEW QUERY...`,
        timestamp: getTime()
      },
      newSystemMsg
    ]);
  };

  // Status Banner Logic
  const statusColor = currentScenario.type === 'HIGH_THREAT' ? 'bg-neon-red' : currentScenario.type === 'MEDIUM_THREAT' ? 'bg-neon-amber' : 'bg-neon-green';
  const statusText = currentScenario.type.replace('_', ' ');

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-200 font-sans selection:bg-neon-blue selection:text-slate-950">
      
      {/* 1. TOP STATUS BANNER */}
      <header className="h-16 flex-none border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 z-20 relative shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-slate-800 rounded border border-slate-700">
            <Shield className="w-6 h-6 text-neon-blue" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-lg tracking-wider text-slate-100">SKYSHIELD <span className="text-neon-blue">SOC</span></h1>
            <div className="text-[10px] text-slate-500 font-mono tracking-[0.2em]">AUTONOMOUS DEFENSE SYSTEM</div>
          </div>
        </div>

        {/* Dynamic Alert Banner */}
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-3 px-6 py-2 rounded-sm ${statusColor} text-slate-950 font-bold font-mono animate-pulse shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
            {currentScenario.type === 'HIGH_THREAT' ? <AlertOctagon className="w-5 h-5"/> : <CheckCircle className="w-5 h-5"/>}
            <span>STATUS: {statusText}</span>
          </div>
          <div className="text-right hidden md:block">
             <div className="text-xs text-slate-400 font-mono">LOCATION</div>
             <div className="font-bold text-slate-200">{currentScenario.location}</div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* COLUMN 1: SENSORS (25%) */}
        <aside className="w-1/4 min-w-[300px] flex-none z-10">
          <SensorPanel sensors={currentScenario.sensors} />
        </aside>

        {/* COLUMN 2: CENTER MAP & RF (50%) */}
        <section className="flex-1 flex flex-col border-r border-slate-800 bg-slate-950 relative">
          
          {/* Scenario Controls */}
          <div className="h-14 border-b border-slate-800 flex items-center px-4 gap-2 bg-slate-900/50 backdrop-blur">
            {SCENARIO_DATA.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentScenario(s)}
                className={`flex-1 py-2 px-2 text-xs font-mono font-bold border transition-all duration-300 clip-path-slant
                  ${currentScenario.id === s.id 
                    ? 'bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                  }`}
              >
                SCENARIO {idx + 1}
              </button>
            ))}
          </div>

          {/* Tactical Map Area */}
          <div className="flex-1 p-4 relative">
             <TacticalMap scenario={currentScenario} />
          </div>

          {/* Bottom: RF Spectrum Analysis */}
          <div className="h-[35%] border-t border-slate-800 bg-slate-900 p-4 flex flex-col relative overflow-hidden">
             <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-mono text-slate-400 flex items-center gap-2">
                   <Radio className="w-4 h-4 text-neon-blue" />
                   RF SPECTRUM ANALYSIS (CNN FEED)
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 border border-slate-700 px-2 py-0.5 rounded">
                   <Info className="w-3 h-3" />
                   <span>Compound AI: CNN Perception</span>
                </div>
             </div>
             
             <div className="flex-1 relative rounded border border-slate-700 bg-black overflow-hidden group">
                <img 
                  src={currentScenario.spectrogram_url} 
                  alt="RF Spectrogram" 
                  className="w-full h-full object-fill opacity-80 group-hover:opacity-100 transition-opacity"
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/10 to-transparent animate-scan pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-neon-blue/50 animate-scan pointer-events-none"></div>

                {/* CNN Overlay Badge */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-neon-blue/50 px-3 py-1 backdrop-blur-md">
                   <div className="text-neon-blue text-xs font-mono font-bold">
                      CNN MATCH: {currentScenario.sensors.rf.value}
                   </div>
                   <div className="text-slate-400 text-[10px] font-mono">
                      CONFIDENCE: {(currentScenario.sensors.rf.confidence * 100).toFixed(1)}%
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* COLUMN 3: AGENTIC REASONING (25%) */}
        <aside className="w-1/4 min-w-[350px] flex-none z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.3)]">
          <ChatInterface 
            scenario={currentScenario}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
            onClearChat={handleClearChat}
          />
        </aside>

      </main>
    </div>
  );
};

export default App;
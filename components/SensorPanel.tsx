import React from 'react';
import { Sensors, SensorDetail } from '../types';
import { Radio, Eye, Volume2, MapPin, AlertTriangle, XCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface SensorPanelProps {
  sensors: Sensors;
}

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'CRITICAL': return <XCircle className="w-5 h-5 text-neon-red animate-pulse" />;
    case 'WARNING': return <AlertTriangle className="w-5 h-5 text-neon-amber" />;
    case 'OK': return <CheckCircle className="w-5 h-5 text-neon-green" />;
    default: return <HelpCircle className="w-5 h-5 text-slate-500" />;
  }
};

const ConfidenceBar: React.FC<{ value: number; status: string }> = ({ value, status }) => {
  let colorClass = 'bg-slate-500';
  if (value >= 0.9) colorClass = 'bg-neon-green shadow-[0_0_10px_#0aff0a]';
  else if (value >= 0.7) colorClass = 'bg-neon-amber shadow-[0_0_10px_#ffb300]';
  else if (value < 0.5 && status !== 'OK') colorClass = 'bg-neon-red shadow-[0_0_10px_#ff003c]';
  
  return (
    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
      <div 
        className={`h-full ${colorClass} transition-all duration-1000 ease-out`} 
        style={{ width: `${value * 100}%` }}
      />
    </div>
  );
};

const SensorItem: React.FC<{ 
  label: string; 
  icon: React.ReactNode; 
  data: SensorDetail 
}> = ({ label, icon, data }) => {
  return (
    <div className="bg-slate-900 border border-slate-700/50 p-4 rounded-lg mb-3 hover:border-slate-600 transition-colors group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200">
          {icon}
          <span className="font-mono text-sm uppercase tracking-wider">{label}</span>
        </div>
        <StatusIcon status={data.status} />
      </div>
      
      <div className="flex justify-between items-end">
        <div className="text-lg font-bold text-slate-100">{data.value}</div>
        <div className="font-mono text-xs text-slate-500">{(data.confidence * 100).toFixed(1)}% CONF</div>
      </div>
      
      <ConfidenceBar value={data.confidence} status={data.status} />
      
      <div className="mt-3 text-xs font-mono text-slate-400 border-l-2 border-slate-700 pl-2">
        {data.details}
      </div>
    </div>
  );
};

export const SensorPanel: React.FC<SensorPanelProps> = ({ sensors }) => {
  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto border-r border-slate-800 bg-slate-950/50">
      <h2 className="text-slate-500 font-mono text-xs uppercase mb-4 tracking-[0.2em] flex items-center">
        <span className="w-2 h-2 bg-slate-500 rounded-full mr-2 animate-pulse"></span>
        Multimodal Sensor Telemetry
      </h2>
      
      <SensorItem label="RF Spectrum" icon={<Radio className="w-4 h-4"/>} data={sensors.rf} />
      <SensorItem label="Optical/Visual" icon={<Eye className="w-4 h-4"/>} data={sensors.visual} />
      <SensorItem label="Acoustic/Audio" icon={<Volume2 className="w-4 h-4"/>} data={sensors.audio} />
      <SensorItem label="Context/Flight" icon={<MapPin className="w-4 h-4"/>} data={sensors.context} />
      
      <div className="mt-auto pt-4 border-t border-slate-800">
        <div className="text-[10px] font-mono text-slate-600">
          SYSTEM INTEGRITY: 100%<br/>
          LATENCY: 12ms<br/>
          ENCRYPTION: QUANTUM-SAFE
        </div>
      </div>
    </div>
  );
};

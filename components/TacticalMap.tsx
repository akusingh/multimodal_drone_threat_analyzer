import React from 'react';
import { Scenario } from '../types';
import { Target, Crosshair, Radar } from 'lucide-react';

interface TacticalMapProps {
  scenario: Scenario;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({ scenario }) => {
  const isHighThreat = scenario.type === 'HIGH_THREAT';
  const pulseColor = isHighThreat ? 'text-neon-red' : scenario.type === 'MEDIUM_THREAT' ? 'text-neon-amber' : 'text-neon-green';
  const borderColor = isHighThreat ? 'border-neon-red' : scenario.type === 'MEDIUM_THREAT' ? 'border-neon-amber' : 'border-neon-green';

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg border border-slate-700 overflow-hidden group">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      
      {/* Map Content Placeholder - styled to look like a tactical vector map */}
      <div className="absolute inset-4 border border-slate-800 rounded opacity-50 flex items-center justify-center">
         {/* Concentric Circles */}
         <div className={`absolute w-[60%] h-[60%] border border-slate-700 rounded-full animate-ping opacity-10 duration-[3s]`}></div>
         <div className="absolute w-[40%] h-[40%] border border-slate-700 rounded-full"></div>
         <div className="absolute w-[20%] h-[20%] border border-slate-700 rounded-full"></div>
         
         {/* Crosshairs */}
         <div className="absolute w-full h-[1px] bg-slate-800"></div>
         <div className="absolute h-full w-[1px] bg-slate-800"></div>
      </div>

      {/* Dynamic Threat Marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
           <Target className={`w-12 h-12 ${pulseColor} animate-pulse`} />
           <div className={`absolute -top-1 -right-1 w-2 h-2 ${isHighThreat ? 'bg-neon-red' : 'bg-neon-green'} rounded-full animate-ping`}></div>
           {/* Label floating next to target */}
           <div className="absolute left-14 top-0 bg-slate-900/90 border border-slate-600 p-2 text-xs font-mono whitespace-nowrap backdrop-blur-sm">
             <div className={pulseColor}>{scenario.name}</div>
             <div className="text-slate-400">{scenario.sensors.visual.value}</div>
             <div className="text-slate-500">{scenario.sensors.rf.value}</div>
           </div>
        </div>
      </div>

      {/* Overlay UI Elements */}
      <div className="absolute top-4 left-4 font-mono text-xs text-slate-400">
        <div>LAT: {scenario.coordinates.lat.toFixed(4)}</div>
        <div>LNG: {scenario.coordinates.lng.toFixed(4)}</div>
        <div className="mt-2 text-slate-500">ZOOM: 14x [LOCKED]</div>
      </div>

      <div className="absolute top-4 right-4 font-mono text-xs text-right">
         <div className="flex items-center justify-end gap-2 text-slate-400">
            <Radar className="w-4 h-4 animate-spin-slow" />
            <span>RADAR: ACTIVE</span>
         </div>
         <div className="flex items-center justify-end gap-2 text-slate-400 mt-1">
            <Crosshair className="w-4 h-4" />
            <span>TRACKING: {scenario.id.toUpperCase()}</span>
         </div>
      </div>

      {/* Corner Brackets */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${borderColor} opacity-50`}></div>
      <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${borderColor} opacity-50`}></div>
      <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${borderColor} opacity-50`}></div>
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${borderColor} opacity-50`}></div>
    </div>
  );
};

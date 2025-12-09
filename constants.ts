import { Scenario } from './types';

export const SCENARIO_DATA: Scenario[] = [
  {
    "id": "nuclear_breach",
    "name": "NUCLEAR PLANT BREACH",
    "type": "HIGH_THREAT",
    "location": "Tihange Nuclear Power Station",
    "coordinates": { "lat": 50.534, "lng": 5.275 },
    "sensors": {
      "rf": { 
        "value": "DETECTED", 
        "confidence": 0.998, 
        "status": "CRITICAL", 
        "details": "Military-grade Encryption (AES-256)" 
      },
      "visual": { 
        "value": "HEXACOPTER", 
        "confidence": 0.85, 
        "status": "WARNING", 
        "details": "Visual Mismatch: Comm. body / Mil. signal" 
      },
      "audio": { 
        "value": "6 ROTORS", 
        "confidence": 0.78, 
        "status": "WARNING", 
        "details": "High-RPM Heavy Lift Signature" 
      },
      "context": { 
        "value": "RESTRICTED", 
        "confidence": 1.0, 
        "status": "CRITICAL", 
        "details": "No Flight Permit Found" 
      }
    },
    "spectrogram_url": "https://akusingh.github.io/drone-threat-assets/spectrograms/nuclear_breach.png",
    "reasoning": "RF Analysis confirms military-grade encryption not available on commercial hardware (99.8% confidence). Visual feed suggests commercial hexacopter, but audio signature indicates modified heavy-lift motors. CONTRADICTION DETECTED: Likely surveillance drone disguised as commercial unit. RECOMMENDED ACTION: IMMEDIATE INTERCEPTION."
  },
  {
    "id": "stadium_threat",
    "name": "STADIUM CROWD SAFETY",
    "type": "HIGH_THREAT",
    "location": "King Baudouin Stadium",
    "coordinates": { "lat": 50.895, "lng": 4.341 },
    "sensors": {
      "rf": { 
        "value": "DETECTED", 
        "confidence": 0.95, 
        "status": "WARNING", 
        "details": "Consumer Protocol (Lightbridge)" 
      },
      "visual": { 
        "value": "QUADCOPTER", 
        "confidence": 0.92, 
        "status": "CRITICAL", 
        "details": "Approaching South Stand (80k Pax)" 
      },
      "audio": { 
        "value": "4 ROTORS", 
        "confidence": 0.88, 
        "status": "WARNING", 
        "details": "Erratic Throttle Pattern" 
      },
      "context": { 
        "value": "EVENT LIVE", 
        "confidence": 1.0, 
        "status": "CRITICAL", 
        "details": "Active Match / No Fly Zone" 
      }
    },
    "spectrogram_url": "https://akusingh.github.io/drone-threat-assets/spectrograms/stadium_threat.png",
    "reasoning": "Standard consumer drone detected over populated stadium. Flight path is erratic, suggesting loss of control or amateur operator. While payload scan is negative, crash risk to crowd is severe. PRIORITY: PUBLIC SAFETY. Recommend frequency jamming to force safe landing protocols."
  },
  {
    "id": "authorized_film",
    "name": "AUTHORIZED FILM CREW",
    "type": "AUTHORIZED",
    "location": "Grand Place Brussels",
    "coordinates": { "lat": 50.850, "lng": 4.352 },
    "sensors": {
      "rf": { 
        "value": "DETECTED", 
        "confidence": 0.98, 
        "status": "OK", 
        "details": "DJI OcuSync 3.0 (Signed)" 
      },
      "visual": { 
        "value": "CINEMA DRONE", 
        "confidence": 0.95, 
        "status": "OK", 
        "details": "Inspire 3 with Permit Decals" 
      },
      "audio": { 
        "value": "4 ROTORS", 
        "confidence": 0.90, 
        "status": "OK", 
        "details": "Stable Flight / Consistent RPM" 
      },
      "context": { 
        "value": "PERMIT #492", 
        "confidence": 1.0, 
        "status": "OK", 
        "details": "Valid 09:00-11:00 Window" 
      }
    },
    "spectrogram_url": "https://akusingh.github.io/drone-threat-assets/spectrograms/authorized_film.png",
    "reasoning": "All sensors align. RF signature matches broadcast ID. Visuals confirm permit decals. Flight plan matches authorized window. STATUS: CLEARED. No action required."
  },
  {
    "id": "foggy_conflict",
    "name": "FOGGY CONFLICT RESOLUTION",
    "type": "MEDIUM_THREAT",
    "location": "Brussels Airport Perimeter",
    "coordinates": { "lat": 50.901, "lng": 4.484 },
    "sensors": {
      "rf": { 
        "value": "DETECTED", 
        "confidence": 0.92, 
        "status": "WARNING", 
        "details": "High-Power Signal (>5W)" 
      },
      "visual": { 
        "value": "UNCERTAIN", 
        "confidence": 0.45, 
        "status": "UNKNOWN", 
        "details": "Obscured by Fog/Weather" 
      },
      "audio": { 
        "value": "UNCERTAIN", 
        "confidence": 0.55, 
        "status": "UNKNOWN", 
        "details": "Wind Noise Interference" 
      },
      "context": { 
        "value": "RESTRICTED", 
        "confidence": 1.0, 
        "status": "WARNING", 
        "details": "Perimeter Edge" 
      }
    },
    "spectrogram_url": "https://akusingh.github.io/drone-threat-assets/spectrograms/foggy_conflict.png",
    "reasoning": "Visual and Audio sensors are degraded by weather (Fog/Wind). System is relying on RF CNN (92% Confidence) which positively identifies a drone signature despite lack of visual confirmation. AGENTIC DECISION: Overriding low visual confidence. Treating as confirmed intrusion based on RF signature. This demonstrates multimodal fusion - RF works when visual fails."
  }
];
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SensorDetail {
  value: string;
  confidence: number;
  status: 'CRITICAL' | 'WARNING' | 'OK' | 'UNKNOWN';
  details: string;
}

export interface Sensors {
  rf: SensorDetail;
  visual: SensorDetail;
  audio: SensorDetail;
  context: SensorDetail;
}

export interface Scenario {
  id: string;
  name: string;
  type: 'HIGH_THREAT' | 'MEDIUM_THREAT' | 'AUTHORIZED';
  location: string;
  coordinates: Coordinates;
  sensors: Sensors;
  spectrogram_url: string;
  reasoning: string;
}

export interface ChatMessage {
  id: string;
  sender: 'system' | 'user' | 'ai';
  text: string;
  timestamp: string;
  isThinking?: boolean;
}

import { create } from 'zustand';
import { WebSocketMessage } from '../types/api';

interface TelemetryState {
  connected: boolean;
  latest: WebSocketMessage | null;
  setConnected: (status: boolean) => void;
  updateTelemetry: (data: WebSocketMessage) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  connected: false,
  latest: null,
  setConnected: (connected) => set({ connected }),
  updateTelemetry: (data) => set({ latest: data }),
}));

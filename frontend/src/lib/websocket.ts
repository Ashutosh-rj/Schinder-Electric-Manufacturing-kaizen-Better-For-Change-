import { useTelemetryStore } from '../stores/telemetryStore';

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  
  connect() {
    if (this.ws) return;
    const url = import.meta.env.VITE_WS_BASE_URL + '/ws/telemetry';
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      useTelemetryStore.getState().setConnected(true);
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      useTelemetryStore.getState().updateTelemetry(data);
    };
    
    this.ws.onclose = () => {
      useTelemetryStore.getState().setConnected(false);
      this.ws = null;
      this.reconnectTimer = window.setTimeout(() => this.connect(), 3000);
    };
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsClient = new WebSocketClient();

import { create } from 'zustand';

export type EquipmentState = 'RUNNING' | 'STOPPED' | 'STARTING' | 'TRIPPED' | 'FAULT' | 'MAINTENANCE';
export type EquipmentMode = 'AUTO' | 'MANUAL' | 'LOCAL' | 'REMOTE';
export type AlarmPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentState;
  mode: EquipmentMode;
  health: number;
}

export interface Alarm {
  id: string;
  tag: string;
  description: string;
  priority: AlarmPriority;
  timestamp: Date;
  acknowledged: boolean;
  active: boolean;
}

interface ScadaStore {
  tags: Record<string, number>;
  equipment: Record<string, Equipment>;
  alarms: Alarm[];
  systemHealth: 'ALL OK' | 'WARNING' | 'DEGRADED' | 'CRITICAL';
  history: Record<string, { time: number, value: number }[]>;
  
  // Actions
  setTag: (tagId: string, value: number) => void;
  setTags: (updates: Record<string, number>, timestamp?: number) => void;
  setEquipmentState: (id: string, updates: Partial<Equipment>) => void;
  addAlarm: (alarm: Omit<Alarm, 'id' | 'timestamp' | 'acknowledged' | 'active'>) => void;
  ackAlarm: (id: string) => void;
  clearInactiveAlarms: () => void;
}

export const useScadaStore = create<ScadaStore>((set) => ({
  tags: {},
  equipment: {},
  alarms: [],
  systemHealth: 'ALL OK',
  history: {},

  setTag: (tagId, value) => 
    set((state) => ({
      tags: { ...state.tags, [tagId]: value }
    })),
    
  setTags: (updates, timestamp = Date.now()) =>
    set((state) => {
      const newHistory = { ...state.history };
      
      // Update history for each tag
      Object.entries(updates).forEach(([tagId, value]) => {
        if (!newHistory[tagId]) newHistory[tagId] = [];
        newHistory[tagId].push({ time: timestamp, value });
        // Keep last 300 data points (5 minutes at 1Hz)
        if (newHistory[tagId].length > 300) {
          newHistory[tagId].shift();
        }
      });

      return {
        tags: { ...state.tags, ...updates },
        history: newHistory
      };
    }),

  setEquipmentState: (id, updates) =>
    set((state) => ({
      equipment: {
        ...state.equipment,
        [id]: { ...state.equipment[id], ...updates }
      }
    })),

  addAlarm: (alarm) =>
    set((state) => {
      // Check if active alarm for this tag already exists
      const exists = state.alarms.some(a => a.tag === alarm.tag && a.active);
      if (exists) return state;

      const newAlarm: Alarm = {
        ...alarm,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        acknowledged: false,
        active: true,
      };
      
      return { alarms: [newAlarm, ...state.alarms].slice(0, 100) }; // Keep last 100
    }),

  ackAlarm: (id) =>
    set((state) => ({
      alarms: state.alarms.map(a => 
        a.id === id ? { ...a, acknowledged: true } : a
      )
    })),

  clearInactiveAlarms: () =>
    set((state) => ({
      alarms: state.alarms.filter(a => a.active || !a.acknowledged)
    })),
}));

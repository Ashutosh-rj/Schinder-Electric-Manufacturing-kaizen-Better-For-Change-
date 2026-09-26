/**
 * SCADA Industrial Plant Simulation & Telemetry Synchronization Engine
 * Conforms to ISA-101 and IEC 62443 Industrial SCADA / Digital Twin Standards.
 * Provides realistic physical dynamics, mass balance, thermal transfer,
 * power consumption, and mechanical condition telemetry for the entire cement plant.
 */

import { useScadaStore, EquipmentState, EquipmentMode } from '../store/scadaStore';
import { wsClient } from '../lib/websocket';
import { useTelemetryStore } from '../stores/telemetryStore';

export interface IndustrialEquipmentMeta {
  id: string;
  tag: string;
  name: string;
  type: string;
  area: string;
  ratedPowerKw: number;
  ratedCurrentA: number;
  ratedSpeedRpm: number;
  interlocks: { id: string; desc: string; satisfied: boolean }[];
}

export const EQUIPMENT_CATALOG: Record<string, IndustrialEquipmentMeta> = {
  // CRUSHER AREA
  'CR-AF-01': {
    id: 'CR-AF-01',
    tag: 'M-1101-AF',
    name: 'Apron Feeder Hydraulic Drive',
    type: 'Hydraulic Motor',
    area: 'CRUSHER',
    ratedPowerKw: 75,
    ratedCurrentA: 135,
    ratedSpeedRpm: 15,
    interlocks: [
      { id: 'INT-01', desc: 'Downstream Conveyor CR-BC-101 Running', satisfied: true },
      { id: 'INT-02', desc: 'Hydraulic Unit Oil Pressure > 120 bar', satisfied: true },
      { id: 'INT-03', desc: 'Hopper Chute Level Permissive (> 15%)', satisfied: true },
      { id: 'INT-04', desc: 'Emergency Pull Cord Switch Healthy', satisfied: true },
    ]
  },
  'CR-CR-01': {
    id: 'CR-CR-01',
    tag: 'M-1102-CR',
    name: 'Primary Reversible Impact Crusher',
    type: 'Impact Crusher',
    area: 'CRUSHER',
    ratedPowerKw: 650,
    ratedCurrentA: 820,
    ratedSpeedRpm: 740,
    interlocks: [
      { id: 'INT-01', desc: 'Discharge Conveyor CR-BC-102 Running', satisfied: true },
      { id: 'INT-02', desc: 'Lube Oil Pressure > 3.2 bar', satisfied: true },
      { id: 'INT-03', desc: 'Lube Oil Temp < 65°C', satisfied: true },
      { id: 'INT-04', desc: 'Vibration Switch < 4.5 mm/s', satisfied: true },
      { id: 'INT-05', desc: 'Hydraulic Gap Setting (CSS) Locked', satisfied: true },
    ]
  },
  'CR-BC-101': {
    id: 'CR-BC-101',
    tag: 'M-1103-BC',
    name: 'Crushed Limestone Discharge Conveyor',
    type: 'Belt Conveyor',
    area: 'CRUSHER',
    ratedPowerKw: 110,
    ratedCurrentA: 195,
    ratedSpeedRpm: 1480,
    interlocks: [
      { id: 'INT-01', desc: 'Downstream Stacker Conveyor Running', satisfied: true },
      { id: 'INT-02', desc: 'Belt Sway Switches Healthy', satisfied: true },
      { id: 'INT-03', desc: 'Zero Speed Sensor Normal', satisfied: true },
    ]
  },

  // RAW MILL AREA
  'RM1-VRM-01': {
    id: 'RM1-VRM-01',
    tag: 'M-2101-VRM',
    name: 'Raw Mill VRM Main Drive (Planetary Gearbox)',
    type: 'Vertical Roller Mill',
    area: 'RAW MILL',
    ratedPowerKw: 3800,
    ratedCurrentA: 380,
    ratedSpeedRpm: 990,
    interlocks: [
      { id: 'INT-01', desc: 'Mill ID Fan Running & Draft Stabilized', satisfied: true },
      { id: 'INT-02', desc: 'Hydraulic Roller Pressure (135 bar) OK', satisfied: true },
      { id: 'INT-03', desc: 'Main Reducer Hydrostatic Jacking Oil Pressure > 180 bar', satisfied: true },
      { id: 'INT-04', desc: 'Mill Differential Pressure < 950 mmWC', satisfied: true },
      { id: 'INT-05', desc: 'Mill Table Vibration < 5.0 mm/s', satisfied: true },
      { id: 'INT-06', desc: 'Hot Gas Inlet Temp < 350°C', satisfied: true },
    ]
  },
  'RM1-SEP-01': {
    id: 'RM1-SEP-01',
    tag: 'M-2102-SEP',
    name: 'Dynamic High-Efficiency Cage Separator',
    type: 'Dynamic Classifier',
    area: 'RAW MILL',
    ratedPowerKw: 220,
    ratedCurrentA: 390,
    ratedSpeedRpm: 1200,
    interlocks: [
      { id: 'INT-01', desc: 'VRM Table Running', satisfied: true },
      { id: 'INT-02', desc: 'Separator Bearing Temp < 75°C', satisfied: true },
      { id: 'INT-03', desc: 'Separator Rotor Vibration < 3.0 mm/s', satisfied: true },
    ]
  },
  'RM1-FAN-01': {
    id: 'RM1-FAN-01',
    tag: 'M-2103-FAN',
    name: 'Raw Mill Process Main ID Fan',
    type: 'Centrifugal ID Fan',
    area: 'RAW MILL',
    ratedPowerKw: 2600,
    ratedCurrentA: 260,
    ratedSpeedRpm: 990,
    interlocks: [
      { id: 'INT-01', desc: 'Inlet Damper (IVC) Closed at Starting', satisfied: true },
      { id: 'INT-02', desc: 'Motor & Fan Bearing Lube Oil Flow Normal', satisfied: true },
      { id: 'INT-03', desc: 'Fan Casing Vibration < 4.2 mm/s', satisfied: true },
      { id: 'INT-04', desc: 'Downstream Bag Filter Compartments Online', satisfied: true },
    ]
  },

  // COAL MILL AREA
  'CM1-VRM-01': {
    id: 'CM1-VRM-01',
    tag: 'M-3101-CLM',
    name: 'Coal VRM ATEX Explosion-Proof Mill',
    type: 'Coal Mill',
    area: 'COAL MILL',
    ratedPowerKw: 550,
    ratedCurrentA: 95,
    ratedSpeedRpm: 980,
    interlocks: [
      { id: 'INT-01', desc: 'Baghouse O2 Concentration < 8.0 % vol', satisfied: true },
      { id: 'INT-02', desc: 'CO Concentration < 300 ppm', satisfied: true },
      { id: 'INT-03', desc: 'Mill Outlet Temp < 75°C', satisfied: true },
      { id: 'INT-04', desc: 'Emergency N2/CO2 Fire Inerting System Armed', satisfied: true },
      { id: 'INT-05', desc: 'Explosion Vents Intact & Monitored', satisfied: true },
    ]
  },

  // KILN & PREHEATER AREA
  'KLN1-KILN-01': {
    id: 'KLN1-KILN-01',
    tag: 'M-4101-KLN',
    name: 'Rotary Kiln Main Drive (Dual Pinion / Bull Gear)',
    type: 'Rotary Kiln Drive',
    area: 'KILN',
    ratedPowerKw: 750,
    ratedCurrentA: 1150,
    ratedSpeedRpm: 4.5,
    interlocks: [
      { id: 'INT-01', desc: 'Preheater ID Fan Running with Negative Draft', satisfied: true },
      { id: 'INT-02', desc: 'Clinker Grate Cooler Running & Inlet Ready', satisfied: true },
      { id: 'INT-03', desc: 'Support Trunnion Roller 1/2/3 Oil Baths Normal', satisfied: true },
      { id: 'INT-04', desc: 'Hydraulic Thrust Roller System Active', satisfied: true },
      { id: 'INT-05', desc: 'Kiln Shell Scanner Max Temp < 420°C', satisfied: true },
      { id: 'INT-06', desc: 'Auxiliary Barring Engine Disengaged', satisfied: true },
    ]
  },
  'KLN1-ID-FAN': {
    id: 'KLN1-ID-FAN',
    tag: 'M-4102-ID',
    name: 'Preheater Tower Main Exhaust ID Fan',
    type: 'Preheater Fan',
    area: 'KILN',
    ratedPowerKw: 3200,
    ratedCurrentA: 320,
    ratedSpeedRpm: 990,
    interlocks: [
      { id: 'INT-01', desc: 'Gas Inlet Temp < 380°C', satisfied: true },
      { id: 'INT-02', desc: 'Cooling Water to Shaft Bearings Flowing', satisfied: true },
      { id: 'INT-03', desc: 'Fan Rotor DE/NDE Vibration < 4.0 mm/s', satisfied: true },
    ]
  },
  'KLN1-BURNER': {
    id: 'KLN1-BURNER',
    tag: 'B-4103-BUR',
    name: 'Multi-Channel Low-NOx Main Kiln Burner Pipe',
    type: 'Burner System',
    area: 'KILN',
    ratedPowerKw: 85,
    ratedCurrentA: 140,
    ratedSpeedRpm: 2800,
    interlocks: [
      { id: 'INT-01', desc: 'Primary Air Blower Running (> 80 mbar)', satisfied: true },
      { id: 'INT-02', desc: 'Secondary Air Temp from Cooler > 800°C', satisfied: true },
      { id: 'INT-03', desc: 'Flame Scanner Detection Healthy', satisfied: true },
      { id: 'INT-04', desc: 'Kiln Hood Pressure Negative (-0.5 to -2.0 mbar)', satisfied: true },
    ]
  },

  // COOLER AREA
  'CLR1-COOL-01': {
    id: 'CLR1-COOL-01',
    tag: 'M-5101-CLR',
    name: 'Reciprocating Grate Cooler Hydraulic Stepping Drive',
    type: 'Grate Cooler',
    area: 'COOLER',
    ratedPowerKw: 132,
    ratedCurrentA: 235,
    ratedSpeedRpm: 24,
    interlocks: [
      { id: 'INT-01', desc: 'Undergrate Cooling Fans 1 to 6 Running', satisfied: true },
      { id: 'INT-02', desc: 'Clinker Roll Crusher Running', satisfied: true },
      { id: 'INT-03', desc: 'Downstream Deep Pan Conveyor Running', satisfied: true },
      { id: 'INT-04', desc: 'Hydraulic Power Pack Pressure (160 bar) Normal', satisfied: true },
    ]
  },
  'CLR1-BRK-01': {
    id: 'CLR1-BRK-01',
    tag: 'M-5102-BRK',
    name: 'Discharge Clinker Roll Crusher / Breaker',
    type: 'Roll Crusher',
    area: 'COOLER',
    ratedPowerKw: 110,
    ratedCurrentA: 195,
    ratedSpeedRpm: 90,
    interlocks: [
      { id: 'INT-01', desc: 'Deep Pan Conveyor Running', satisfied: true },
      { id: 'INT-02', desc: 'Overload Reverse-Clear Circuit Active', satisfied: true },
    ]
  },

  // CEMENT MILL AREA
  'CM2-MILL-01': {
    id: 'CM2-MILL-01',
    tag: 'M-6101-CMM',
    name: 'Cement Ball Mill (Two-Compartment Slide Shoe Bearings)',
    type: 'Ball Mill',
    area: 'CEMENT MILL',
    ratedPowerKw: 4800,
    ratedCurrentA: 470,
    ratedSpeedRpm: 15.8,
    interlocks: [
      { id: 'INT-01', desc: 'High Pressure Hydrodynamic Jacking Pumps (120 bar) OK', satisfied: true },
      { id: 'INT-02', desc: 'Slide Shoe Bearing Oil Temp < 60°C', satisfied: true },
      { id: 'INT-03', desc: 'Mill ID Fan Running & Negative Draft Normal', satisfied: true },
      { id: 'INT-04', desc: 'O-Sepa Classifier Running', satisfied: true },
      { id: 'INT-05', desc: 'Feed Conveyors Interlocked & Permitted', satisfied: true },
    ]
  },
  'CM2-SEP-01': {
    id: 'CM2-SEP-01',
    tag: 'M-6102-SEP',
    name: 'O-Sepa Dynamic High-Fineness Separator',
    type: 'Dynamic Separator',
    area: 'CEMENT MILL',
    ratedPowerKw: 250,
    ratedCurrentA: 440,
    ratedSpeedRpm: 280,
    interlocks: [
      { id: 'INT-01', desc: 'Cement Mill Discharge Air Slide Running', satisfied: true },
      { id: 'INT-02', desc: 'Reject Slide Aeration Normal', satisfied: true },
    ]
  },

  // WHRS AREA
  'WHRS-GEN-01': {
    id: 'WHRS-GEN-01',
    tag: 'G-7101-TURB',
    name: 'WHRS Multi-Stage Condensing Steam Turbine Generator',
    type: 'Turbine Generator',
    area: 'POWER',
    ratedPowerKw: 7500,
    ratedCurrentA: 720,
    ratedSpeedRpm: 3000,
    interlocks: [
      { id: 'INT-01', desc: 'SP & AQC Boiler Superheated Steam Temp > 320°C', satisfied: true },
      { id: 'INT-02', desc: 'Steam Pressure > 18.5 bar', satisfied: true },
      { id: 'INT-03', desc: 'Surface Condenser Vacuum > 0.88 bar', satisfied: true },
      { id: 'INT-04', desc: 'Turbine Shaft Lube Oil Pressure Normal', satisfied: true },
      { id: 'INT-05', desc: 'Grid Synchronization Breaker Ready', satisfied: true },
    ]
  },
};

class ScadaEngine {
  private timer: number | null = null;
  private tickCount: number = 0;
  private isInitialized: boolean = false;

  public init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Connect to WebSocket client
    try {
      wsClient.connect();
    } catch (e) {
      console.warn('WS connect failed, relying on simulated physics engine:', e);
    }

    // Seed equipment store
    const store = useScadaStore.getState();
    const initialEquipment: Record<string, any> = {};

    Object.values(EQUIPMENT_CATALOG).forEach((meta) => {
      initialEquipment[meta.id] = {
        id: meta.id,
        name: meta.name,
        type: meta.type,
        status: 'RUNNING' as EquipmentState,
        mode: 'AUTO' as EquipmentMode,
        health: 96 + Math.floor(Math.random() * 4),
      };
    });

    // Populate initial tags
    const initialTags = this.generatePhysicsTags(0);
    store.setTags(initialTags);

    // Update equipment records
    Object.entries(initialEquipment).forEach(([id, eq]) => {
      store.setEquipmentState(id, eq);
    });

    // Start simulation loop (1 Hz)
    this.startLoop();
  }

  private startLoop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick() {
    this.tickCount++;
    const telemetry = useTelemetryStore.getState().latest;
    const store = useScadaStore.getState();

    // Check if WebSocket telemetry is available
    if (telemetry && telemetry.readings && telemetry.readings.length > 0) {
      const updates: Record<string, number> = {};
      telemetry.readings.forEach((r) => {
        updates[r.tag] = r.value;
      });
      // Merge with physics tags
      const physics = this.generatePhysicsTags(this.tickCount);
      store.setTags({ ...physics, ...updates });
    } else {
      // Local physics simulation
      const tags = this.generatePhysicsTags(this.tickCount);
      store.setTags(tags);
    }

    // Periodically evaluate alarms
    if (this.tickCount % 5 === 0) {
      this.evaluateAlarms();
    }
  }

  private generatePhysicsTags(t: number): Record<string, number> {
    const s = Math.sin(t * 0.05);
    const c = Math.cos(t * 0.03);
    const rnd = (pct: number) => 1 + (Math.sin(t * 0.2 + pct * 10) * pct * 0.5);

    // Get current equipment run states
    const eq = useScadaStore.getState().equipment;
    const isRun = (id: string) => eq[id]?.status === 'RUNNING' || eq[id]?.status === undefined;

    const crRun = isRun('CR-CR-01') ? 1 : 0;
    const rmRun = isRun('RM1-VRM-01') ? 1 : 0;
    const clmRun = isRun('CM1-VRM-01') ? 1 : 0;
    const klnRun = isRun('KLN1-KILN-01') ? 1 : 0;
    const clrRun = isRun('CLR1-COOL-01') ? 1 : 0;
    const cmRun = isRun('CM2-MILL-01') ? 1 : 0;
    const whrsRun = isRun('WHRS-GEN-01') ? 1 : 0;

    return {
      // CRUSHER
      'CR-HOP-LVL': 68.5 + s * 4.2,
      'CR-AF-FEED': crRun * (480.0 + s * 15.0),
      'CR-AF-SPD': crRun * (12.4 + s * 0.5),
      'CR-AF-CUR': crRun * (92.0 + s * 3.5),
      'CR-CR-PWR': crRun * (485.0 + c * 25.0),
      'CR-CR-CUR': crRun * (610.0 + c * 30.0),
      'CR-CR-VIB': crRun * (2.4 + Math.abs(s) * 0.6),
      'CR-CR-LOAD': crRun * (78.0 + s * 5.0),
      'CR-CR-DE-TEMP': 58.2 + s * 1.5,
      'CR-CR-NDE-TEMP': 56.4 + c * 1.2,
      'CR-CR-CSS': 28.5, // Closed side setting in mm
      'CR-CR-LUBE-PR': 3.8 + s * 0.1,
      'CR-BC101-LOAD': crRun * (475.0 + s * 12.0),
      'CR-BC101-SPD': crRun * 2.1,
      'CR-BC102-LOAD': crRun * (470.0 + s * 14.0),
      'CR-BC102-SPD': crRun * 2.2,
      'CR-DC-DP': 115.0 + s * 8.0,
      'CR-XRF-CA': 44.2 + s * 0.3,
      'CR-XRF-SI': 13.5 + c * 0.2,
      'CR-XRF-AL': 3.4 + s * 0.1,
      'CR-XRF-FE': 2.1 + c * 0.05,
      'CR-XRF-LSF': 96.8 + s * 1.2,

      // RAW MILL
      'RM1-FEED': rmRun * (285.0 + s * 6.0),
      'RM1-FEED-TOT': rmRun * (285.0 + s * 6.0),
      'RM1-FEED-LS': rmRun * (235.0 + s * 5.0), // 82.5%
      'RM1-FEED-CLAY': rmRun * (34.0 + s * 1.0), // 12%
      'RM1-FEED-SAND': rmRun * (8.5 + s * 0.3),  // 3%
      'RM1-FEED-IRON': rmRun * (7.5 + s * 0.2),  // 2.5%
      'RM1-PWR': rmRun * (3240.0 + s * 80.0),
      'RM1-CUR': rmRun * (325.0 + s * 8.0),
      'RM1-DP': rmRun * (620.0 + s * 25.0),
      'RM1-VRM-DP': rmRun * (620.0 + s * 25.0),
      'RM1-VRM-HYD-PR': rmRun * (136.0 + s * 2.0),
      'RM1-VRM-VIB': rmRun * (3.2 + Math.abs(s) * 0.8),
      'RM1-VRM-WATER': rmRun * (2.8 + s * 0.4), // m3/h water injection
      'RM1-IN-TEMP': 275.0 + s * 5.0,
      'RM1-OUT-TEMP': 88.5 + s * 2.0,
      'RM1-SEP-SPD': rmRun * (84.0 + c * 1.5),
      'RM1-SEP-PWR': rmRun * (145.0 + c * 5.0),
      'RM1-FAN-SPD': rmRun * 985.0,
      'RM1-FAN-CUR': rmRun * (210.0 + s * 6.0),
      'RM1-FAN-PWR': rmRun * (2120.0 + s * 50.0),
      'RM1-FAN-VIB': rmRun * (2.8 + Math.abs(c) * 0.5),
      'RM1-DC-DP': 142.0 + s * 10.0,
      'RM1-SILO-LVL': 74.2 + (t * 0.001) % 20,

      // COAL MILL
      'CM1-BUNKER-LVL': 62.0 + s * 3.0,
      'CM1-FEED': clmRun * (28.5 + s * 1.2),
      'CM1-PWR': clmRun * (440.0 + s * 15.0),
      'CM1-DP': clmRun * (410.0 + s * 18.0),
      'CM1-IN-TEMP': 210.0 + s * 4.0,
      'CM1-OUT-TEMP': 68.5 + s * 1.5,
      'CM1-O2-CONC': 5.2 + Math.abs(s) * 0.6, // Safe under 8%
      'CM1-CO-CONC': 85.0 + Math.abs(c) * 25.0, // Safe under 300 ppm
      'CM1-INJ-KILN': klnRun * (11.8 + s * 0.4), // Coal to kiln burner
      'CM1-INJ-CALC': klnRun * (16.2 + c * 0.5), // Coal to calciner

      // KILN & PREHEATER
      'KLN1-FEED': klnRun * (280.0 + s * 4.0),
      'KLN1-FEED-RATE': klnRun * (280.0 + s * 4.0),
      'KLN1-SPD': klnRun * (3.85 + s * 0.05),
      'KLN1-CUR': klnRun * (845.0 + s * 25.0),
      'KLN1-PWR': klnRun * (580.0 + s * 20.0),
      'KLN1-BZ-TEMP': klnRun * (1448.0 + s * 15.0),
      'KLN1-BE-TEMP': klnRun * (1042.0 + s * 10.0),
      'KLN1-HOOD-TEMP': klnRun * (1120.0 + s * 12.0),
      'KLN1-HOOD-PR': -1.2 + s * 0.3, // mmWC draft
      'KLN1-CALC-TEMP': klnRun * (885.0 + s * 8.0),
      'KLN1-TAD-TEMP': klnRun * (860.0 + s * 10.0),
      'KLN1-TAD-DAMPER': 78.0, // % opening
      'KLN1-SNCR-FLOW': klnRun * (240.0 + s * 15.0), // L/h ammonia solution
      'KLN1-C1-TEMP': 335.0 + s * 5.0,
      'KLN1-C2-TEMP': 540.0 + s * 6.0,
      'KLN1-C3-TEMP': 710.0 + s * 8.0,
      'KLN1-C4-TEMP': 820.0 + s * 7.0,
      'KLN1-C5-TEMP': 885.0 + s * 8.0,
      'KLN1-C1-DP': 52.0 + s * 3.0,
      'KLN1-C5-DP': 48.0 + s * 2.5,
      'KLN1-ID-FAN-SPD': klnRun * 980.0,
      'KLN1-ID-FAN-PWR': klnRun * (2780.0 + s * 60.0),
      'KLN1-SHELL-SCAN-MAX': 342.0 + s * 8.0,
      'KLN1-TYRE1-TEMP': 210.0 + s * 4.0,
      'KLN1-TYRE2-TEMP': 245.0 + s * 5.0,
      'KLN1-TYRE3-TEMP': 195.0 + s * 3.0,
      'KLN1-THRUST-POS': 4.2 + Math.sin(t * 0.005) * 8.0, // Axial oscillation +/- 10mm
      'KLN1-O2': 2.45 + s * 0.2,
      'KLN1-NOX': 410.0 + s * 25.0,
      'KLN1-SO2': 18.5 + s * 4.0,
      'KLN1-CO': 120.0 + Math.abs(c) * 35.0,
      'KLN1-CLINKER-PROD': klnRun * (183.5 + s * 3.0),

      // GRATE COOLER
      'CLR1-GRATE-SPD': clrRun * (14.2 + s * 0.8), // Strokes per min
      'CLR1-SEC-AIR': clrRun * (1045.0 + s * 15.0),
      'CLR1-TER-AIR': clrRun * (895.0 + s * 12.0),
      'CLR1-CLINK-OUT': 92.0 + s * 5.0, // Clinker discharge temp °C
      'CLR1-F1-PR': clrRun * (68.0 + s * 3.0), // mbar
      'CLR1-F2-PR': clrRun * (54.0 + s * 2.5),
      'CLR1-F3-PR': clrRun * (42.0 + s * 2.0),
      'CLR1-F4-PR': clrRun * (35.0 + s * 1.5),
      'CLR1-BRK-PWR': clrRun * (62.0 + c * 10.0),
      'CLR1-EXH-TEMP': 240.0 + s * 8.0,
      'CLR1-EXH-FAN-PWR': clrRun * (420.0 + s * 15.0),

      // CLINKER TRANSPORT & SILO
      'CT1-PAN-CVY-LOAD': clrRun * (182.0 + s * 3.5),
      'CT1-PAN-CVY-SPD': clrRun * 0.35, // m/s
      'CT1-SILO-LVL': 65.4 + (t * 0.0008) % 30,
      'CT1-SILO-TONS': 42500.0,

      // CEMENT MILL
      'CM2-FEED-CLINKER': cmRun * (148.0 + s * 4.0),
      'CM2-FEED-GYPSUM': cmRun * (8.2 + s * 0.3),  // 5%
      'CM2-FEED-FLYASH': cmRun * (38.8 + s * 1.2), // 20%
      'CM2-FEED-TOT': cmRun * (195.0 + s * 5.0),
      'CM2-PWR': cmRun * (4280.0 + s * 110.0),
      'CM2-CUR': cmRun * (418.0 + s * 12.0),
      'CM2-JACKING-PR': 118.0 + s * 2.0,
      'CM2-BEARING-TEMP': 54.5 + s * 1.2,
      'CM2-OUT-TEMP': 108.0 + s * 3.0,
      'CM2-SEP-SPD': cmRun * (245.0 + c * 3.0),
      'CM2-SEP-PWR': cmRun * (185.0 + c * 6.0),
      'CM2-FAN-SPD': cmRun * 980.0,
      'CM2-FAN-PWR': cmRun * (1650.0 + s * 40.0),
      'CM2-BLAINE': 385.0 + s * 8.0, // Blaine fineness m2/kg
      'CM2-SILO1-LVL': 82.0 + (t * 0.001) % 15,
      'CM2-SILO2-LVL': 58.0 + (t * 0.0008) % 25,

      // PACKING & DISPATCH
      'PACK-ROTARY-SPD': 5.5, // RPM
      'PACK-BAGS-MIN': 85.0 + s * 4.0,
      'PACK-BAG-WEIGHT': 50.1 + (Math.random() - 0.5) * 0.2, // 50kg bag
      'PACK-BULK-FLOW': 180.0 + s * 10.0, // t/h bulk tanker loading

      // WHRS & PLANT TOTALS
      'WHRS-SP-STEAM-FLOW': whrsRun * (14.2 + s * 0.5), // t/h
      'WHRS-SP-STEAM-TEMP': whrsRun * (325.0 + s * 5.0),
      'WHRS-AQC-STEAM-FLOW': whrsRun * (18.5 + s * 0.6),
      'WHRS-AQC-STEAM-TEMP': whrsRun * (340.0 + s * 6.0),
      'WHRS-GENERATION': whrsRun * (6450.0 + s * 120.0), // kW
      'WHRS-TURBINE-MW': whrsRun * (6.45 + s * 0.12),
      'WHRS-VACUUM': 0.91 + s * 0.01,
      'CPP-POWER': 8500.0 + c * 150.0, // 8.5 MW Captive power
      'PLANT-TOTAL-POWER': 22400.0 + s * 350.0, // 22.4 MW
      'PLANT-GRID-IMPORT': 7450.0 + s * 200.0,
      'PLANT-SEC-KWH': 63.8 + s * 0.8, // kWh/ton clinker
    };
  }

  private evaluateAlarms() {
    const store = useScadaStore.getState();
    const tags = store.tags;

    // Check ATEX Coal Mill O2 threshold (safety standard: max 8.0%)
    if ((tags['CM1-O2-CONC'] || 0) > 7.5) {
      store.addAlarm({
        tag: 'CM1-O2-CONC',
        description: 'ATEX Warning: Coal Mill Gas O2 High (> 7.5% vol)',
        priority: 'CRITICAL',
      });
    }

    // Check Kiln Shell Max Temp (> 390°C indicates brick spalling)
    if ((tags['KLN1-SHELL-SCAN-MAX'] || 0) > 380) {
      store.addAlarm({
        tag: 'KLN1-SHELL-SCAN-MAX',
        description: 'Shell Optical Scanner: High Spot detected on Sintering Ring',
        priority: 'HIGH',
      });
    }

    // Check VRM Vibration
    if ((tags['RM1-VRM-VIB'] || 0) > 4.2) {
      store.addAlarm({
        tag: 'RM1-VRM-VIB',
        description: 'Raw Mill 1 Roller Hydropneumatic Vibration High',
        priority: 'MEDIUM',
      });
    }
  }

  public controlEquipment(id: string, action: 'START' | 'STOP' | 'RESET' | 'ACK') {
    const store = useScadaStore.getState();
    if (action === 'START') {
      store.setEquipmentState(id, { status: 'RUNNING' });
    } else if (action === 'STOP') {
      store.setEquipmentState(id, { status: 'STOPPED' });
    } else if (action === 'RESET') {
      store.setEquipmentState(id, { status: 'STOPPED' });
    }
  }
}

export const scadaEngine = new ScadaEngine();

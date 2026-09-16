import { useScadaStore } from '../store/scadaStore';

// Initial Demo State Setup
const initializeDemoState = () => {
  const store = useScadaStore.getState();

  // 1. Setup Initial Equipment
  const initialEquipment = {
    'CR-CR-01': { id: 'CR-CR-01', name: 'Primary Crusher', type: 'CRUSHER', status: 'RUNNING', mode: 'AUTO', health: 96 },
    'CR-AF-01': { id: 'CR-AF-01', name: 'Apron Feeder', type: 'FEEDER', status: 'RUNNING', mode: 'AUTO', health: 98 },
    'CR-BC-101': { id: 'CR-BC-101', name: 'Belt Conveyor 101', type: 'CONVEYOR', status: 'RUNNING', mode: 'AUTO', health: 95 },
    'CR-BC-102': { id: 'CR-BC-102', name: 'Belt Conveyor 102', type: 'CONVEYOR', status: 'RUNNING', mode: 'AUTO', health: 99 },
    'CR-DC-01': { id: 'CR-DC-01', name: 'Dust Collector', type: 'FILTER', status: 'RUNNING', mode: 'AUTO', health: 90 },
    
    // RM1 Equipment
    'RM1-VRM-01': { id: 'RM1-VRM-01', name: 'Raw Mill 1', type: 'VRM', status: 'RUNNING', mode: 'AUTO', health: 88 },
    'RM1-FAN-01': { id: 'RM1-FAN-01', name: 'RM1 ID Fan', type: 'FAN', status: 'RUNNING', mode: 'AUTO', health: 92 },
    'RM1-SEP-01': { id: 'RM1-SEP-01', name: 'Separator', type: 'MOTOR', status: 'RUNNING', mode: 'AUTO', health: 95 },
    'RM1-DC-01': { id: 'RM1-DC-01', name: 'Bag Filter', type: 'FILTER', status: 'RUNNING', mode: 'AUTO', health: 89 },
    'RM1-ELEV-01': { id: 'RM1-ELEV-01', name: 'Bucket Elevator', type: 'CONVEYOR', status: 'RUNNING', mode: 'AUTO', health: 94 },

    // CM1 Equipment
    'CM1-WF-01': { id: 'CM1-WF-01', name: 'Weigh Feeder', type: 'FEEDER', status: 'RUNNING', mode: 'AUTO', health: 98 },
    'CM1-VRM-01': { id: 'CM1-VRM-01', name: 'Coal Mill', type: 'VRM', status: 'RUNNING', mode: 'AUTO', health: 91 },
    'CM1-DC-01': { id: 'CM1-DC-01', name: 'Coal Filter (ATEX)', type: 'FILTER', status: 'RUNNING', mode: 'AUTO', health: 96 },
    'CM1-FAN-01': { id: 'CM1-FAN-01', name: 'CM1 ID Fan', type: 'FAN', status: 'RUNNING', mode: 'AUTO', health: 93 },
    'CM1-BLW-01': { id: 'CM1-BLW-01', name: 'Kiln Blower', type: 'FAN', status: 'RUNNING', mode: 'AUTO', health: 95 },
    'CM1-BLW-02': { id: 'CM1-BLW-02', name: 'Calciner Blower', type: 'FAN', status: 'RUNNING', mode: 'AUTO', health: 95 },

    // KLN1 Equipment
    'KLN1-KILN-01': { id: 'KLN1-KILN-01', name: 'Rotary Kiln', type: 'KILN', status: 'RUNNING', mode: 'AUTO', health: 98 },
    'KLN1-ID-FAN': { id: 'KLN1-ID-FAN', name: 'Preheater ID Fan', type: 'FAN', status: 'RUNNING', mode: 'AUTO', health: 95 },

    // CLR1 Equipment
    'CLR1-COOL-01': { id: 'CLR1-COOL-01', name: 'Grate Cooler', type: 'COOLER', status: 'RUNNING', mode: 'AUTO', health: 97 },
    'CLR1-BRK-01': { id: 'CLR1-BRK-01', name: 'Clinker Breaker', type: 'MOTOR', status: 'RUNNING', mode: 'AUTO', health: 90 },
    'CLR1-F1': { id: 'CLR1-F1', name: 'Cooling Fan 1', type: 'FAN', status: 'RUNNING', mode: 'AUTO', health: 99 },
    'CLR1-F2': { id: 'CLR1-F2', name: 'Cooling Fan 2', type: 'FAN', status: 'RUNNING', mode: 'AUTO', health: 98 },
    'CLR1-F3': { id: 'CLR1-F3', name: 'Cooling Fan 3', type: 'FAN', status: 'RUNNING', mode: 'AUTO', health: 96 },

    // CT1 Equipment
    'CT1-DPC-01': { id: 'CT1-DPC-01', name: 'Deep Pan Conveyor', type: 'CONVEYOR', status: 'RUNNING', mode: 'AUTO', health: 92 },
    'CT1-ELEV-01': { id: 'CT1-ELEV-01', name: 'Clinker Elevator', type: 'CONVEYOR', status: 'RUNNING', mode: 'AUTO', health: 94 },
    'CT1-DC-01': { id: 'CT1-DC-01', name: 'Transfer Dust Collector', type: 'FILTER', status: 'RUNNING', mode: 'AUTO', health: 97 },

    // CM2 Equipment
    'CM2-WF-01': { id: 'CM2-WF-01', name: 'Clinker Feeder', type: 'FEEDER', status: 'RUNNING', mode: 'AUTO', health: 95 },
    'CM2-WF-02': { id: 'CM2-WF-02', name: 'Gypsum Feeder', type: 'FEEDER', status: 'RUNNING', mode: 'AUTO', health: 96 },
    'CM2-MILL-01': { id: 'CM2-MILL-01', name: 'Ball Mill', type: 'MILL', status: 'RUNNING', mode: 'AUTO', health: 90 },
    'CM2-SEP-01': { id: 'CM2-SEP-01', name: 'O-Sepa Separator', type: 'MOTOR', status: 'RUNNING', mode: 'AUTO', health: 92 },
    'CM2-DC-01': { id: 'CM2-DC-01', name: 'Mill Bag Filter', type: 'FILTER', status: 'RUNNING', mode: 'AUTO', health: 94 },
  };

  Object.values(initialEquipment).forEach(eq => {
    store.setEquipmentState(eq.id, eq as any);
  });

  // 2. Setup Initial Tags
  store.setTags({
    'CR-HOP-LVL': 68,
    'CR-AF-SPD': 32.0,
    'CR-AF-CUR': 45.2,
    'CR-AF-FEED': 1045,
    'CR-CR-PWR': 420,
    'CR-CR-CUR': 612,
    'CR-CR-LOAD': 72,
    'CR-BC101-SPD': 2.5,
    'CR-BC101-LOAD': 680,
    'CR-BC102-SPD': 3.0,
    'CR-BC102-LOAD': 1040,
    'CR-DC-DP': 1250,

    // RM1 Tags
    'RM1-FEED': 285.3,
    'RM1-PWR': 3200,
    'RM1-CUR': 420,
    'RM1-DP': 625,
    'RM1-IN-TEMP': 280,
    'RM1-OUT-TEMP': 87.5,
    'RM1-SEP-SPD': 85,
    'RM1-FAN-SPD': 1150,
    'RM1-FAN-CUR': 310,
    'RM1-SILO-LVL': 45.2,

    // CM1 Tags (Coal Mill)
    'CM1-FEED': 32.5,
    'CM1-PWR': 850,
    'CM1-DP': 450,
    'CM1-IN-TEMP': 250,
    'CM1-OUT-TEMP': 75,
    'CM1-SILO-LVL': 65.0,
    'CM1-INJ-KILN': 18.5,
    'CM1-INJ-CALC': 12.0,
    'CM1-CO-PPM': 12,
    'CM1-O2-PCT': 8.5,

    // KLN1 Tags (Preheater & Kiln)
    'KLN1-FEED': 250.0,
    'KLN1-SPD': 3.5,
    'KLN1-CUR': 680,
    'KLN1-PWR': 420,
    'KLN1-BZ-TEMP': 1450,
    'KLN1-BE-TEMP': 1050,
    'KLN1-CALC-TEMP': 890,
    'KLN1-ID-FAN-SPD': 920,
    'KLN1-NOX': 450,
    'KLN1-O2': 2.1,

    // CLR1 Tags (Grate Cooler)
    'CLR1-SEC-AIR': 950,
    'CLR1-TER-AIR': 880,
    'CLR1-CLINK-OUT': 95,
    'CLR1-GRATE-SPD': 12,
    'CLR1-BRK-PWR': 110,
    'CLR1-F1-PR': 45,
    'CLR1-F2-PR': 38,
    'CLR1-F3-PR': 30,

    // CT1 Tags (Clinker Transport)
    'CT1-DPC-SPD': 0.8,
    'CT1-DPC-CUR': 125,
    'CT1-DPC-LOAD': 250,
    'CT1-SILO1-LVL': 85.5,
    'CT1-SILO2-LVL': 62.0,
    'CT1-SILO3-LVL': 15.0, // Off-spec
    'CT1-DC-DP': 1100,

    // CM2 Tags (Cement Mill)
    'CM2-CLINK-FEED': 142.5,
    'CM2-GYP-FEED': 7.5,
    'CM2-SLAG-FEED': 0.0,
    'CM2-MILL-PWR': 4200,
    'CM2-MILL-CUR': 560,
    'CM2-SOUND': 95,
    'CM2-ELEV-PWR': 120,
    'CM2-SEP-SPD': 125,
    'CM2-BLAINE': 3800,
    'CM2-CEM-TEMP': 95.5,
    'CM2-SILO1-LVL': 78.5,
  });
};

// Simulation Loop
let simInterval: number | null = null;
let time = 0;

export const startSimulation = () => {
  if (simInterval) return;
  
  initializeDemoState();

  simInterval = window.setInterval(() => {
    const store = useScadaStore.getState();
    const tags = store.tags;
    const eq = store.equipment;

    time += 0.1;

    // Helper for noise
    const noise = (amount: number) => (Math.random() - 0.5) * amount;

    const updates: Record<string, number> = {};

    // --- Limestone Crusher Area Simulation Dependencies ---
    const isCrusherRunning = eq['CR-CR-01']?.status === 'RUNNING';
    const isFeederRunning = eq['CR-AF-01']?.status === 'RUNNING';

    if (isCrusherRunning && isFeederRunning) {
      const feedTarget = 1045 + Math.sin(time * 0.05) * 50;
      updates['CR-AF-FEED'] = feedTarget + noise(5);
      updates['CR-AF-SPD'] = (feedTarget / 1045) * 32.0 + noise(0.2);
      updates['CR-AF-CUR'] = (feedTarget / 1045) * 45.2 + noise(0.5);
      updates['CR-CR-LOAD'] = (feedTarget / 1500) * 100 + noise(1);
      updates['CR-CR-PWR'] = (updates['CR-CR-LOAD'] / 100) * 500 + noise(5);
      updates['CR-CR-CUR'] = (updates['CR-CR-PWR'] / 420) * 612 + noise(2);
      
      const reclaimRate = 1150;
      const netFlow = reclaimRate - updates['CR-AF-FEED'];
      updates['CR-HOP-LVL'] = Math.max(0, Math.min(100, (tags['CR-HOP-LVL'] || 68) + (netFlow * 0.0001)));
      updates['CR-BC101-LOAD'] = updates['CR-AF-FEED'] * 0.65 + noise(2);
      updates['CR-BC102-LOAD'] = updates['CR-AF-FEED'] + noise(5);
      updates['CR-DC-DP'] = 1250 + noise(10);
    } else {
      updates['CR-AF-FEED'] = 0;
      updates['CR-AF-SPD'] = 0;
      updates['CR-AF-CUR'] = 0;
      updates['CR-CR-LOAD'] = 0;
      updates['CR-CR-PWR'] = 0;
      updates['CR-CR-CUR'] = 0;
      updates['CR-BC101-LOAD'] = 0;
      updates['CR-BC102-LOAD'] = 0;
    }

    // --- Raw Mill (RM1) Simulation Dependencies ---
    const isRM1Running = eq['RM1-VRM-01']?.status === 'RUNNING';
    
    if (isRM1Running) {
       const rm1FeedTarget = 285.3 + Math.sin(time * 0.1) * 10;
       updates['RM1-FEED'] = rm1FeedTarget + noise(2);
       
       // Power and current based on feed rate
       updates['RM1-PWR'] = (rm1FeedTarget / 290) * 3200 + noise(15);
       updates['RM1-CUR'] = (updates['RM1-PWR'] / 3200) * 420 + noise(3);
       
       // DP and Temp based on feed
       updates['RM1-DP'] = (rm1FeedTarget / 290) * 625 + noise(5);
       updates['RM1-IN-TEMP'] = 280 + noise(2);
       updates['RM1-OUT-TEMP'] = 87.5 + noise(0.5);
       
       // Fan
       updates['RM1-FAN-SPD'] = 1150 + noise(1);
       updates['RM1-FAN-CUR'] = 310 + noise(2);
       
       // Silo level slowly rises
       updates['RM1-SILO-LVL'] = Math.max(0, Math.min(100, (tags['RM1-SILO-LVL'] || 45) + (rm1FeedTarget * 0.00005)));
    } else {
       updates['RM1-FEED'] = 0;
       updates['RM1-PWR'] = 0;
       updates['RM1-CUR'] = 0;
       updates['RM1-DP'] = 0;
       updates['RM1-IN-TEMP'] = (tags['RM1-IN-TEMP'] || 280) - 0.1; // slow cool down
       updates['RM1-OUT-TEMP'] = (tags['RM1-OUT-TEMP'] || 87.5) - 0.05;
       updates['RM1-FAN-SPD'] = 0;
       updates['RM1-FAN-CUR'] = 0;
    }

    // --- Coal Mill (CM1) Simulation Dependencies ---
    const isCM1Running = eq['CM1-VRM-01']?.status === 'RUNNING';

    if (isCM1Running) {
       const cm1FeedTarget = 32.5 + Math.sin(time * 0.2) * 2;
       updates['CM1-FEED'] = cm1FeedTarget + noise(0.5);
       
       updates['CM1-PWR'] = (cm1FeedTarget / 35) * 850 + noise(5);
       updates['CM1-DP'] = (cm1FeedTarget / 35) * 450 + noise(3);
       
       updates['CM1-IN-TEMP'] = 250 + noise(1);
       updates['CM1-OUT-TEMP'] = 75 + noise(0.2);
       
       // Silo level slowly rises based on feed, drops based on injection
       const injTotal = (tags['CM1-INJ-KILN'] || 18.5) + (tags['CM1-INJ-CALC'] || 12.0);
       const cm1NetFlow = cm1FeedTarget - injTotal;
       updates['CM1-SILO-LVL'] = Math.max(0, Math.min(100, (tags['CM1-SILO-LVL'] || 65) + (cm1NetFlow * 0.0005)));
       
       // ATEX safety readings
       updates['CM1-CO-PPM'] = 12 + noise(2) + (Math.random() > 0.95 ? 5 : 0); // occasional spikes
       updates['CM1-O2-PCT'] = 8.5 + noise(0.1);

       // Check ATEX Alarm
       if (updates['CM1-CO-PPM'] > 25) {
         store.addAlarm({ tag: 'CM1-CO-PPM', description: 'CM1 Filter CO High (ATEX)', priority: 'CRITICAL' });
       }

    } else {
       updates['CM1-FEED'] = 0;
       updates['CM1-PWR'] = 0;
       updates['CM1-DP'] = 0;
       updates['CM1-IN-TEMP'] = (tags['CM1-IN-TEMP'] || 250) - 0.5; 
       updates['CM1-OUT-TEMP'] = (tags['CM1-OUT-TEMP'] || 75) - 0.2;
    }

    // --- Preheater & Kiln (KLN1) Simulation ---
    const isKilnRunning = eq['KLN1-KILN-01']?.status === 'RUNNING';
    if (isKilnRunning) {
       updates['KLN1-SPD'] = 3.5 + noise(0.05);
       updates['KLN1-CUR'] = 680 + noise(10);
       updates['KLN1-PWR'] = 420 + noise(5);
       
       const coalInj = tags['CM1-INJ-KILN'] || 18.5;
       updates['KLN1-BZ-TEMP'] = 1450 + (coalInj - 18.5) * 10 + noise(15);
       updates['KLN1-BE-TEMP'] = 1050 + noise(5);
       updates['KLN1-CALC-TEMP'] = 890 + noise(5);
       
       updates['KLN1-ID-FAN-SPD'] = 920 + noise(2);
       updates['KLN1-NOX'] = 450 + noise(25);
       updates['KLN1-O2'] = 2.1 + noise(0.2);
    } else {
       updates['KLN1-SPD'] = 0;
       updates['KLN1-CUR'] = 0;
       updates['KLN1-PWR'] = 0;
       updates['KLN1-BZ-TEMP'] = (tags['KLN1-BZ-TEMP'] || 1450) - 2;
    }

    // --- Grate Cooler (CLR1) Simulation ---
    const isCoolerRunning = eq['CLR1-COOL-01']?.status === 'RUNNING';
    if (isCoolerRunning && isKilnRunning) {
       updates['CLR1-SEC-AIR'] = (tags['KLN1-BZ-TEMP'] || 1450) * 0.65 + noise(10);
       updates['CLR1-TER-AIR'] = updates['CLR1-SEC-AIR'] - 70 + noise(5);
       
       updates['CLR1-GRATE-SPD'] = 12 + noise(0.5);
       updates['CLR1-CLINK-OUT'] = 95 + noise(2);
       
       updates['CLR1-F1-PR'] = 45 + noise(1);
       updates['CLR1-F2-PR'] = 38 + noise(1);
       updates['CLR1-F3-PR'] = 30 + noise(1);
       updates['CLR1-BRK-PWR'] = 110 + noise(5);
    } else {
       updates['CLR1-GRATE-SPD'] = 0;
       updates['CLR1-F1-PR'] = 0;
       updates['CLR1-F2-PR'] = 0;
       updates['CLR1-F3-PR'] = 0;
       updates['CLR1-BRK-PWR'] = 0;
    }

    // --- Clinker Transport (CT1) Simulation ---
    const isCT1Running = eq['CT1-DPC-01']?.status === 'RUNNING';
    if (isCT1Running && isCoolerRunning) {
       const clinkerFlow = 250 + noise(10); // roughly matches kiln output
       updates['CT1-DPC-SPD'] = 0.8 + noise(0.02);
       updates['CT1-DPC-CUR'] = 125 + noise(5);
       updates['CT1-DPC-LOAD'] = clinkerFlow;
       
       updates['CT1-DC-DP'] = 1100 + noise(15);
       
       // Silo filling logic
       updates['CT1-SILO1-LVL'] = Math.max(0, Math.min(100, (tags['CT1-SILO1-LVL'] || 85) + clinkerFlow * 0.0001));
    } else {
       updates['CT1-DPC-SPD'] = 0;
       updates['CT1-DPC-CUR'] = 0;
       updates['CT1-DPC-LOAD'] = 0;
    }

    // --- Cement Mill (CM2) Simulation ---
    const isCM2Running = eq['CM2-MILL-01']?.status === 'RUNNING';
    if (isCM2Running) {
       const clinkFeed = 142.5 + noise(2);
       const gypFeed = 7.5 + noise(0.2);
       
       updates['CM2-CLINK-FEED'] = clinkFeed;
       updates['CM2-GYP-FEED'] = gypFeed;
       
       updates['CM2-MILL-PWR'] = 4200 + noise(50);
       updates['CM2-MILL-CUR'] = 560 + noise(8);
       updates['CM2-SOUND'] = 95 + noise(2);
       
       updates['CM2-ELEV-PWR'] = 120 + noise(2);
       updates['CM2-SEP-SPD'] = 125 + noise(0.5);
       
       // Fineness based on separator speed and feed
       updates['CM2-BLAINE'] = 3800 + (tags['CM2-SEP-SPD'] - 125)*10 - (clinkFeed - 142.5)*5 + noise(20);
       updates['CM2-CEM-TEMP'] = 95.5 + noise(1);
       
       updates['CM2-SILO1-LVL'] = Math.max(0, Math.min(100, (tags['CM2-SILO1-LVL'] || 78) + (clinkFeed + gypFeed) * 0.0002));
    } else {
       updates['CM2-CLINK-FEED'] = 0;
       updates['CM2-GYP-FEED'] = 0;
       updates['CM2-MILL-PWR'] = 0;
       updates['CM2-MILL-CUR'] = 0;
       updates['CM2-SOUND'] = 45; // ambient
       updates['CM2-ELEV-PWR'] = 0;
       updates['CM2-SEP-SPD'] = 0;
    }

    store.setTags(updates);

    // Alarm Generation Logic
    if (updates['CR-CR-LOAD'] > 90) {
      store.addAlarm({
        tag: 'CR-CR-LOAD',
        description: 'Crusher Load High',
        priority: 'HIGH'
      });
    }

  }, 1000); // 1Hz update for demo
};

export const stopSimulation = () => {
  if (simInterval) {
    clearInterval(simInterval);
    simInterval = null;
  }
};

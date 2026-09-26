import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ScadaShell } from '../components/scada/Layout/ScadaShell';
import { PlantOverviewScreen } from '../screens/Overview/PlantOverviewScreen';
import { LimestoneCrusherScreen } from '../screens/Crusher/LimestoneCrusherScreen';
import { RawMillScreen } from '../screens/RawMill/RawMillScreen';
import { CoalMillScreen } from '../screens/CoalMill/CoalMillScreen';
import { KilnScreen } from '../screens/Kiln/KilnScreen';
import { CoolerScreen } from '../screens/Cooler/CoolerScreen';
import { ClinkerTransportScreen } from '../screens/ClinkerTransport/ClinkerTransportScreen';
import { CementMillScreen } from '../screens/CementMill/CementMillScreen';
import { WHRSPowerScreen } from '../screens/Power/WHRSPowerScreen';
import { PackingDispatchScreen } from '../screens/Packing/PackingDispatchScreen';
import { HistorianScreen } from '../screens/Historian/HistorianScreen';
import { AlarmsScreen } from '../screens/Alarms/AlarmsScreen';
import { EquipmentFaceplateModal } from '../components/scada/Modals/EquipmentFaceplateModal';
import { scadaEngine } from '../engine/scadaEngine';

// Area normalization helper: handles codes ('CR', 'RM1') and full names ('CRUSHER', 'RAW MILL', 'FAN')
export const normalizeArea = (raw: string | null | undefined): string => {
  if (!raw) return 'HOME';
  const u = raw.toUpperCase().trim();
  if (['HOME', 'OVERVIEW', 'PLANT', 'ALL', 'PID'].includes(u)) return 'HOME';
  if (['CR', 'CRUSHER', 'CRU', 'LIMESTONE'].includes(u)) return 'CR';
  if (['RM1', 'RAW MILL', 'RM', 'RAW MILL FAN', 'FAN', 'VRM', 'RAW_MILL'].includes(u)) return 'RM1';
  if (['CM1', 'COAL MILL', 'COAL'].includes(u)) return 'CM1';
  if (['KILN', 'ROTARY KILN', 'PREHEATER'].includes(u)) return 'KILN';
  if (['COOLER', 'CLR'].includes(u)) return 'COOLER';
  if (['CT1', 'CLINKER', 'CLINKER TRANSPORT'].includes(u)) return 'CT1';
  if (['CM2', 'CEMENT MILL', 'CM', 'BALL MILL', 'CEMENT_MILL'].includes(u)) return 'CM2';
  if (['POWER', 'WHRS', 'CPP'].includes(u)) return 'POWER';
  if (['PACKING', 'DISPATCH', 'PACK'].includes(u)) return 'PACKING';
  if (u === 'HISTORIAN') return 'HISTORIAN';
  if (u === 'ALARMS') return 'ALARMS';
  return u;
};

const DigitalTwin: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParam = searchParams.get('area') || location.state?.activeArea;
  const [activeArea, setActiveArea] = useState<string>(() => normalizeArea(initialParam));
  const [selectedEqId, setSelectedEqId] = useState<string | null>(null);

  // Initialize continuous physical simulation engine on mount
  useEffect(() => {
    scadaEngine.init();
  }, []);

  useEffect(() => {
    const target = searchParams.get('area') || location.state?.activeArea;
    if (target) {
      setActiveArea(normalizeArea(target));
    }
  }, [searchParams, location.state]);

  const handleAreaChange = (area: string) => {
    const normalized = normalizeArea(area);
    setActiveArea(normalized);
    setSearchParams({ area: normalized });
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <ScadaShell activeArea={activeArea} setActiveArea={handleAreaChange}>
        {activeArea === 'HOME' && (
          <PlantOverviewScreen 
            onNavigateArea={handleAreaChange} 
            onOpenFaceplate={setSelectedEqId} 
          />
        )}
        {activeArea === 'CR' && (
          <LimestoneCrusherScreen onOpenFaceplate={setSelectedEqId} />
        )}
        {activeArea === 'RM1' && (
          <RawMillScreen onOpenFaceplate={setSelectedEqId} />
        )}
        {activeArea === 'CM1' && (
          <CoalMillScreen onOpenFaceplate={setSelectedEqId} />
        )}
        {activeArea === 'KILN' && (
          <KilnScreen onOpenFaceplate={setSelectedEqId} />
        )}
        {activeArea === 'COOLER' && (
          <CoolerScreen onOpenFaceplate={setSelectedEqId} />
        )}
        {activeArea === 'CT1' && (
          <ClinkerTransportScreen onOpenFaceplate={setSelectedEqId} />
        )}
        {activeArea === 'CM2' && (
          <CementMillScreen onOpenFaceplate={setSelectedEqId} />
        )}
        {activeArea === 'POWER' && (
          <WHRSPowerScreen onOpenFaceplate={setSelectedEqId} />
        )}
        {activeArea === 'PACKING' && (
          <PackingDispatchScreen onOpenFaceplate={setSelectedEqId} />
        )}
        {activeArea === 'HISTORIAN' && (
          <HistorianScreen />
        )}
        {activeArea === 'ALARMS' && (
          <AlarmsScreen />
        )}
      </ScadaShell>

      {/* GLOBAL DCS EQUIPMENT FACEPLATE MODAL */}
      <EquipmentFaceplateModal 
        equipmentId={selectedEqId} 
        onClose={() => setSelectedEqId(null)} 
      />
    </div>
  );
};

export default DigitalTwin;

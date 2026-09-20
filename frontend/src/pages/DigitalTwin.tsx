import React, { useState } from 'react';
import { ScadaShell } from '../components/scada/Layout/ScadaShell';
import { LimestoneCrusherScreen } from '../screens/Crusher/LimestoneCrusherScreen';
import { RawMillScreen } from '../screens/RawMill/RawMillScreen';
import { CoalMillScreen } from '../screens/CoalMill/CoalMillScreen';
import { KilnScreen } from '../screens/Kiln/KilnScreen';
import { CoolerScreen } from '../screens/Cooler/CoolerScreen';
import { ClinkerTransportScreen } from '../screens/ClinkerTransport/ClinkerTransportScreen';
import { CementMillScreen } from '../screens/CementMill/CementMillScreen';
import { HistorianScreen } from '../screens/Historian/HistorianScreen';
import { AlarmsScreen } from '../screens/Alarms/AlarmsScreen';
import { Settings } from 'lucide-react';

const DigitalTwin: React.FC = () => {
  const [activeArea, setActiveArea] = useState('CR');

  return (
    <ScadaShell activeArea={activeArea} setActiveArea={setActiveArea}>
      {activeArea === 'CR' && <LimestoneCrusherScreen />}
      {activeArea === 'RM1' && <RawMillScreen />}
      {activeArea === 'CM1' && <CoalMillScreen />}
      {activeArea === 'KILN' && <KilnScreen />}
      {activeArea === 'COOLER' && <CoolerScreen />}
      {activeArea === 'CT1' && <ClinkerTransportScreen />}
      {activeArea === 'CM2' && <CementMillScreen />}
      {activeArea === 'HISTORIAN' && <HistorianScreen />}
      {activeArea === 'ALARMS' && <AlarmsScreen />}
      
      {!['CR', 'RM1', 'CM1', 'KILN', 'COOLER', 'CT1', 'CM2', 'HISTORIAN', 'ALARMS'].includes(activeArea) && (
        <div className="flex items-center justify-center h-full text-gray-500">
           <div className="text-center">
              <Settings size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl">Next Phase: Build {activeArea} using the SCADA Component Library</p>
           </div>
        </div>
      )}
    </ScadaShell>
  );
};

export default DigitalTwin;

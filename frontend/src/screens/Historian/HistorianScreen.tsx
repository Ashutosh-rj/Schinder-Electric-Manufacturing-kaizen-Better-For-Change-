import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useScadaStore } from '../../store/scadaStore';

export const HistorianScreen = () => {
  const history = useScadaStore(s => s.history);
  const tags = useScadaStore(s => Object.keys(s.tags));
  
  const [selectedTags, setSelectedTags] = useState<string[]>(['KLN1-BZ-TEMP', 'KLN1-FEED', 'CM1-INJ-KILN']);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const option = useMemo(() => {
    const series = selectedTags.map(tag => ({
      name: tag,
      type: 'line',
      showSymbol: false,
      smooth: true,
      yAxisIndex: tag.includes('TEMP') ? 0 : 1,
      data: (history[tag] || []).map(dp => [dp.time, dp.value]),
    }));

    return {
      backgroundColor: '#0f172a',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: selectedTags,
        textStyle: { color: '#94a3b8' },
        top: 10
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        axisLabel: { color: '#94a3b8' },
        splitLine: { show: true, lineStyle: { color: '#1e293b' } }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Temperature / Press / Freq',
          position: 'left',
          axisLabel: { color: '#ef4444' },
          nameTextStyle: { color: '#ef4444' },
          splitLine: { show: true, lineStyle: { color: '#1e293b' } }
        },
        {
          type: 'value',
          name: 'Rates / Loads / Levels',
          position: 'right',
          axisLabel: { color: '#00d4ff' },
          nameTextStyle: { color: '#00d4ff' },
          splitLine: { show: false }
        }
      ],
      series,
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { start: 0, end: 100, textStyle: { color: '#fff' } }
      ],
      animation: false
    };
  }, [history, selectedTags]);

  return (
    <div className="flex w-full h-full bg-[#1e293b] text-white">
      {/* Sidebar - Tag Selector */}
      <div className="w-[300px] bg-[#0f172a] border-r border-gray-700 flex flex-col h-full">
        <div className="p-4 border-b border-gray-700 font-bold text-[#00d4ff]">
          HISTORIAN TAGS
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {tags.sort().map(tag => (
            <div 
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`p-2 text-xs font-mono cursor-pointer border border-transparent rounded hover:bg-[#1e293b] flex justify-between items-center ${
                selectedTags.includes(tag) ? 'bg-[#1e293b] border-gray-600' : ''
              }`}
            >
              <span>{tag}</span>
              {selectedTags.includes(tag) && (
                <div className="w-2 h-2 rounded-full bg-[#00ff00]" />
              )}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
          Select up to 5 tags to trend simultaneously.
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 flex flex-col p-4 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">REAL-TIME TREND</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-[#020617] border border-gray-600 rounded text-xs">Export CSV</button>
            <button className="px-3 py-1 bg-[#020617] border border-gray-600 rounded text-xs">Print</button>
          </div>
        </div>
        <div className="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg shadow-inner overflow-hidden">
           <ReactECharts 
             option={option} 
             style={{ height: '100%', width: '100%' }} 
             notMerge={false}
             lazyUpdate={true}
           />
        </div>
      </div>
    </div>
  );
};

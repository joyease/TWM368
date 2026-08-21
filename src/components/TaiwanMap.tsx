import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { SmallPeak, Region } from '../types';
import { 
  Eye, 
  RotateCcw, 
  MapPin,
  Compass
} from 'lucide-react';

interface TaiwanMapProps {
  peaks: SmallPeak[];
  completedPeakIds: Set<number>;
  selectedPeak: SmallPeak | null;
  onSelectPeak: (peak: SmallPeak) => void;
  onToggleComplete: (peakId: number) => void;
}

// Clean, plain map tile layers
const BASEMAP_TILES = {
  plainCounty: {
    name: '素面地圖',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18
  },
  minimalClean: {
    name: '極簡白底',
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18
  }
};

type BasemapStyle = keyof typeof BASEMAP_TILES;

export const TaiwanMap: React.FC<TaiwanMapProps> = ({
  peaks,
  completedPeakIds,
  selectedPeak,
  onSelectPeak,
  onToggleComplete
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [showLabels, setShowLabels] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'uncompleted'>('all');
  const [selectedRegion, setSelectedRegion] = useState<Region | '全部'>('全部');
  const [mapStyle, setMapStyle] = useState<BasemapStyle>('plainCounty');

  // Filter visible peaks
  const visiblePeaks = useMemo(() => {
    return peaks.filter((p) => {
      const isCompleted = completedPeakIds.has(p.id);
      if (filterMode === 'completed' && !isCompleted) return false;
      if (filterMode === 'uncompleted' && isCompleted) return false;
      if (selectedRegion !== '全部' && p.region !== selectedRegion) return false;
      return true;
    });
  }, [peaks, completedPeakIds, filterMode, selectedRegion]);

  // Regional completion statistics
  const regionList: Region[] = ['基隆', '台北', '新北', '桃園', '新竹', '苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'];
  const regionStats = useMemo(() => {
    return regionList.map((r) => {
      const regionPeaks = peaks.filter((p) => p.region === r);
      const done = regionPeaks.filter((p) => completedPeakIds.has(p.id)).length;
      return {
        region: r,
        total: regionPeaks.length,
        completed: done,
        percentage: regionPeaks.length > 0 ? Math.round((done / regionPeaks.length) * 100) : 0
      };
    });
  }, [peaks, completedPeakIds]);

  // Initialize Clean Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [23.75, 120.95],
        zoom: 8,
        minZoom: 6,
        maxZoom: 18,
        zoomControl: false
      });

      // Add Clean Plain Basemap
      const initialLayerConfig = BASEMAP_TILES[mapStyle];
      const layer = L.tileLayer(initialLayerConfig.url, {
        attribution: initialLayerConfig.attribution,
        maxZoom: initialLayerConfig.maxZoom,
        subdomains: 'abc'
      }).addTo(map);

      tileLayerRef.current = layer;

      // Add Layer Group for spot pins
      const markersGroup = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap Layer when mapStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const currentLayerConfig = BASEMAP_TILES[mapStyle];
    const newLayer = L.tileLayer(currentLayerConfig.url, {
      attribution: currentLayerConfig.attribution,
      maxZoom: currentLayerConfig.maxZoom,
      subdomains: 'abc'
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapStyle]);

  // Update Circle Pins and Pure Text Labels
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

    const group = markersLayerGroupRef.current;
    group.clearLayers();

    visiblePeaks.forEach((peak) => {
      const isCompleted = completedPeakIds.has(peak.id);
      const isSelected = selectedPeak?.id === peak.id;

      // Crisp white halo text shadow for clean plain background
      const textShadow = '1px 1px 2px #fff, -1px -1px 2px #fff, 1px -1px 2px #fff, -1px 1px 2px #fff, 0 0 3px #fff, 0 0 5px #fff';
      const textColor = isCompleted ? '#854D0E' : '#1e293b';

      const iconHtml = `
        <div class="group relative flex items-center cursor-pointer select-none" style="transform: translate(-10px, -10px); width: max-content;">
          <!-- Pin Circle -->
          <div class="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-125 ${
            isSelected ? 'scale-125' : ''
          }">
            ${
              isCompleted
                ? `
                <!-- Completed: Solid Radiant Golden (#FFD700) Pin -->
                <div style="
                  width: ${isSelected ? '22px' : '18px'}; 
                  height: ${isSelected ? '22px' : '18px'}; 
                  border-radius: 50%; 
                  background: #FFD700; 
                  border: 2px solid #002654; 
                  box-shadow: 0 0 8px #FFD700, 0 1px 4px rgba(0,0,0,0.3);
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                ">
                  <div style="width: 5px; height: 5px; border-radius: 50%; background: #ffffff;"></div>
                </div>
                `
                : `
                <!-- Uncompleted: Clean Hollow Ring with Center Dot -->
                <div style="
                  width: ${isSelected ? '18px' : '14px'}; 
                  height: ${isSelected ? '18px' : '14px'}; 
                  border-radius: 50%; 
                  background: rgba(255, 255, 255, 0.85); 
                  border: 2px solid #0055A4; 
                  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                ">
                  <div style="width: 3.5px; height: 3.5px; border-radius: 50%; background: #0055A4;"></div>
                </div>
                `
            }
            ${
              isSelected
                ? `<div style="
                    position: absolute; 
                    inset: -5px; 
                    border-radius: 50%; 
                    border: 2px solid #EAB308; 
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                   "></div>`
                : ''
            }
          </div>

          <!-- Spot & District Name Text -->
          ${
            showLabels || isSelected
              ? `
              <span style="
                margin-left: 6px; 
                font-size: ${isSelected ? '12px' : '11px'}; 
                font-weight: ${isCompleted || isSelected ? '800' : '700'}; 
                color: ${textColor}; 
                text-shadow: ${textShadow}; 
                white-space: nowrap; 
                pointer-events: none;
                letter-spacing: 0.02em;
                line-height: 1;
              ">
                <span style="color: ${isCompleted ? '#B45309' : '#0055A4'}; font-size: 10px;">[${peak.region}·${peak.district}]</span> ${peak.name.split(' / ')[0]}
              </span>
              `
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'taiwan-peak-marker',
        html: iconHtml,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([peak.lat, peak.lng], { icon: customIcon });

      // Click to select peak and open detail
      marker.on('click', () => {
        onSelectPeak(peak);
      });

      // Double click to toggle completion status
      marker.on('dblclick', (e) => {
        L.DomEvent.stopPropagation(e);
        onToggleComplete(peak.id);
      });

      // Clean, high readability popup
      marker.bindPopup(`
        <div style="font-family: inherit; padding: 2px; min-width: 190px;">
          <div style="display: flex; items-center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-weight: 800; color: #002654; font-size: 13px;">${peak.county} ${peak.district}</span>
            <span style="
              font-size: 10px; 
              font-weight: bold; 
              padding: 2px 6px; 
              border-radius: 9999px; 
              background: ${isCompleted ? '#FEF08A' : '#F1F5F9'}; 
              color: ${isCompleted ? '#854D0E' : '#475569'};
            ">
              ${isCompleted ? '✓ 已打卡' : '未打卡'}
            </span>
          </div>
          <div style="font-size: 12px; color: #334155; line-height: 1.4;">
            <div><strong>景點：</strong>${peak.name}</div>
            <div><strong>代碼：</strong>${peak.townshipCode}</div>
            <div><strong>來源：</strong>${peak.govSource}</div>
            ${peak.highlight ? `<div style="margin-top: 4px; color: #166534; font-size: 11px;">💡 ${peak.highlight}</div>` : ''}
          </div>
        </div>
      `, {
        closeButton: false,
        offset: [0, -10]
      });

      group.addLayer(marker);
    });
  }, [visiblePeaks, completedPeakIds, selectedPeak, showLabels, mapStyle, onSelectPeak, onToggleComplete]);

  // Center on selected peak when changed
  useEffect(() => {
    if (selectedPeak && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedPeak.lat, selectedPeak.lng], 13, {
        duration: 1.0
      });
    }
  }, [selectedPeak]);

  // Handle Region Switching
  const handleRegionClick = (reg: Region | '全部') => {
    setSelectedRegion(reg);
    if (reg !== '全部') {
      setShowLabels(true); // 選擇縣市查詢後才顯示地名標籤
    } else {
      setShowLabels(false);
    }
    if (!mapInstanceRef.current) return;

    if (reg === '基隆') {
      mapInstanceRef.current.flyTo([25.13, 121.74], 12, { duration: 0.8 });
    } else if (reg === '台北') {
      mapInstanceRef.current.flyTo([25.06, 121.54], 11.5, { duration: 0.8 });
    } else if (reg === '新北') {
      mapInstanceRef.current.flyTo([25.04, 121.50], 10, { duration: 0.8 });
    } else if (reg === '桃園') {
      mapInstanceRef.current.flyTo([24.96, 121.25], 10.5, { duration: 0.8 });
    } else if (reg === '新竹') {
      mapInstanceRef.current.flyTo([24.75, 121.08], 10.5, { duration: 0.8 });
    } else if (reg === '苗栗') {
      mapInstanceRef.current.flyTo([24.52, 120.85], 10.5, { duration: 0.8 });
    } else if (reg === '台中') {
      mapInstanceRef.current.flyTo([24.22, 120.72], 10, { duration: 0.8 });
    } else if (reg === '彰化') {
      mapInstanceRef.current.flyTo([23.98, 120.48], 10.5, { duration: 0.8 });
    } else if (reg === '南投') {
      mapInstanceRef.current.flyTo([23.85, 120.95], 9.8, { duration: 0.8 });
    } else if (reg === '雲林') {
      mapInstanceRef.current.flyTo([23.70, 120.38], 10.5, { duration: 0.8 });
    } else if (reg === '嘉義') {
      mapInstanceRef.current.flyTo([23.48, 120.45], 10.2, { duration: 0.8 });
    } else if (reg === '台南') {
      mapInstanceRef.current.flyTo([23.15, 120.30], 10, { duration: 0.8 });
    } else if (reg === '高雄') {
      mapInstanceRef.current.flyTo([22.82, 120.48], 10, { duration: 0.8 });
    } else if (reg === '屏東') {
      mapInstanceRef.current.flyTo([22.45, 120.60], 9.5, { duration: 0.8 });
    } else if (reg === '宜蘭') {
      mapInstanceRef.current.flyTo([24.68, 121.75], 10, { duration: 0.8 });
    } else if (reg === '花蓮') {
      mapInstanceRef.current.flyTo([23.80, 121.45], 9.5, { duration: 0.8 });
    } else if (reg === '台東') {
      mapInstanceRef.current.flyTo([22.80, 121.15], 9.5, { duration: 0.8 });
    } else if (reg === '澎湖') {
      mapInstanceRef.current.flyTo([23.55, 119.58], 10.5, { duration: 0.8 });
    } else if (reg === '金門') {
      mapInstanceRef.current.flyTo([24.45, 118.35], 11, { duration: 0.8 });
    } else if (reg === '馬祖') {
      mapInstanceRef.current.flyTo([26.18, 119.95], 10.5, { duration: 0.8 });
    } else {
      resetView();
    }
  };

  const resetView = () => {
    setSelectedRegion('全部');
    setShowLabels(false);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([23.75, 120.95], 8, { duration: 0.8 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-5 mb-6 relative">
      {/* Streamlined Mobile-Friendly Map Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 text-xs">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              全部 ({peaks.length})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                filterMode === 'completed'
                  ? 'bg-[#0055A4] text-white shadow-xs'
                  : 'text-[#0055A4] hover:text-[#002654]'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-[#FFD700] border border-[#002654]"></div>
              已打卡 ({completedPeakIds.size})
            </button>
            <button
              onClick={() => setFilterMode('uncompleted')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                filterMode === 'uncompleted'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="w-2 h-2 rounded-full border border-slate-400 bg-white/70"></div>
              未打卡 ({peaks.length - completedPeakIds.size})
            </button>
          </div>

          {/* Toggle Spot Name Labels */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2.5 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1 font-bold ${
              showLabels
                ? 'bg-blue-50 text-[#002654] border-blue-300'
                : 'bg-white text-slate-600 border-slate-300'
            }`}
            title="開關景點名稱標籤"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showLabels ? '顯示地名' : '隱藏地名'}</span>
          </button>
        </div>

        {/* Zoom & Quick Region Reset Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Basemap Style Switcher */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
            {(['plainCounty', 'minimalClean'] as const).map((styleKey) => (
              <button
                key={styleKey}
                onClick={() => setMapStyle(styleKey)}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${
                  mapStyle === styleKey ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {BASEMAP_TILES[styleKey].name}
              </button>
            ))}
          </div>

          {/* Map Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={handleZoomIn}
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition font-bold cursor-pointer"
              title="放大"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition font-bold cursor-pointer"
              title="縮小"
            >
              -
            </button>
            <button
              onClick={resetView}
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition cursor-pointer"
              title="重設全區視角"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Regional Quick Select Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2.5 mb-3 text-xs border-b border-slate-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
          <Compass className="w-3 h-3 text-[#0055A4]" />
          縣市聚焦:
        </span>
        {(['全部', '基隆', '台北', '新北', '桃園', '新竹', '苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'] as const).map((reg) => (
          <button
            key={reg}
            onClick={() => handleRegionClick(reg)}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              selectedRegion === reg
                ? 'bg-[#0055A4] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {reg} {reg !== '全部' && `(${peaks.filter(p => p.region === reg).length})`}
          </button>
        ))}
      </div>

      {/* Main Interactive Map Viewport */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-[#F4F6F8] h-[540px] sm:h-[680px] z-0">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full"
        />

        {/* Clean Compact Legend (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md z-[1000] text-[11px] space-y-1.5 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FFD700] border-2 border-[#002654] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white"></div>
            </div>
            <span className="text-slate-800 font-bold">已打卡景點 ({completedPeakIds.size})</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#0055A4] bg-white/90 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#0055A4]"></div>
            </div>
            <span className="text-slate-600 font-medium">未打卡 ({peaks.length - completedPeakIds.size})</span>
          </div>
        </div>
      </div>

      {/* Regional Progress Summary Footer Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {regionStats.map((item) => (
          <div
            key={item.region}
            onClick={() => handleRegionClick(item.region)}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              selectedRegion === item.region
                ? 'bg-blue-50 border-[#0055A4] shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-slate-600 mb-1">
              <span className="font-bold text-slate-800 text-[11px]">{item.region}</span>
              <span className="font-mono text-[#0055A4] font-bold text-[11px]">
                {item.completed}/{item.total}
              </span>
            </div>
            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0055A4] rounded-full transition-all duration-300"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

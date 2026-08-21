import React, { useState, useMemo } from 'react';
import { SmallPeak, Region } from '../types';
import { Search, CheckCircle2, Circle, MapPin, ExternalLink, SlidersHorizontal, ArrowUpDown, Compass, Layers, RotateCcw } from 'lucide-react';

interface PeaksListProps {
  peaks: SmallPeak[];
  completedPeakIds: Set<number>;
  selectedPeak: SmallPeak | null;
  onSelectPeak: (peak: SmallPeak) => void;
  onToggleComplete: (peakId: number) => void;
}

export const PeaksList: React.FC<PeaksListProps> = ({
  peaks,
  completedPeakIds,
  selectedPeak,
  onSelectPeak,
  onToggleComplete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region | '全部'>('全部');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'uncompleted'>('all');
  const [sortBy, setSortBy] = useState<'code' | 'county' | 'district' | 'name'>('code');
  const [viewLayout, setViewLayout] = useState<'matrix' | 'grouped' | 'cards'>('matrix');
  const [isExpandedAll, setIsExpandedAll] = useState<boolean>(false);

  // Determine whether an active search/filter/expansion query is active
  const hasActiveQuery = isExpandedAll || selectedRegion !== '全部' || searchQuery.trim() !== '' || filterStatus !== 'all';

  // Filtered and sorted spots
  const filteredPeaks = useMemo(() => {
    return peaks
      .filter((peak) => {
        // Status filter
        const isDone = completedPeakIds.has(peak.id);
        if (filterStatus === 'completed' && !isDone) return false;
        if (filterStatus === 'uncompleted' && isDone) return false;

        // Region filter
        if (selectedRegion !== '全部' && peak.region !== selectedRegion) return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const matchName = peak.name.toLowerCase().includes(q);
          const matchDistrict = peak.district.toLowerCase().includes(q);
          const matchCounty = peak.county.toLowerCase().includes(q);
          const matchCode = peak.townshipCode.includes(q);
          const matchGov = peak.govSource.toLowerCase().includes(q);
          if (!matchName && !matchDistrict && !matchCounty && !matchCode && !matchGov) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'county') return a.county.localeCompare(b.county, 'zh-Hant');
        if (sortBy === 'district') return a.district.localeCompare(b.district, 'zh-Hant');
        if (sortBy === 'name') return a.name.localeCompare(b.name, 'zh-Hant');
        return a.id - b.id;
      });
  }, [peaks, completedPeakIds, filterStatus, selectedRegion, searchQuery, sortBy]);

  // Grouped by region for "grouped" view
  const regionsOrder: Region[] = ['基隆', '台北', '新北', '桃園', '新竹', '苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'];
  const groupedPeaks = useMemo(() => {
    return regionsOrder.map((reg) => ({
      region: reg,
      list: filteredPeaks.filter((p) => p.region === reg)
    })).filter((group) => group.list.length > 0);
  }, [filteredPeaks]);

  const handleResetQuery = () => {
    setSearchQuery('');
    setSelectedRegion('全部');
    setFilterStatus('all');
    setIsExpandedAll(false);
  };

  return (
    <section id="taiwan-spots-section" className="bg-white rounded-[1.5rem] p-5 sm:p-7 shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">
              鄉鎮區景點打卡明細
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0055A4] text-white font-bold">
              {completedPeakIds.size} / {peaks.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            涵蓋基隆 (7)、台北 (12)、新北 (29)、桃園 (13)、新竹 (16)、苗栗 (18)、台中 (29)、彰化 (26)、南投 (13)、雲林 (20)、嘉義 (20)、台南 (37)、高雄 (38)、屏東 (33)、宜蘭 (12)、花蓮 (13)、台東 (16)、澎湖 (6)、金門 (6)、馬祖 (4) 共 {peaks.length} 個鄉鎮區景點
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-4 text-[10px] font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-[#002654] border border-[#001A3B]"></div>
              <span className="text-slate-700">已打卡 ({completedPeakIds.size})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300"></div>
              <span className="text-slate-400">未完成 ({peaks.length - completedPeakIds.size})</span>
            </div>
          </div>

          {hasActiveQuery && (
            <button
              onClick={handleResetQuery}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
              title="收合並重設為預設不顯示"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>收合資料 / 重設查詢</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="my-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋縣市、鄉鎮區、景點名稱、代碼 (如 6500100)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0055A4] focus:bg-white focus:ring-2 focus:ring-[#0055A4]/20 text-slate-800 placeholder:text-slate-400 outline-none text-xs font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              全部 ({peaks.length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer text-[#0055A4] ${
                filterStatus === 'completed'
                  ? 'bg-[#0055A4] text-white shadow-xs'
                  : 'hover:bg-slate-200'
              }`}
            >
              ✓ 已打卡 ({completedPeakIds.size})
            </button>
            <button
              onClick={() => setFilterStatus('uncompleted')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterStatus === 'uncompleted'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              未完成 ({peaks.length - completedPeakIds.size})
            </button>
          </div>

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value as Region | '全部')}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold focus:border-[#0055A4] outline-none cursor-pointer"
          >
            <option value="全部">全部縣市 ({peaks.length}區)</option>
            <option value="基隆">基隆市 (7區)</option>
            <option value="台北">台北市 (12區)</option>
            <option value="新北">新北市 (29區)</option>
            <option value="桃園">桃園市 (13區)</option>
            <option value="新竹">新竹縣市 (16區)</option>
            <option value="苗栗">苗栗縣 (18區)</option>
            <option value="台中">台中市 (29區)</option>
            <option value="彰化">彰化縣 (26區)</option>
            <option value="南投">南投縣 (13區)</option>
            <option value="雲林">雲林縣 (20區)</option>
            <option value="嘉義">嘉義縣市 (20區)</option>
            <option value="台南">台南市 (37區)</option>
            <option value="高雄">高雄市 (38區)</option>
            <option value="屏東">屏東縣 (33區)</option>
            <option value="宜蘭">宜蘭縣 (12區)</option>
            <option value="花蓮">花蓮縣 (13區)</option>
            <option value="台東">台東縣 (16區)</option>
            <option value="澎湖">澎湖縣 (6區)</option>
            <option value="金門">金門縣 (6區)</option>
            <option value="馬祖">連江縣/馬祖 (4區)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold focus:border-[#0055A4] outline-none cursor-pointer"
          >
            <option value="code">編號代碼順序</option>
            <option value="county">縣市順序</option>
            <option value="district">鄉鎮區名稱</option>
            <option value="name">景點名稱</option>
          </select>

          {/* Layout Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewLayout('matrix')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                viewLayout === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="高密度矩陣"
            >
              高密度矩陣
            </button>
            <button
              onClick={() => setViewLayout('grouped')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                viewLayout === 'grouped' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="按縣市群組"
            >
              縣市表
            </button>
            <button
              onClick={() => setViewLayout('cards')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                viewLayout === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="詳細卡片"
            >
              卡片
            </button>
          </div>
        </div>
      </div>

      {/* Query-Driven Content: Only shown after query or explicit expansion to save bandwidth */}
      {!hasActiveQuery ? (
        <div className="py-8 px-4 sm:px-6 bg-slate-50/70 rounded-2xl border border-dashed border-slate-300 text-center my-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0055A4]/10 text-[#0055A4] flex items-center justify-center mx-auto mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h5 className="font-extrabold text-slate-800 text-base mb-1">
            鄉鎮區景點資料查詢
          </h5>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            預設不直接載入 368 筆大量資料以節省流量。請點選下方縣市快速查詢、在上方輸入關鍵字，或點擊按鈕展開明細：
          </p>

          {/* Quick County Select Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto mb-5">
            {regionsOrder.map((reg) => {
              const count = peaks.filter((p) => p.region === reg).length;
              return (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white hover:bg-[#002654] hover:text-white text-slate-700 border border-slate-200 shadow-xs transition cursor-pointer active:scale-95"
                >
                  {reg} ({count})
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsExpandedAll(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002654] hover:bg-[#001736] text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95 border border-[#001736]"
          >
            <Layers className="w-4 h-4" />
            <span>展開顯示全台 368 區景點明細</span>
          </button>
        </div>
      ) : (
        /* Render spots based on layout */
        filteredPeaks.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
            <MapPin className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-600">無符合條件之景點</p>
          </div>
        ) : viewLayout === 'matrix' ? (
          /* ================= HIGH DENSITY MATRIX ================= */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-2">
            {filteredPeaks.map((peak) => {
              const isCompleted = completedPeakIds.has(peak.id);
              const isSelected = selectedPeak?.id === peak.id;
              return (
                <div
                  key={peak.id}
                  onClick={() => onSelectPeak(peak)}
                  onDoubleClick={() => onToggleComplete(peak.id)}
                  className={`p-2.5 rounded-xl text-xs transition cursor-pointer select-none relative group border ${
                    isCompleted
                      ? 'bg-[#002654] text-white font-bold border-[#001A3B] shadow-xs hover:bg-[#001D40]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border-slate-200'
                  } ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-1 z-10' : ''}`}
                  title={`[${peak.region}·${peak.district}] ${peak.name} - 點擊查看詳情，雙擊切換打卡狀態`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className={`font-mono font-bold ${isCompleted ? 'text-yellow-300' : 'text-[#0055A4]'}`}>
                      {peak.district}
                    </span>
                    <span className={`text-[9px] ${isCompleted ? 'text-blue-200' : 'text-slate-400'}`}>
                      {peak.townshipCode.slice(-4)}
                    </span>
                  </div>
                  <p className="truncate text-xs font-bold leading-snug">
                    {peak.name.split(' / ')[0]}
                  </p>
                </div>
              );
            })}
          </div>
        ) : viewLayout === 'grouped' ? (
          /* ================= GROUPED VIEW ================= */
          <div className="space-y-4 pt-2">
            {groupedPeaks.map((group) => {
              const groupDone = group.list.filter((p) => completedPeakIds.has(p.id)).length;
              const countyName = group.list[0]?.county || group.region;
              return (
                <div key={group.region} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0055A4]"></div>
                      <h5 className="font-extrabold text-slate-800 text-sm">
                        {countyName}
                      </h5>
                      <span className="text-[11px] text-slate-400 font-medium">({group.list.length} 個鄉鎮市區)</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#0055A4] bg-[#0055A4]/10 px-2.5 py-0.5 rounded-full">
                      {groupDone} / {group.list.length} 已打卡
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {group.list.map((peak) => {
                      const isCompleted = completedPeakIds.has(peak.id);
                      const isSelected = selectedPeak?.id === peak.id;
                      return (
                        <div
                          key={peak.id}
                          onClick={() => onSelectPeak(peak)}
                          className={`p-3 rounded-xl text-xs transition cursor-pointer select-none border ${
                            isCompleted
                              ? 'bg-[#002654] text-white border-[#001A3B] shadow-xs'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          } ${isSelected ? 'ring-2 ring-yellow-400' : ''}`}
                        >
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className={`font-bold ${isCompleted ? 'text-yellow-300' : 'text-[#0055A4]'}`}>
                              {peak.district}
                            </span>
                            <span className={`text-[9px] ${isCompleted ? 'text-blue-200' : 'text-slate-400'}`}>
                              {peak.govSource.includes('TDX') ? 'TDX' : '統計據點'}
                            </span>
                          </div>
                          <p className="font-bold line-clamp-2 text-xs leading-snug">{peak.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= DETAILED CARDS VIEW ================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-2">
            {filteredPeaks.map((peak) => (
              <SpotCard
                key={peak.id}
                peak={peak}
                isCompleted={completedPeakIds.has(peak.id)}
                isSelected={selectedPeak?.id === peak.id}
                onSelect={() => onSelectPeak(peak)}
                onToggle={() => onToggleComplete(peak.id)}
              />
            ))}
          </div>
        )
      )}
    </section>
  );
};

/* Individual Spot Card */
interface SpotCardProps {
  peak: SmallPeak;
  isCompleted: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}

const SpotCard: React.FC<SpotCardProps> = ({
  peak,
  isCompleted,
  isSelected,
  onSelect,
  onToggle
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border select-none ${
        isCompleted
          ? 'bg-[#002654] text-white border-[#001A3B] shadow-md'
          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
      } ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
              isCompleted ? 'bg-[#001A3B] text-yellow-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {peak.county} {peak.district}
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              isCompleted ? 'bg-blue-900/50 text-blue-200' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {peak.townshipCode}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold transition cursor-pointer ${
            isCompleted
              ? 'bg-[#001A3B] text-yellow-300 border border-yellow-400/30'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200'
          }`}
          title={isCompleted ? '點擊取消打卡' : '點擊標記為已打卡'}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-yellow-300" />
              <span>已打卡</span>
            </>
          ) : (
            <>
              <Circle className="w-3 h-3 text-slate-400" />
              <span>未打卡</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-1">
        <h5 className="text-sm font-extrabold leading-snug">
          {peak.name}
        </h5>
        {peak.highlight && (
          <p className={`text-xs line-clamp-2 mt-1.5 leading-relaxed ${isCompleted ? 'text-blue-100' : 'text-slate-500'}`}>
            {peak.highlight}
          </p>
        )}
      </div>

      <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
        isCompleted ? 'border-blue-900/60 text-blue-100' : 'border-slate-100 text-slate-500'
      }`}>
        <div className="flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{peak.county}</span>
        </div>
        <span className={`px-2 py-0.5 rounded font-medium text-[10px] ${
          isCompleted ? 'bg-[#001A3B] text-yellow-300' : 'bg-slate-100 text-slate-600'
        }`}>
          {peak.govSource}
        </span>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Search, UserCheck, Award, X, Mail, UserPlus, MapPin, ExternalLink } from 'lucide-react';
import { findHikerByGmail } from '../data/membersData';
import { HikerProfile } from '../types';

interface NicknameSearchProps {
  currentProfile: HikerProfile | null;
  totalSpots?: number;
  onSelectHiker: (profile: HikerProfile) => void;
  onOpenCertificate: () => void;
  onResetToDefault: () => void;
}

export const NicknameSearch: React.FC<NicknameSearchProps> = ({
  currentProfile,
  totalSpots = 368,
  onSelectHiker,
  onOpenCertificate,
  onResetToDefault
}) => {
  const [inputValue, setInputValue] = useState('');
  const [searchFeedback, setSearchFeedback] = useState<{
    type: 'success' | 'newProfile' | 'idle';
    message: string;
  }>({ type: 'idle', message: '' });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputValue.trim();
    if (!query) {
      setSearchFeedback({
        type: 'idle',
        message: '請輸入 Gmail 進行查詢'
      });
      return;
    }

    const matched = findHikerByGmail(query);

    if (matched) {
      onSelectHiker(matched);
      setSearchFeedback({
        type: 'success',
        message: `查詢成功！山友/遊客暱稱「${matched.nickname}」，已載入 ${matched.completedPeakIds.length} 個鄉鎮區景點打卡足跡與榮譽獎狀。`
      });
    } else {
      // If a custom/unregistered Gmail is entered:
      const emailPrefix = query.includes('@') ? query.split('@')[0] : query;
      const cleanNickname = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      const fullEmail = query.includes('@') ? query : `${query}@gmail.com`;

      const newProfile: HikerProfile = {
        nickname: cleanNickname,
        email: fullEmail,
        levelTitle: '台灣特色景點漫遊者',
        certId: `TW-CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`,
        finishDate: new Date().toISOString().split('T')[0],
        motto: '走遍台灣各鄉鎮區與外島，體驗山海人情與在地風華。',
        completedPeakIds: [] // Start with 0 completed spots
      };

      onSelectHiker(newProfile);
      setSearchFeedback({
        type: 'newProfile',
        message: `名單尚無預設資料，已為「${cleanNickname}」建立專屬紀錄面板（目前 0/${totalSpots} 區），可在下方自由勾選打卡！`
      });
    }
  };

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-6 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Search Box (Input Gmail) */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="gmail-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#002654]" />
              <span>請輸入Gmail查詢地圖與獎狀</span>
            </label>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-[#002654] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#002654]/20 transition">
              <input
                id="gmail-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="請輸入Gmail查詢地圖與獎狀"
                className="w-full pl-4 pr-9 py-2.5 bg-transparent font-medium text-slate-800 text-sm placeholder:text-slate-400 outline-none"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue('');
                    setSearchFeedback({ type: 'idle', message: '' });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              id="search-gmail-btn"
              type="submit"
              className="bg-[#002654] hover:bg-[#001736] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap border border-[#001736]"
            >
              <Search className="w-4 h-4" />
              <span>查詢</span>
            </button>
          </form>

          {/* Feedback message */}
          {searchFeedback.type !== 'idle' && (
            <div
              className={`mt-2.5 text-xs px-3 py-2 rounded-xl flex items-center justify-between gap-2 animate-fadeIn ${
                searchFeedback.type === 'success'
                  ? 'bg-blue-50 text-[#002654] border border-blue-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {searchFeedback.type === 'success' ? (
                  <UserCheck className="w-4 h-4 text-[#002654] shrink-0" />
                ) : (
                  <UserPlus className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>{searchFeedback.message}</span>
              </div>
              {searchFeedback.type === 'success' && (
                <button
                  onClick={onOpenCertificate}
                  className="text-xs font-bold text-[#002654] hover:text-[#001736] underline shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  開獎狀
                </button>
              )}
            </div>
          )}
        </div>

        {/* Current Active User Status Card */}
        {currentProfile ? (
          <div className="lg:w-80 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-2 h-2 rounded-full bg-[#002654] animate-pulse"></div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">目前好友</p>
              </div>
              <p className="text-base font-black text-slate-900 truncate">
                {currentProfile.nickname}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                <span className="font-extrabold text-[#002654]">
                  {currentProfile.completedPeakIds.length} / {totalSpots} 打卡
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-semibold truncate max-w-[110px]">
                  {currentProfile.completedPeakIds.length >= totalSpots ? '🏅 全大滿貫' : `${Math.round((currentProfile.completedPeakIds.length / totalSpots) * 100)}%`}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <a
                id="in-app-checkin-btn"
                href="https://joyease.github.io/mymap/peak100.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 sm:py-3 bg-[#002654] hover:bg-[#001736] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-[#001736]"
                title="前往 In-App 打卡地圖"
              >
                <MapPin className="w-4 h-4 text-amber-200 shrink-0" />
                <span className="whitespace-nowrap">In-App打卡</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80 shrink-0" />
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

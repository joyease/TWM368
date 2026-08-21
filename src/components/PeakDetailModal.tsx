import React from 'react';
import { SmallPeak } from '../types';
import { X, CheckCircle2, Circle, MapPin, ExternalLink, Flag, Building2, Compass } from 'lucide-react';

interface PeakDetailModalProps {
  peak: SmallPeak | null;
  isOpen: boolean;
  isCompleted: boolean;
  onClose: () => void;
  onToggleComplete: () => void;
}

export const PeakDetailModal: React.FC<PeakDetailModalProps> = ({
  peak,
  isOpen,
  isCompleted,
  onClose,
  onToggleComplete
}) => {
  if (!isOpen || !peak) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`p-6 text-white relative transition-colors ${
            isCompleted
              ? 'bg-[#002654] border-b border-[#001A3B]'
              : 'bg-slate-900 border-b border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/20 text-yellow-300">
                {peak.townshipCode}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
                {peak.region}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-yellow-300 font-bold text-sm mb-1">
            <Building2 className="w-4 h-4" />
            <span>{peak.district}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {peak.name}
          </h3>

          <div className="flex items-center gap-3 mt-3 text-sm text-slate-200">
            <span className="flex items-center gap-1 font-medium text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5 text-yellow-300" />
              {peak.county} {peak.district}
            </span>
            <span>•</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-blue-200">
              {peak.govSource}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-sm text-slate-700 bg-slate-50">
          {/* Key specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">行政區代碼</p>
              <p className="font-mono font-bold text-slate-800 mt-0.5 text-xs">
                {peak.townshipCode}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">景點分區</p>
              <p className="font-bold text-slate-800 mt-0.5 text-xs">
                {peak.region}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">經緯度座標</p>
              <p className="font-mono text-xs font-bold text-slate-700 mt-0.5">
                {peak.lat.toFixed(4)}, {peak.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Highlight description */}
          {peak.highlight && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <Flag className="w-3.5 h-3.5 text-[#0055A4]" />
                <span>景點特色與亮點</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                {peak.highlight}
              </p>
            </div>
          )}

          {/* Action Links */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${peak.lat},${peak.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#0055A4] hover:text-[#002654] flex items-center gap-1 p-2 rounded-xl hover:bg-blue-50 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google 地圖導航</span>
            </a>

            <button
              onClick={onToggleComplete}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-md cursor-pointer active:scale-95 ${
                isCompleted
                  ? 'bg-[#002654] hover:bg-[#001A3B] text-white border border-[#001A3B]'
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                  <span>已打卡 (點此取消)</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  <span>標記為已打卡</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

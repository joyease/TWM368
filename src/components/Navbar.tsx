import React from 'react';
import { Award, MapPin, Compass } from 'lucide-react';

interface NavbarProps {
  completedCount: number;
  totalCount: number;
  activeNickname: string | null;
  onOpenCertificate: () => void;
  hasCertificate: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  completedCount,
  totalCount,
  activeNickname,
  onOpenCertificate,
  hasCertificate
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-[#0055A4] flex items-center justify-center text-white shadow-md">
            <MapPin className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                台灣368 走透透
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0055A4]/10 text-[#0055A4] border border-[#0055A4]/20 font-bold uppercase tracking-wider">
                {totalCount} Districts
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              每地一特色，走訪開獎狀
            </p>
          </div>
        </div>

        {/* Right side certificate button */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            id="navbar-cert-btn"
            onClick={onOpenCertificate}
            disabled={!hasCertificate && completedCount === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 ${
              hasCertificate
                ? 'bg-[#002654] hover:bg-[#001736] text-white shadow-md cursor-pointer border border-[#001736]'
                : completedCount > 0
                ? 'bg-[#002654] hover:bg-[#001736] text-white cursor-pointer border border-[#001736]'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
            }`}
            title={activeNickname ? `查看 ${activeNickname} 的榮譽獎狀` : '請先輸入 Gmail 查詢'}
          >
            <Award className={`w-4 h-4 ${hasCertificate ? 'text-yellow-300' : 'text-slate-400'}`} />
            <span>{hasCertificate ? '開獎狀' : '產生獎狀'}</span>
            {activeNickname && (
              <span className="hidden lg:inline-block max-w-[90px] truncate text-[11px] px-1.5 py-0.2 bg-black/20 text-white rounded">
                {activeNickname}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

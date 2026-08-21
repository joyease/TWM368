import React, { useRef } from 'react';
import { Award, CheckCircle2, Download, Printer, X, Calendar, Hash, ShieldCheck, Sparkles } from 'lucide-react';
import { HikerProfile } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HikerProfile | null;
  completedCount: number;
  totalSpots?: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
  completedCount,
  totalSpots = 368
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !profile) return null;

  const isGrandSlam = completedCount >= totalSpots;
  const finishDate = profile.finishDate || new Date().toISOString().split('T')[0];
  const completionPercentage = Math.round((completedCount / totalSpots) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[2rem] shadow-2xl max-w-3xl w-full my-auto overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Non-print) */}
        <div className="bg-slate-900 text-slate-200 px-6 py-3.5 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0055A4] text-white flex items-center justify-center">
              <Award className="w-3.5 h-3.5 text-yellow-300" />
            </div>
            <span className="font-bold text-sm tracking-tight">特色景點完登榮譽證書 • Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-700 active:scale-95"
              title="列印或儲存為 PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>列印 / 存為PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body Container */}
        <div className="p-6 sm:p-10 bg-[#FAFBF9] select-none" ref={certRef}>
          {/* Certificate Classic Border Frame */}
          <div className="relative border-4 border-[#0055A4]/30 p-6 sm:p-10 rounded-[1.5rem] bg-white shadow-lg overflow-hidden">
            
            {/* Background Parchment Border */}
            <div className="absolute inset-0 border-[16px] border-[#F1E9D2] opacity-30 pointer-events-none rounded-[1.2rem]"></div>

            {/* Corner Decorative Brackets */}
            <div className="absolute top-5 left-5 w-5 h-5 border-t-2 border-l-2 border-slate-800 opacity-40"></div>
            <div className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2 border-slate-800 opacity-40"></div>
            <div className="absolute bottom-5 left-5 w-5 h-5 border-b-2 border-l-2 border-slate-800 opacity-40"></div>
            <div className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 border-slate-800 opacity-40"></div>

            {/* Certificate Header */}
            <div className="text-center relative z-10">
              <h2 className="text-[#8B7355] text-base sm:text-lg font-serif italic mb-1 tracking-wide">
                Certificate of Achievement
              </h2>
              <h3 className="text-2xl sm:text-4xl font-black text-slate-800 mb-3 tracking-tight">
                台灣特色鄉鎮區景點完登獎狀
              </h3>
              <p className="text-xs text-slate-400 font-medium">涵蓋全台都會、鄉村與離島各鄉鎮區特色景點</p>
              <div className="w-20 h-0.5 bg-[#8B7355] mx-auto my-4"></div>
            </div>

            {/* Certificate Main Text */}
            <div className="text-center space-y-4 my-4 relative z-10 font-sans">
              <p className="text-slate-500 text-sm font-medium">
                茲證明 探索夥伴
              </p>

              {/* Hiker Nickname Box */}
              <div className="inline-block px-8 py-2 bg-slate-50 border-b-2 border-[#0055A4] rounded-lg">
                <span className="text-2xl sm:text-4xl font-black tracking-wide text-[#0055A4]">
                  {profile.nickname}
                </span>
                <span className="text-sm font-bold text-slate-500 ml-2">君</span>
              </div>

              {/* Achievement description */}
              <div className="max-w-md mx-auto text-slate-600 text-sm sm:text-base leading-relaxed pt-2">
                <p>
                  已完成{' '}
                  <span className="text-2xl font-black text-[#0055A4] font-mono mx-1">
                    {completedCount}
                  </span>{' '}
                  個鄉鎮區景點打卡（
                  <span className="font-extrabold text-[#0055A4]">
                    {completionPercentage}%
                  </span>
                  ）
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                  特頒此狀以資表彰，紀錄走遍台灣本島山海與璀璨離島的精彩足跡。
                </p>
                {profile.motto && (
                  <p className="text-xs text-slate-400 italic mt-3 pt-2 border-t border-slate-100 font-serif">
                    「 {profile.motto} 」
                  </p>
                )}
              </div>
            </div>

            {/* Achievement Badge & Seals Grid */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              {/* Left: Cert details */}
              <div className="text-left text-xs text-slate-500 space-y-1 w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#0055A4]" />
                  <span className="font-mono font-bold text-slate-700">證書字號：{profile.certId}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>頒發日期：{finishDate.replace(/-/g, '.')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0055A4]" />
                  <span>榮譽稱號：{isGrandSlam ? '👑 台灣鄉鎮區全制霸大滿貫達人' : profile.levelTitle}</span>
                </div>
              </div>

              {/* Center/Right: Badges & Official Seal */}
              <div className="flex items-center gap-4">
                {/* Grand Slam Gold Badge if full */}
                {isGrandSlam && (
                  <div className="w-14 h-14 rounded-full bg-[#002654] p-1 shadow-md flex flex-col items-center justify-center text-white border-2 border-yellow-400 animate-pulse">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="text-[8px] font-black uppercase leading-none mt-0.5">
                      {totalSpots}區踩點
                    </span>
                    <span className="text-[7px] text-yellow-300 font-bold">全大滿貫</span>
                  </div>
                )}

                {/* Official Seal */}
                <div className="w-14 h-14 border-2 border-dashed border-slate-300 rounded-full flex flex-col items-center justify-center text-[7.5px] text-slate-400 text-center font-bold tracking-tighter uppercase leading-tight p-1 bg-white">
                  <span>TAIWAN</span>
                  <span>DISTRICT</span>
                  <span className="text-[6px] text-slate-300">OFFICIAL</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions (Non-print) */}
        <div className="bg-slate-50 px-6 py-3.5 flex items-center justify-between border-t border-slate-200 text-xs text-slate-500 print:hidden">
          <span>點擊「列印 / 存為PDF」可直接保存證書紀念</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

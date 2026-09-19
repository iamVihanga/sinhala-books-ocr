import React from "react";
import { History, Sparkles, Image as ImageIcon, Camera } from "lucide-react";

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenSamples: () => void;
  onOpenCamera: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenSamples,
  onOpenCamera,
  historyCount,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur border-b border-stone-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-bold text-xl shadow-sm border border-amber-700/30">
            <span className="font-['Noto_Sans_Sinhala']">සි</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                Sinhala Text Extractor
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200/80">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Gemini Vision OCR
              </span>
            </div>
            <p className="text-xs text-stone-500 font-['Noto_Sans_Sinhala']">
              පොත් කවර වල තොරතුරු සහ සිංහල අකුරු ලබාගන්න
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSamples}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors"
            title="Try sample Sinhala book covers"
          >
            <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden md:inline">Sample Book Covers</span>
            <span className="md:hidden">Book Covers</span>
          </button>

          <button
            onClick={onOpenCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors"
            title="Capture from camera"
          >
            <Camera className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden md:inline">Camera</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors"
            title="View scan history"
          >
            <History className="w-3.5 h-3.5 text-stone-600" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

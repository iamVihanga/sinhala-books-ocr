import React, { useState, useRef } from "react";
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Sparkles } from "lucide-react";

interface ImageViewerProps {
  imageUrl: string;
  isProcessing: boolean;
  onRescan?: () => void;
  onChangeImage?: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  isProcessing,
  onChangeImage,
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col h-full bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Viewer Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-950/80 border-b border-stone-800 text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-200">Source Image</span>
          <span className="px-2 py-0.5 rounded bg-stone-800 text-[10px] text-stone-400 font-mono">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-white transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-white transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotate}
            className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-white transition-colors"
            title="Rotate 90 degrees"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-white transition-colors"
            title="Reset view"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          {onChangeImage && (
            <button
              onClick={onChangeImage}
              className="ml-2 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md transition-colors"
            >
              Change
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        className={`relative flex-1 min-h-[360px] md:min-h-[440px] flex items-center justify-center p-4 overflow-hidden select-none ${
          zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="transition-transform duration-150 ease-out flex items-center justify-center max-w-full max-h-full"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
          }}
        >
          <img
            src={imageUrl}
            alt="Scanned Sinhala document"
            className="max-h-[500px] w-auto object-contain rounded-lg shadow-md pointer-events-none"
          />
        </div>

        {/* Processing Scanning Beam Effect */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-auto">
            <div className="relative w-64 h-1 bg-amber-950/40 rounded-full overflow-hidden mb-4">
              <div className="absolute inset-y-0 left-0 bg-amber-500 w-1/3 animate-pulse rounded-full"></div>
            </div>
            <div className="flex items-center gap-2 bg-stone-900/90 border border-amber-500/30 px-4 py-2 rounded-xl text-amber-300 text-sm font-medium shadow-xl">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>Scanning Sinhala Unicode text...</span>
            </div>
            <p className="text-xs text-stone-400 mt-2 font-['Noto_Sans_Sinhala']">
              අකුරු සහ ස්වර හඳුනාගනිමින් පවතී
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

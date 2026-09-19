import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Camera,
  Clipboard,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_IMAGES, SampleImage } from "../data/sampleImages";

interface ImageUploaderProps {
  onImageSelected: (base64Data: string, mimeType: string, filename?: string) => void;
  onOpenCamera: () => void;
  isProcessing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onOpenCamera,
  isProcessing,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [clipboardError, setClipboardError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Global paste handler (Ctrl+V / Cmd+V anywhere on window)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    // Limit to 20MB
    if (file.size > 20 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 20MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onImageSelected(reader.result, file.type, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handlePasteButtonClick = async () => {
    setClipboardError(null);
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error("Clipboard reading is not supported directly. Please press Ctrl+V or Cmd+V to paste.");
      }

      const clipboardItems = await navigator.clipboard.read();
      let foundImage = false;

      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                onImageSelected(reader.result, type, "clipboard-image");
              }
            };
            reader.readAsDataURL(blob);
            foundImage = true;
            break;
          }
        }
        if (foundImage) break;
      }

      if (!foundImage) {
        setClipboardError("No image found in clipboard. Copy an image first, or press Ctrl+V.");
        setTimeout(() => setClipboardError(null), 4000);
      }
    } catch (err: any) {
      console.warn("Clipboard access warning:", err);
      setClipboardError("Press Ctrl+V (or Cmd+V) to paste an image directly.");
      setTimeout(() => setClipboardError(null), 4000);
    }
  };

  const handleSelectSample = (sample: SampleImage) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const w = img.naturalWidth || 800;
        const h = img.naturalHeight || 500;
        canvas.width = w * 2;
        canvas.height = h * 2;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(2, 2);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          const pngUrl = canvas.toDataURL("image/png", 0.95);
          onImageSelected(pngUrl, "image/png", sample.title);
        } else {
          onImageSelected(sample.dataUrl, "image/png", sample.title);
        }
      };
      img.onerror = () => {
        onImageSelected(sample.dataUrl, "image/png", sample.title);
      };
      img.src = sample.dataUrl;
    } catch {
      onImageSelected(sample.dataUrl, "image/png", sample.title);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/bmp"
        className="hidden"
      />

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group ${
          isDragOver
            ? "border-amber-500 bg-amber-500/5 scale-[0.99]"
            : "border-stone-300 hover:border-amber-500/80 bg-white hover:bg-stone-50/50"
        } shadow-xs`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-amber-100 transition-all border border-amber-200/60 shadow-xs">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-stone-900 mb-1">
            Upload Sinhala Book Cover or Document
          </h3>
          <p className="text-xs text-stone-500 mb-6 font-['Noto_Sans_Sinhala']">
            පොත් කවර (පෙරමුණ, පසුපස, කොඳු පිටුව හෝ මුද්‍රණ පිටුව) ඇතුළත් කර නම, කර්තෘ, ප්‍රකාශක සහ ISBN ලබාගන්න
          </p>

          {/* Action pills inside dropzone */}
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Browse File</span>
            </button>

            <button
              type="button"
              onClick={onOpenCamera}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 border border-stone-200/80"
            >
              <Camera className="w-3.5 h-3.5 text-stone-600" />
              <span>Camera</span>
            </button>

            <button
              type="button"
              onClick={handlePasteButtonClick}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 border border-stone-200/80"
            >
              <Clipboard className="w-3.5 h-3.5 text-stone-600" />
              <span>Paste Image</span>
            </button>
          </div>

          <p className="text-[11px] text-stone-400 mt-4">
            Supports PNG, JPG, JPEG, WEBP • Drag &amp; Drop or press <kbd className="font-mono bg-stone-100 px-1 py-0.5 rounded text-stone-600">Ctrl+V</kbd> anywhere
          </p>

          {clipboardError && (
            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg mt-3 border border-amber-200">
              {clipboardError}
            </p>
          )}
        </div>
      </div>

      {/* Sample presets for instant 1-click testing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Or Try a Sample Sinhala Book Cover
            </h4>
          </div>
          <span className="text-[11px] text-stone-400 font-['Noto_Sans_Sinhala']">
            නියැදි පොත් කවර සමඟ අත්හදා බලන්න
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_IMAGES.map((sample: SampleImage) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              disabled={isProcessing}
              className="group p-3.5 bg-white border border-stone-200 hover:border-amber-500/80 rounded-2xl text-left transition-all hover:shadow-md flex flex-col justify-between disabled:opacity-50"
            >
              <div>
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 border border-stone-100 bg-stone-50 flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                  <img
                    src={sample.dataUrl}
                    alt={sample.title}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>
                <h5 className="text-xs font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                  {sample.title}
                </h5>
                <p className="text-[11px] text-amber-900/80 font-medium font-['Noto_Sans_Sinhala'] line-clamp-1 mt-0.5">
                  {sample.sinhalaTitle}
                </p>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                  {sample.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-amber-700">
                <span>Scan this sample</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

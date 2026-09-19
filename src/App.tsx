import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ImageUploader } from "./components/ImageUploader";
import { ImageViewer } from "./components/ImageViewer";
import { TextOutputWorkspace } from "./components/TextOutputWorkspace";
import { CameraCapture } from "./components/CameraCapture";
import { ScanHistoryModal } from "./components/ScanHistoryModal";
import { OCRResult, ScanHistoryItem } from "./types";
import { AlertCircle, RefreshCw, Plus, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { SAMPLE_IMAGES } from "./data/sampleImages";

const HISTORY_STORAGE_KEY = "sinhala_ocr_scan_history_v1";

export default function App() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentMime, setCurrentMime] = useState<string>("image/jpeg");
  const [currentTitle, setCurrentTitle] = useState<string>("Uploaded Document");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history to local storage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn("Unable to save history to localStorage:", e);
    }
  }, [history]);

  // Execute OCR scan on selected image
  const performOCR = async (base64Data: string, mimeType: string, title?: string) => {
    setIsProcessing(true);
    setError(null);
    setOcrResult(null);

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let msg = data.error || "Failed to scan Sinhala text from this image.";
        if (typeof msg === "string") {
          try {
            const parsed = JSON.parse(msg);
            if (parsed.error?.message) {
              msg = parsed.error.message;
            }
          } catch {}
        }
        throw new Error(msg);
      }

      const result: OCRResult = {
        ...data,
        imagePreviewUrl: base64Data,
      };

      setOcrResult(result);

      // Add to history with formatted book title if available
      const historyTitle =
        result.bookMetadata?.title?.sinhala
          ? `${result.bookMetadata.title.sinhala}${
              result.bookMetadata.author?.sinhala
                ? ` • ${result.bookMetadata.author.sinhala}`
                : ""
            }`
          : title || result.documentType || "Sinhala Document";

      const historyItem: ScanHistoryItem = {
        id: `scan-${Date.now()}`,
        timestamp: Date.now(),
        thumbnail: base64Data,
        result: result,
        title: historyTitle,
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
    } catch (err: any) {
      console.error("OCR Error:", err);
      let displayMsg = err.message || "An unexpected error occurred while scanning the image. Please try again.";
      if (typeof displayMsg === "string") {
        try {
          const parsed = JSON.parse(displayMsg);
          if (parsed.error?.message) {
            displayMsg = parsed.error.message;
          }
        } catch {}
      }
      setError(displayMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageSelected = (base64Data: string, mimeType: string, filename?: string) => {
    setCurrentImage(base64Data);
    setCurrentMime(mimeType);
    setCurrentTitle(filename || "Sinhala Image");
    performOCR(base64Data, mimeType, filename);
  };

  const handleCameraCapture = (base64Data: string) => {
    setCurrentImage(base64Data);
    setCurrentMime("image/jpeg");
    setCurrentTitle("Camera Snapshot");
    performOCR(base64Data, "image/jpeg", "Camera Snapshot");
  };

  const handleSelectFromHistory = (item: ScanHistoryItem) => {
    setCurrentImage(item.thumbnail);
    setCurrentTitle(item.title);
    setOcrResult(item.result);
    setError(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {}
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetToUpload = () => {
    setCurrentImage(null);
    setOcrResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 selection:bg-amber-200">
      {/* Navigation Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSamples={() => {
          handleResetToUpload();
          window.scrollTo({ top: 400, behavior: "smooth" });
        }}
        onOpenCamera={() => setIsCameraOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start justify-between gap-3 text-rose-900 shadow-sm animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Scanning Failed</h4>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
            {currentImage && (
              <button
                onClick={() => performOCR(currentImage, currentMime, currentTitle)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        )}

        {/* View Mode 1: Uploader View (Initial State) */}
        {!currentImage ? (
          <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full py-4 space-y-8">
            {/* Intro Hero Badge */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Sinhala Book Cover &amp; Document OCR</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                Extract Categorized Book Cover Data
              </h2>
              <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto font-['Noto_Sans_Sinhala'] leading-relaxed">
                පොත් කවර වල ඇති පොතේ නම, කර්තෘ, උප සිරැසි, ප්‍රකාශකයා සහ ISBN අංකය නිවැරදිව වෙන්කර හඳුනාගෙන අවශ්‍ය පරිදි වර්ගීකරණය කරගන්න.
              </p>
            </div>

            {/* Upload Area & Sample Presets */}
            <ImageUploader
              onImageSelected={handleImageSelected}
              onOpenCamera={() => setIsCameraOpen(true)}
              isProcessing={isProcessing}
            />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 flex items-start gap-3 shadow-xs">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Categorized Fields</h4>
                  <p className="text-xs text-stone-500 mt-0.5 font-['Noto_Sans_Sinhala']">
                    පොතේ නම, කර්තෘ, උප සිරැසි, ප්‍රකාශකයා සහ ISBN අංකය වෙන වෙනම කාණ්ඩගතව ලබාදීම.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 flex items-start gap-3 shadow-xs">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Citations &amp; CSV Export</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Generate instant APA, MLA, Chicago, and BibTeX citations or export directly to CSV / Excel.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 flex items-start gap-3 shadow-xs">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Diacritic Accuracy</h4>
                  <p className="text-xs text-stone-500 mt-0.5 font-['Noto_Sans_Sinhala']">
                    පිල්ලම්, කොම්බු, ඇලපිලි, සහ බැඳි අකුරු නිරවද්‍යව පිරිසිදු Unicode බවට පරිවර්තනය.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* View Mode 2: Active Results / Inspection Workspace */
          <div className="flex-1 flex flex-col space-y-4">
            {/* Top Workspace Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetToUpload}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Scan New Cover</span>
                </button>

                <h3 className="text-xs font-semibold text-stone-600 truncate max-w-xs">
                  {currentTitle}
                </h3>
              </div>

              {/* Retry button if needed */}
              <button
                onClick={() => performOCR(currentImage, currentMime, currentTitle)}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin text-amber-600" : ""}`} />
                <span>{isProcessing ? "Scanning..." : "Re-scan"}</span>
              </button>
            </div>

            {/* Split Screen Grid: Image on Left, Extracted Text on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
              {/* Left Column: Image Viewer */}
              <div className="lg:col-span-5 lg:sticky lg:top-20">
                <ImageViewer
                  imageUrl={currentImage}
                  isProcessing={isProcessing}
                  onChangeImage={handleResetToUpload}
                />
              </div>

              {/* Right Column: Extracted Sinhala Text & Workspace */}
              <div className="lg:col-span-7 flex flex-col">
                {isProcessing ? (
                  <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm min-h-[440px]">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-stone-900">
                        Analyzing Book Cover with Gemini Vision...
                      </h4>
                      <p className="text-xs text-stone-500 font-['Noto_Sans_Sinhala'] mt-1">
                        පොතේ නම, කර්තෘ, උප සිරැසි, ප්‍රකාශකයා සහ ISBN හඳුනාගනිමින් පවතී
                      </p>
                    </div>
                    <div className="w-48 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full animate-indeterminate"></div>
                    </div>
                  </div>
                ) : ocrResult ? (
                  <TextOutputWorkspace
                    result={ocrResult}
                    onUpdateText={(newText) => {
                      setOcrResult((prev) => prev ? { ...prev, rawSinhalaText: newText } : null);
                    }}
                    onUpdateMetadata={(newMeta) => {
                      setOcrResult((prev) => prev ? { ...prev, bookMetadata: newMeta } : null);
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Camera Capture Modal */}
      <CameraCapture
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* History Modal */}
      <ScanHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectFromHistory}
        onClear={handleClearHistory}
        onDeleteOne={handleDeleteHistoryItem}
      />

      {/* App Footer */}
      <footer className="w-full bg-white border-t border-stone-200 py-3 text-center text-xs text-stone-400">
        <p>
          Sinhala Text Extractor • AI Powered Vision OCR for the Sinhala Script (සිංහල අක්ෂර මාලාව)
        </p>
      </footer>
    </div>
  );
}

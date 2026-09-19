import React, { useState } from "react";
import {
  Copy,
  Check,
  Volume2,
  Download,
  Search,
  FileText,
  Layers,
  Globe,
  Languages,
  BookOpen,
  Edit3,
  Sparkles,
  Info,
  BookMarked,
} from "lucide-react";
import { OCRResult, TextBlock, BookMetadata } from "../types";
import { BookMetadataCard } from "./BookMetadataCard";
import {
  copyToClipboard,
  downloadTextFile,
  exportAsMarkdown,
  analyzeSinhalaText,
  speakText,
} from "../utils/textExport";

interface TextOutputWorkspaceProps {
  result: OCRResult;
  onUpdateText?: (newText: string) => void;
  onUpdateMetadata?: (metadata: BookMetadata) => void;
}

export const TextOutputWorkspace: React.FC<TextOutputWorkspaceProps> = ({
  result,
  onUpdateText,
  onUpdateMetadata,
}) => {
  const [activeTab, setActiveTab] = useState<
    "metadata" | "raw" | "blocks" | "translation" | "singlish" | "details"
  >(result.bookMetadata ? "metadata" : "raw");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(18);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableText, setEditableText] = useState<string>(result.rawSinhalaText);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<boolean>(false);

  // Sync editable text when result changes
  React.useEffect(() => {
    setEditableText(result.rawSinhalaText);
    setIsEditing(false);
    if (result.bookMetadata) {
      setActiveTab("metadata");
    }
  }, [result]);

  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const handleSpeak = async (textToSpeak: string, lang: string = "si-LK") => {
    if (isSpeaking) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    await speakText(textToSpeak, lang);
    setIsSpeaking(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEditableText(val);
    if (onUpdateText) onUpdateText(val);
  };

  const stats = analyzeSinhalaText(editableText);

  // Filter blocks based on search query
  const filteredBlocks = result.blocks.filter(
    (b) =>
      !searchQuery ||
      b.sinhala.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.transliteration.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Top Meta Bar */}
      <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
            {result.documentType || "Sinhala Document"}
          </span>
          {result.detectedLanguageMix && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-200/80 text-stone-700">
              {result.detectedLanguageMix}
            </span>
          )}
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* TTS Audio button */}
          <button
            onClick={() => handleSpeak(editableText)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSpeaking
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white hover:bg-stone-100 text-stone-700 border-stone-200"
            }`}
            title="Listen to Sinhala text"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "animate-pulse" : ""}`} />
            <span>{isSpeaking ? "Stop" : "Listen"}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={() => handleCopy(editableText, "main")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-xs"
            title="Copy extracted Sinhala text"
          >
            {copiedType === "main" ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Sinhala</span>
              </>
            )}
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {downloadMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-40">
                <button
                  onClick={() => {
                    downloadTextFile(editableText, "sinhala-text.txt");
                    setDownloadMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between"
                >
                  <span>Text file (.txt)</span>
                  <span className="text-[10px] text-stone-400">Sinhala</span>
                </button>
                <button
                  onClick={() => {
                    downloadTextFile(exportAsMarkdown(result), "sinhala-ocr-report.md", "text/markdown");
                    setDownloadMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between"
                >
                  <span>Full Report (.md)</span>
                  <span className="text-[10px] text-stone-400">All data</span>
                </button>
                <button
                  onClick={() => {
                    downloadTextFile(JSON.stringify(result, null, 2), "sinhala-ocr.json", "application/json");
                    setDownloadMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between"
                >
                  <span>JSON (.json)</span>
                  <span className="text-[10px] text-stone-400">Structured</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="px-5 pt-2 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          {result.bookMetadata && (
            <button
              onClick={() => setActiveTab("metadata")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                activeTab === "metadata"
                  ? "border-amber-600 text-amber-900 bg-white shadow-xs"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              <BookMarked className="w-3.5 h-3.5 text-amber-600" />
              <span>Book Details (පොත් තොරතුරු)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("raw")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === "raw"
                ? "border-amber-600 text-amber-900 bg-white shadow-xs"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sinhala Text</span>
          </button>

          <button
            onClick={() => setActiveTab("blocks")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === "blocks"
                ? "border-amber-600 text-amber-900 bg-white shadow-xs"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Segments ({result.blocks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("translation")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === "translation"
                ? "border-amber-600 text-amber-900 bg-white shadow-xs"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>English Translation</span>
          </button>

          <button
            onClick={() => setActiveTab("singlish")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === "singlish"
                ? "border-amber-600 text-amber-900 bg-white shadow-xs"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Singlish Phonetics</span>
          </button>

          <button
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === "details"
                ? "border-amber-600 text-amber-900 bg-white shadow-xs"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Script Insights</span>
          </button>
        </div>

        {/* Font size control for Sinhala text */}
        {activeTab === "raw" && (
          <div className="flex items-center gap-2 text-xs text-stone-500 pb-1">
            <span className="text-[11px]">Size:</span>
            <button
              onClick={() => setFontSize((f) => Math.max(f - 2, 14))}
              className="w-5 h-5 rounded hover:bg-stone-200 flex items-center justify-center font-bold"
            >
              -
            </button>
            <span className="font-mono text-[11px] w-6 text-center">{fontSize}px</span>
            <button
              onClick={() => setFontSize((f) => Math.min(f + 2, 32))}
              className="w-5 h-5 rounded hover:bg-stone-200 flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-5 overflow-y-auto bg-stone-50/20">
        {/* TAB 0: BOOK METADATA */}
        {activeTab === "metadata" && result.bookMetadata && (
          <BookMetadataCard
            metadata={result.bookMetadata}
            onUpdateMetadata={onUpdateMetadata}
          />
        )}
        {/* TAB 1: RAW SINHALA TEXT */}
        {activeTab === "raw" && (
          <div className="flex flex-col h-full gap-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    isEditing
                      ? "bg-amber-100 text-amber-900"
                      : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Done Editing" : "Edit Text"}</span>
                </button>
                {isEditing && (
                  <span className="text-[11px] text-amber-700 italic">
                    You can directly refine or correct the extracted text below.
                  </span>
                )}
              </div>
            </div>

            {isEditing ? (
              <textarea
                value={editableText}
                onChange={handleTextChange}
                className="w-full flex-1 min-h-[300px] p-4 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-['Noto_Sans_Sinhala'] leading-relaxed shadow-inner"
                style={{ fontSize: `${fontSize}px` }}
                placeholder="Sinhala text..."
              />
            ) : (
              <div
                className="w-full flex-1 min-h-[300px] p-5 bg-white border border-stone-200 rounded-xl font-['Noto_Sans_Sinhala'] text-stone-900 leading-relaxed whitespace-pre-wrap selection:bg-amber-200 shadow-xs"
                style={{ fontSize: `${fontSize}px` }}
              >
                {editableText || (
                  <span className="text-stone-400 italic">No text extracted.</span>
                )}
              </div>
            )}

            {/* Quick summary note */}
            {result.summary && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-start gap-2 text-xs text-stone-700">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-950">Overview: </span>
                  <span>{result.summary}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STRUCTURED BLOCKS */}
        {activeTab === "blocks" && (
          <div className="space-y-3">
            {/* Search filter */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Sinhala, Singlish, or English words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            {filteredBlocks.map((block: TextBlock, idx: number) => {
              const badge = (() => {
                switch (block.blockType) {
                  case "book_title":
                    return { label: "Book Title (පොතේ නම)", color: "bg-amber-100 text-amber-900 border-amber-300" };
                  case "author_name":
                    return { label: "Author (කර්තෘ)", color: "bg-sky-100 text-sky-900 border-sky-300" };
                  case "sub_heading":
                    return { label: "Sub-heading (උප සිරැසි)", color: "bg-indigo-100 text-indigo-900 border-indigo-300" };
                  case "publisher":
                    return { label: "Publisher (ප්‍රකාශක)", color: "bg-emerald-100 text-emerald-900 border-emerald-300" };
                  case "isbn_barcode":
                    return { label: "ISBN & Barcode", color: "bg-purple-100 text-purple-900 border-purple-300 font-mono" };
                  case "edition_year":
                    return { label: "Edition / Year", color: "bg-rose-100 text-rose-900 border-rose-300" };
                  case "price":
                    return { label: "Price (මිල)", color: "bg-teal-100 text-teal-900 border-teal-300" };
                  case "blurb":
                    return { label: "Synopsis / Blurb", color: "bg-amber-50 text-amber-950 border-amber-200" };
                  default:
                    return { label: block.blockType.replace("_", " "), color: "bg-stone-100 text-stone-600 border-stone-200" };
                }
              })();

              return (
                <div
                  key={idx}
                  className="p-4 bg-white border border-stone-200 rounded-xl hover:border-amber-300 transition-colors shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSpeak(block.sinhala)}
                        className="p-1 hover:bg-stone-100 rounded text-stone-500 hover:text-stone-800"
                        title="Listen to this segment"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(block.sinhala, `block-${idx}`)}
                        className="p-1 hover:bg-stone-100 rounded text-stone-500 hover:text-stone-800"
                        title="Copy Sinhala segment"
                      >
                        {copiedType === `block-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sinhala Text */}
                  <p className="font-['Noto_Sans_Sinhala'] text-base md:text-lg font-medium text-stone-900 mb-2 leading-relaxed">
                    {block.sinhala}
                  </p>

                  {/* Transliteration */}
                  <p className="text-xs text-amber-800 font-mono mb-1 bg-amber-50/60 p-1.5 rounded">
                    <span className="text-[10px] font-sans text-amber-600 font-medium block">Pronunciation:</span>
                    {block.transliteration}
                  </p>

                  {/* English Translation */}
                  <p className="text-xs text-stone-600 pt-1 border-t border-stone-100">
                    <span className="text-[10px] text-stone-400 font-medium block">English:</span>
                    {block.translation}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: ENGLISH TRANSLATION */}
        {activeTab === "translation" && (
          <div className="flex flex-col h-full gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Machine translation of the extracted Sinhala content
              </span>
              <button
                onClick={() => handleCopy(result.englishTranslation, "trans")}
                className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
              >
                {copiedType === "trans" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy English Translation</span>
              </button>
            </div>

            <div className="w-full flex-1 min-h-[300px] p-5 bg-white border border-stone-200 rounded-xl text-stone-800 text-sm leading-relaxed whitespace-pre-wrap shadow-xs">
              {result.englishTranslation || "No English translation available."}
            </div>
          </div>
        )}

        {/* TAB 4: SINGLISH / PRONUNCIATION */}
        {activeTab === "singlish" && (
          <div className="flex flex-col h-full gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Phonetic Romanized script for easy reading and pronunciation
              </span>
              <button
                onClick={() => handleCopy(result.singlishTransliteration, "singlish")}
                className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
              >
                {copiedType === "singlish" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Singlish</span>
              </button>
            </div>

            <div className="w-full flex-1 min-h-[300px] p-5 bg-white border border-stone-200 rounded-xl font-mono text-amber-950 text-sm leading-relaxed whitespace-pre-wrap shadow-xs bg-amber-50/20">
              {result.singlishTransliteration || "No transliteration available."}
            </div>
          </div>
        )}

        {/* TAB 5: SCRIPT INSIGHTS */}
        {activeTab === "details" && (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Text Metrics</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
                  <span className="text-[11px] text-stone-500 block">Sinhala Characters</span>
                  <span className="text-xl font-bold text-stone-900">{stats.sinhalaCharCount}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
                  <span className="text-[11px] text-stone-500 block">Total Words</span>
                  <span className="text-xl font-bold text-stone-900">{stats.wordCount}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
                  <span className="text-[11px] text-stone-500 block">Total Lines</span>
                  <span className="text-xl font-bold text-stone-900">{stats.lineCount}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
                  <span className="text-[11px] text-stone-500 block">Latin / English Chars</span>
                  <span className="text-xl font-bold text-stone-900">{stats.latinCharCount}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
                  <span className="text-[11px] text-stone-500 block">Numbers &amp; Digits</span>
                  <span className="text-xl font-bold text-stone-900">{stats.digitCount}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
                  <span className="text-[11px] text-stone-500 block">Identified Segments</span>
                  <span className="text-xl font-bold text-stone-900">{result.blocks.length}</span>
                </div>
              </div>
            </div>

            {result.notesOrUncertainties && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <span className="font-semibold block mb-1">OCR Observations &amp; Notes:</span>
                <p>{result.notesOrUncertainties}</p>
              </div>
            )}

            {/* Sinhala Alphabet Diacritic Reference Guide */}
            <div className="p-4 bg-white border border-stone-200 rounded-xl">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Sinhala Diacritic Components (පිල්ලම් හා ලකුණු)
              </h4>
              <p className="text-xs text-stone-500 mb-3">
                Sinhala script (සිංහල හෝඩිය) is an abugida where each consonant inherently includes a vowel, modified with diacritic signs (pillam):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-stone-50 rounded border border-stone-200">
                  <span className="font-bold text-stone-900 font-['Noto_Sans_Sinhala']">ක + ා = කා</span>
                  <span className="text-[10px] text-stone-500 block">ඇලපිල්ල (Elapilla)</span>
                </div>
                <div className="p-2 bg-stone-50 rounded border border-stone-200">
                  <span className="font-bold text-stone-900 font-['Noto_Sans_Sinhala']">ක + ෙ = කෙ</span>
                  <span className="text-[10px] text-stone-500 block">කොම්බුව (Kombuva)</span>
                </div>
                <div className="p-2 bg-stone-50 rounded border border-stone-200">
                  <span className="font-bold text-stone-900 font-['Noto_Sans_Sinhala']">ක + ු = කු</span>
                  <span className="text-[10px] text-stone-500 block">පාපිල්ල (Papilla)</span>
                </div>
                <div className="p-2 bg-stone-50 rounded border border-stone-200">
                  <span className="font-bold text-stone-900 font-['Noto_Sans_Sinhala']">ක + ් = ක්</span>
                  <span className="text-[10px] text-stone-500 block">හල් ලකුණ (Al-lakuna)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats Bar */}
      <div className="px-5 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-3">
          <span>
            <strong className="text-stone-700 font-mono">{stats.sinhalaCharCount}</strong> Sinhala chars
          </span>
          <span>•</span>
          <span>
            <strong className="text-stone-700 font-mono">{stats.wordCount}</strong> words
          </span>
          <span>•</span>
          <span>
            <strong className="text-stone-700 font-mono">{stats.lineCount}</strong> lines
          </span>
        </div>
        <span className="text-[11px] text-stone-400">
          Scanned {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

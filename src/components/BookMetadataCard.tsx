import React, { useState } from "react";
import {
  Book,
  User,
  Building2,
  Barcode,
  Calendar,
  Tag,
  Copy,
  Check,
  Edit3,
  Save,
  X,
  ExternalLink,
  Quote,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { BookMetadata } from "../types";
import {
  generateApaCitation,
  generateMlaCitation,
  generateChicagoCitation,
  generateBibtex,
  generateCsvRow,
} from "../utils/bookCitation";
import { copyToClipboard, downloadTextFile } from "../utils/textExport";

interface BookMetadataCardProps {
  metadata: BookMetadata;
  onUpdateMetadata?: (updated: BookMetadata) => void;
}

export const BookMetadataCard: React.FC<BookMetadataCardProps> = ({
  metadata,
  onUpdateMetadata,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedMeta, setEditedMeta] = useState<BookMetadata>(metadata);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [citationFormat, setCitationFormat] = useState<"apa" | "mla" | "chicago" | "bibtex">("apa");
  const [showCitation, setShowCitation] = useState<boolean>(false);

  React.useEffect(() => {
    setEditedMeta(metadata);
  }, [metadata]);

  const handleCopy = async (text: string, key: string) => {
    if (!text) return;
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    }
  };

  const handleSaveEdit = () => {
    if (onUpdateMetadata) {
      onUpdateMetadata(editedMeta);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedMeta(metadata);
    setIsEditing(false);
  };

  const currentMeta = isEditing ? editedMeta : metadata;

  const currentCitation = React.useMemo(() => {
    switch (citationFormat) {
      case "apa":
        return generateApaCitation(currentMeta);
      case "mla":
        return generateMlaCitation(currentMeta);
      case "chicago":
        return generateChicagoCitation(currentMeta);
      case "bibtex":
        return generateBibtex(currentMeta);
      default:
        return generateApaCitation(currentMeta);
    }
  }, [citationFormat, currentMeta]);

  const downloadCsv = () => {
    const csvContent = generateCsvRow(currentMeta);
    const cleanTitle = (currentMeta.title.englishTranslation || currentMeta.title.sinhala || "book")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    downloadTextFile(csvContent, `${cleanTitle}-metadata.csv`, "text/csv");
  };

  const downloadJson = () => {
    const cleanTitle = (currentMeta.title.englishTranslation || currentMeta.title.sinhala || "book")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    downloadTextFile(JSON.stringify(currentMeta, null, 2), `${cleanTitle}-metadata.json`, "application/json");
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Banner with Badges & Toolbar */}
      <div className="p-4 bg-amber-50/70 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1.5 rounded-lg bg-amber-600 text-white shadow-xs">
            <Book className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span>Categorized Book Metadata</span>
              <span className="text-[11px] font-['Noto_Sans_Sinhala'] font-medium text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full">
                ග්‍රන්ථ තොරතුරු
              </span>
            </h3>
          </div>

          {currentMeta.genre && (
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-stone-200 text-stone-800">
              {currentMeta.genre}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setShowCitation(!showCitation)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              showCitation
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white hover:bg-stone-100 text-stone-700 border-stone-300"
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Citation</span>
          </button>

          <button
            onClick={downloadCsv}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 transition-colors"
            title="Export CSV for spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={downloadJson}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 transition-colors"
            title="Export structured JSON"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>JSON</span>
          </button>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Citation Box (Expandable) */}
      {showCitation && (
        <div className="p-4 bg-stone-900 text-stone-100 border-b border-stone-800 transition-all">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-400 font-medium">Style:</span>
              {(["apa", "mla", "chicago", "bibtex"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setCitationFormat(fmt)}
                  className={`px-2 py-0.5 text-xs font-mono uppercase rounded transition-colors ${
                    citationFormat === fmt
                      ? "bg-amber-500 text-stone-950 font-bold"
                      : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleCopy(currentCitation, "citation")}
              className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-medium transition-colors"
            >
              {copiedKey === "citation" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === "citation" ? "Copied!" : "Copy Citation"}</span>
            </button>
          </div>
          <div className="p-3 bg-stone-950 rounded-lg font-mono text-xs text-stone-200 whitespace-pre-wrap leading-relaxed border border-stone-800">
            {currentCitation}
          </div>
        </div>
      )}

      {/* Categorized Fields Grid */}
      <div className="p-5 space-y-4">
        {/* ROW 1: PRIMARY BOOK TITLE */}
        <div className="p-4 bg-amber-50/40 border border-amber-200/60 rounded-xl space-y-2 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
              <Book className="w-4 h-4 text-amber-600" />
              <span>1. Book Title (පොතේ නම)</span>
            </div>
            {!isEditing && (
              <button
                onClick={() => handleCopy(currentMeta.title.sinhala, "title")}
                className="flex items-center gap-1 px-2 py-1 text-xs text-stone-600 hover:text-amber-800 bg-white hover:bg-amber-100 rounded-md border border-stone-200 transition-colors"
                title="Copy Title"
              >
                {copiedKey === "title" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === "title" ? "Copied" : "Copy Title"}</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block">Sinhala Title:</label>
                <input
                  type="text"
                  value={editedMeta.title.sinhala}
                  onChange={(e) =>
                    setEditedMeta({
                      ...editedMeta,
                      title: { ...editedMeta.title, sinhala: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-sm bg-white border border-amber-400 rounded-lg font-['Noto_Sans_Sinhala'] font-bold text-stone-900"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block">Singlish Pronunciation:</label>
                  <input
                    type="text"
                    value={editedMeta.title.singlishTransliteration || ""}
                    onChange={(e) =>
                      setEditedMeta({
                        ...editedMeta,
                        title: { ...editedMeta.title, singlishTransliteration: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block">English Translation:</label>
                  <input
                    type="text"
                    value={editedMeta.title.englishTranslation || ""}
                    onChange={(e) =>
                      setEditedMeta({
                        ...editedMeta,
                        title: { ...editedMeta.title, englishTranslation: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1 text-xs bg-white border border-stone-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Noto_Sans_Sinhala'] text-stone-950 leading-snug">
                {currentMeta.title.sinhala || <span className="text-stone-400 italic">Title not detected</span>}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs">
                {currentMeta.title.singlishTransliteration && (
                  <span className="text-amber-800 font-mono">
                    Phonetic: <strong>{currentMeta.title.singlishTransliteration}</strong>
                  </span>
                )}
                {currentMeta.title.englishTranslation && (
                  <span className="text-stone-600">
                    Translation: <em>{currentMeta.title.englishTranslation}</em>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ROW 2: AUTHOR & SUB-HEADING (TWO COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AUTHOR CARD */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                <User className="w-4 h-4 text-amber-600" />
                <span>2. Author Name (කර්තෘ / රචකයා)</span>
              </div>
              {!isEditing && currentMeta.author.sinhala && (
                <button
                  onClick={() => handleCopy(currentMeta.author.sinhala, "author")}
                  className="p-1 hover:bg-stone-200 rounded text-stone-600 transition-colors"
                  title="Copy Author"
                >
                  {copiedKey === "author" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-[11px] text-stone-500 block">Sinhala Name:</label>
                  <input
                    type="text"
                    value={editedMeta.author.sinhala}
                    onChange={(e) =>
                      setEditedMeta({
                        ...editedMeta,
                        author: { ...editedMeta.author, sinhala: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1 text-sm bg-white border border-stone-300 rounded font-['Noto_Sans_Sinhala'] font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-500 block">Latin / English:</label>
                    <input
                      type="text"
                      value={editedMeta.author.englishOrLatin || ""}
                      onChange={(e) =>
                        setEditedMeta({
                          ...editedMeta,
                          author: { ...editedMeta.author, englishOrLatin: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 block">Role:</label>
                    <input
                      type="text"
                      value={editedMeta.author.role || ""}
                      onChange={(e) =>
                        setEditedMeta({
                          ...editedMeta,
                          author: { ...editedMeta.author, role: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded"
                      placeholder="Author, Translator"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-base font-bold font-['Noto_Sans_Sinhala'] text-stone-900">
                  {currentMeta.author.sinhala || <span className="text-stone-400 italic">Author not detected</span>}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-600">
                  {currentMeta.author.englishOrLatin && (
                    <span>{currentMeta.author.englishOrLatin}</span>
                  )}
                  {currentMeta.author.role && (
                    <span className="px-2 py-0.5 bg-amber-100/70 text-amber-900 rounded-full text-[10px] font-semibold">
                      {currentMeta.author.role}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SUB-HEADING / TAGLINE */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Tag className="w-4 h-4 text-amber-600" />
                <span>3. Sub-heading / Tagline (උප සිරැසි)</span>
              </div>
              {!isEditing && currentMeta.subHeading?.sinhala && (
                <button
                  onClick={() => handleCopy(currentMeta.subHeading?.sinhala || "", "subheading")}
                  className="p-1 hover:bg-stone-200 rounded text-stone-600 transition-colors"
                  title="Copy Subheading"
                >
                  {copiedKey === "subheading" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-[11px] text-stone-500 block">Sinhala Subtitle:</label>
                  <input
                    type="text"
                    value={editedMeta.subHeading?.sinhala || ""}
                    onChange={(e) =>
                      setEditedMeta({
                        ...editedMeta,
                        subHeading: { ...editedMeta.subHeading, sinhala: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1 text-sm bg-white border border-stone-300 rounded font-['Noto_Sans_Sinhala']"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-500 block">English Meaning:</label>
                  <input
                    type="text"
                    value={editedMeta.subHeading?.englishTranslation || ""}
                    onChange={(e) =>
                      setEditedMeta({
                        ...editedMeta,
                        subHeading: { ...editedMeta.subHeading, englishTranslation: e.target.value },
                      })
                    }
                    className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded"
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium font-['Noto_Sans_Sinhala'] text-stone-800">
                  {currentMeta.subHeading?.sinhala || <span className="text-stone-400 italic">None or not detected</span>}
                </p>
                {currentMeta.subHeading?.englishTranslation && (
                  <p className="text-xs text-stone-500 italic mt-0.5">
                    {currentMeta.subHeading.englishTranslation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ROW 3: PUBLISHER COMPANY & ISBN NUMBER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PUBLISHER */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>4. Publisher Company (ප්‍රකාශකයා)</span>
              </div>
              {!isEditing && currentMeta.publisher?.nameSinhala && (
                <button
                  onClick={() => handleCopy(currentMeta.publisher?.nameSinhala || "", "publisher")}
                  className="p-1 hover:bg-stone-200 rounded text-stone-600 transition-colors"
                  title="Copy Publisher"
                >
                  {copiedKey === "publisher" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-[11px] text-stone-500 block">Sinhala Publisher:</label>
                  <input
                    type="text"
                    value={editedMeta.publisher?.nameSinhala || ""}
                    onChange={(e) =>
                      setEditedMeta({
                        ...editedMeta,
                        publisher: { ...editedMeta.publisher, nameSinhala: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1 text-sm bg-white border border-stone-300 rounded font-['Noto_Sans_Sinhala']"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-500 block">English Name:</label>
                    <input
                      type="text"
                      value={editedMeta.publisher?.nameEnglish || ""}
                      onChange={(e) =>
                        setEditedMeta({
                          ...editedMeta,
                          publisher: { ...editedMeta.publisher, nameEnglish: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 block">Location / City:</label>
                    <input
                      type="text"
                      value={editedMeta.publisher?.locationOrAddress || ""}
                      onChange={(e) =>
                        setEditedMeta({
                          ...editedMeta,
                          publisher: { ...editedMeta.publisher, locationOrAddress: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-base font-semibold font-['Noto_Sans_Sinhala'] text-stone-900">
                  {currentMeta.publisher?.nameSinhala || <span className="text-stone-400 italic">Publisher not found</span>}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-600">
                  {currentMeta.publisher?.nameEnglish && (
                    <span>{currentMeta.publisher.nameEnglish}</span>
                  )}
                  {currentMeta.publisher?.locationOrAddress && (
                    <span className="text-stone-400 font-normal">
                      • {currentMeta.publisher.locationOrAddress}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ISBN & BARCODE */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Barcode className="w-4 h-4 text-amber-600" />
                <span>5. ISBN Number (ISBN අංකය)</span>
              </div>
              {!isEditing && currentMeta.isbn && (
                <div className="flex items-center gap-1">
                  <a
                    href={`https://www.google.com/search?tbo=p&tbm=bks&q=isbn:${currentMeta.isbn.replace(/[^0-9X]/gi, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:bg-stone-200 rounded text-stone-500 hover:text-stone-800 transition-colors"
                    title="Lookup ISBN on Google Books"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleCopy(currentMeta.isbn || "", "isbn")}
                    className="p-1 hover:bg-stone-200 rounded text-stone-600 transition-colors"
                    title="Copy ISBN"
                  >
                    {copiedKey === "isbn" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="pt-1">
                <label className="text-[11px] text-stone-500 block">ISBN String:</label>
                <input
                  type="text"
                  value={editedMeta.isbn || ""}
                  onChange={(e) =>
                    setEditedMeta({
                      ...editedMeta,
                      isbn: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-1 text-sm bg-white border border-stone-300 rounded font-mono"
                  placeholder="e.g. 978-955-573-820-1"
                />
              </div>
            ) : (
              <div>
                {currentMeta.isbn ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-base font-bold text-stone-900 bg-white px-2.5 py-1 rounded border border-stone-200">
                      {currentMeta.isbn}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-full">
                      Valid ISBN
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">
                    No ISBN barcode detected on this cover view. (Often located on back cover or copyright page)
                  </p>
                )}
                {currentMeta.barcodeText && (
                  <p className="text-[11px] font-mono text-stone-500 mt-1">
                    Barcode: {currentMeta.barcodeText}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ROW 4: EDITION, YEAR, PRICE & CATEGORY */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              Edition / Year
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editedMeta.editionOrYear || ""}
                onChange={(e) =>
                  setEditedMeta({ ...editedMeta, editionOrYear: e.target.value })
                }
                className="w-full mt-1 px-2 py-0.5 text-xs bg-white border border-stone-300 rounded font-['Noto_Sans_Sinhala']"
              />
            ) : (
              <span className="text-xs font-semibold text-stone-900 font-['Noto_Sans_Sinhala'] mt-1 block">
                {currentMeta.editionOrYear || "—"}
              </span>
            )}
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              Printed Price
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editedMeta.price || ""}
                onChange={(e) =>
                  setEditedMeta({ ...editedMeta, price: e.target.value })
                }
                className="w-full mt-1 px-2 py-0.5 text-xs bg-white border border-stone-300 rounded font-['Noto_Sans_Sinhala']"
              />
            ) : (
              <span className="text-xs font-semibold text-stone-900 font-['Noto_Sans_Sinhala'] mt-1 block">
                {currentMeta.price || "—"}
              </span>
            )}
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              Genre / Category
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editedMeta.genre || ""}
                onChange={(e) =>
                  setEditedMeta({ ...editedMeta, genre: e.target.value })
                }
                className="w-full mt-1 px-2 py-0.5 text-xs bg-white border border-stone-300 rounded"
              />
            ) : (
              <span className="text-xs font-semibold text-stone-900 mt-1 block truncate">
                {currentMeta.genre || "General Sinhala"}
              </span>
            )}
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              Cover Type
            </span>
            <span className="text-xs font-semibold text-stone-900 mt-1 block capitalize">
              {currentMeta.coverType?.replace("_", " ") || "Book Cover"}
            </span>
          </div>
        </div>

        {/* ROW 5: CONTRIBUTORS (IF PRESENT) */}
        {currentMeta.contributors && currentMeta.contributors.length > 0 && (
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
              Additional Contributors (සහයක දායකයින්)
            </span>
            <div className="flex flex-wrap gap-2">
              {currentMeta.contributors.map((c, i) => (
                <div key={i} className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs flex items-center gap-1.5 font-['Noto_Sans_Sinhala']">
                  <span className="font-semibold text-amber-900">{c.role}:</span>
                  <span className="text-stone-800">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROW 6: BACK COVER BLURB / SYNOPSIS (IF PRESENT) */}
        {currentMeta.blurbOrSummary && (
          <div className="p-4 bg-amber-50/30 border border-amber-200/50 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Back Cover Synopsis / Blurb (පසුපස කවරයේ සාරාංශය)</span>
              </span>
              <button
                onClick={() => handleCopy(currentMeta.blurbOrSummary || "", "blurb")}
                className="p-1 hover:bg-stone-200 rounded text-stone-600 transition-colors"
                title="Copy Blurb"
              >
                {copiedKey === "blurb" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs font-['Noto_Sans_Sinhala'] text-stone-800 leading-relaxed whitespace-pre-wrap">
              {currentMeta.blurbOrSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

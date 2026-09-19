export interface BookMetadata {
  title: {
    sinhala: string;
    englishTranslation?: string;
    singlishTransliteration?: string;
  };
  author: {
    sinhala: string;
    englishOrLatin?: string;
    role?: string; // e.g. "කර්තෘ / Author", "පරිවර්තක / Translator"
  };
  subHeading?: {
    sinhala?: string;
    englishTranslation?: string;
  };
  publisher?: {
    nameSinhala?: string;
    nameEnglish?: string;
    locationOrAddress?: string;
  };
  isbn?: string; // e.g. "978-955-xxx-xxx-x"
  isValidIsbn?: boolean;
  editionOrYear?: string; // e.g. "පළමු මුද්‍රණය 2024", "2023"
  price?: string; // e.g. "රු. 750.00" / "Rs. 750"
  genre?: string; // e.g. "නවකතාව (Novel)", "ඓතිහාසික (Historical)"
  blurbOrSummary?: string; // synopsis if from back cover
  coverType?: 'front_cover' | 'back_cover' | 'title_page' | 'spine' | 'jacket' | 'general_cover';
  contributors?: Array<{ role: string; name: string }>;
  barcodeText?: string;
  nationalLibraryNo?: string;
}

export interface TextBlock {
  sinhala: string;
  translation: string;
  transliteration: string;
  blockType:
    | 'book_title'
    | 'author_name'
    | 'sub_heading'
    | 'publisher'
    | 'isbn_barcode'
    | 'edition_year'
    | 'price'
    | 'blurb'
    | 'heading'
    | 'paragraph'
    | 'other';
  confidence?: 'high' | 'medium' | 'low';
}

export interface OCRResult {
  rawSinhalaText: string;
  documentType: string;
  summary: string;
  englishTranslation: string;
  singlishTransliteration: string;
  blocks: TextBlock[];
  bookMetadata?: BookMetadata;
  detectedLanguageMix?: string;
  notesOrUncertainties?: string;
  timestamp: number;
  imagePreviewUrl?: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  thumbnail: string;
  result: OCRResult;
  title: string;
}

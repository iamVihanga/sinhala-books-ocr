import { BookMetadata } from "../types";

export function generateApaCitation(meta: BookMetadata): string {
  const author = meta.author.englishOrLatin || meta.author.sinhala || "Unknown";
  const year = meta.editionOrYear ? (meta.editionOrYear.match(/\d{4}/)?.[0] || "n.d.") : "n.d.";
  const title = meta.title.englishTranslation
    ? `${meta.title.sinhala} [${meta.title.englishTranslation}]`
    : meta.title.sinhala;
  const publisher = meta.publisher?.nameEnglish || meta.publisher?.nameSinhala || "";

  return `${author}. (${year}). ${title}.${publisher ? ` ${publisher}.` : ""}`;
}

export function generateMlaCitation(meta: BookMetadata): string {
  const author = meta.author.englishOrLatin || meta.author.sinhala || "Unknown";
  const title = meta.title.sinhala;
  const publisher = meta.publisher?.nameEnglish || meta.publisher?.nameSinhala || "Publisher Unknown";
  const year = meta.editionOrYear ? (meta.editionOrYear.match(/\d{4}/)?.[0] || "n.d.") : "";

  return `${author}. ${title}.${publisher ? ` ${publisher}` : ""}${year ? `, ${year}.` : "."}`;
}

export function generateChicagoCitation(meta: BookMetadata): string {
  const author = meta.author.englishOrLatin || meta.author.sinhala || "Unknown";
  const title = meta.title.sinhala;
  const location = meta.publisher?.locationOrAddress || "";
  const publisher = meta.publisher?.nameEnglish || meta.publisher?.nameSinhala || "";
  const year = meta.editionOrYear ? (meta.editionOrYear.match(/\d{4}/)?.[0] || "") : "";

  let pubPart = "";
  if (location && publisher) {
    pubPart = ` ${location}: ${publisher}`;
  } else if (publisher) {
    pubPart = ` ${publisher}`;
  }
  if (year) {
    pubPart += `, ${year}`;
  }

  return `${author}. ${title}.${pubPart}.`;
}

export function generateBibtex(meta: BookMetadata): string {
  const citeKey = (meta.author.englishOrLatin || "author")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8) + (meta.editionOrYear?.match(/\d{4}/)?.[0] || "year");

  const title = meta.title.sinhala;
  const author = meta.author.englishOrLatin || meta.author.sinhala;
  const publisher = meta.publisher?.nameEnglish || meta.publisher?.nameSinhala || "";
  const year = meta.editionOrYear ? (meta.editionOrYear.match(/\d{4}/)?.[0] || "") : "";
  const isbn = meta.isbn || "";

  return `@book{${citeKey},
  title = {${title}},
  author = {${author}},
  publisher = {${publisher}},
  year = {${year}},
  isbn = {${isbn}}
}`;
}

export function generateCsvRow(meta: BookMetadata): string {
  const headers = ["Title (Sinhala)", "Title (English)", "Author", "Subtitle", "Publisher", "ISBN", "Edition/Year", "Price", "Genre"];
  const escape = (str?: string) => `"${(str || "").replace(/"/g, '""')}"`;
  
  const values = [
    escape(meta.title.sinhala),
    escape(meta.title.englishTranslation),
    escape(meta.author.sinhala + (meta.author.englishOrLatin ? ` (${meta.author.englishOrLatin})` : "")),
    escape(meta.subHeading?.sinhala),
    escape(meta.publisher?.nameSinhala + (meta.publisher?.locationOrAddress ? `, ${meta.publisher.locationOrAddress}` : "")),
    escape(meta.isbn),
    escape(meta.editionOrYear),
    escape(meta.price),
    escape(meta.genre)
  ];

  return `${headers.join(",")}\n${values.join(",")}`;
}

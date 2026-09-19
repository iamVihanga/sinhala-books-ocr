import { OCRResult } from "../types";

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  } else {
    // Fallback for non-secure contexts
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return Promise.resolve(successful);
    } catch {
      document.body.removeChild(textArea);
      return Promise.resolve(false);
    }
  }
}

export function downloadTextFile(content: string, filename: string, mimeType: string = "text/plain") {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAsMarkdown(result: OCRResult): string {
  const dateStr = new Date(result.timestamp).toLocaleString();
  return `# Sinhala Text OCR Extraction Report
*Extracted on: ${dateStr}*
*Document Type: ${result.documentType}*

## Extracted Sinhala Text (සිංහල අක්ෂර)
\`\`\`
${result.rawSinhalaText}
\`\`\`

## English Translation
${result.englishTranslation}

## Singlish / Romanized Transliteration
${result.singlishTransliteration}

## Structured Blocks
${result.blocks.map((b, i) => `### Segment ${i + 1} (${b.blockType})
- **Sinhala:** ${b.sinhala}
- **Transliteration:** ${b.transliteration}
- **English:** ${b.translation}
`).join("\n")}

---
*Summary: ${result.summary}*
${result.notesOrUncertainties ? `*Notes:* ${result.notesOrUncertainties}` : ""}
`;
}

export function analyzeSinhalaText(text: string) {
  const clean = text.trim();
  const words = clean ? clean.split(/\s+/).filter(Boolean) : [];
  
  // Sinhala unicode range: \u0D80-\u0DFF
  const sinhalaChars = clean.match(/[\u0D80-\u0DFF]/g) || [];
  const latinChars = clean.match(/[a-zA-Z]/g) || [];
  const digits = clean.match(/[0-9]/g) || [];
  const lines = clean ? clean.split(/\r?\n/).filter(line => line.trim().length > 0) : [];

  return {
    wordCount: words.length,
    charCount: clean.length,
    sinhalaCharCount: sinhalaChars.length,
    latinCharCount: latinChars.length,
    digitCount: digits.length,
    lineCount: lines.length,
  };
}

export function speakText(text: string, lang: string = "si-LK"): Promise<boolean> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const sinhalaVoice = voices.find(v => v.lang.startsWith("si"));
    if (sinhalaVoice) {
      utterance.voice = sinhalaVoice;
      utterance.lang = sinhalaVoice.lang;
    } else {
      // Fallback
      utterance.lang = lang;
    }

    utterance.rate = 0.9; // slightly slower for clearer Sinhala syllable articulation
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);

    window.speechSynthesis.speak(utterance);
  });
}

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for high resolution scan uploads
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: Date.now()
  });
});

// Helper for retrying on 503 / 429 errors and falling back to alternative models
async function generateOCRWithFallback(
  ai: GoogleGenAI,
  detectedMime: string,
  cleanBase64: string,
  prompt: string,
  responseSchema: any
) {
  // Use recommended models: gemini-flash-latest, gemini-3.8-flash, gemini-3.1-flash-lite
  const candidateModels = [
    "gemini-flash-latest",
    "gemini-3.8-flash",
    "gemini-3.1-flash-lite",
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    // Up to 2 attempts per candidate with backoff if experiencing temporary spikes
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`Attempting Sinhala OCR with model: ${model} (attempt ${attempt + 1})`);
        const response = await ai.models.generateContent({
          model: model,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: detectedMime,
                  data: cleanBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          },
        });

        if (response && response.text) {
          return { responseText: response.text, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        const errString = String(err?.message || err);
        console.warn(`Model ${model} attempt ${attempt + 1} failed:`, errString);

        const isTemporary =
          errString.includes("503") ||
          errString.includes("UNAVAILABLE") ||
          errString.includes("high demand") ||
          errString.includes("429") ||
          errString.includes("RESOURCE_EXHAUSTED") ||
          errString.includes("overloaded");

        if (isTemporary && attempt === 0) {
          // Brief pause before retry
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        // If not temporary or second attempt failed, fall back to next model candidate
        break;
      }
    }
  }

  throw lastError;
}

// Sinhala OCR Endpoint
app.post("/api/ocr", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured on the server. Please ensure the API key is provided in settings."
      });
    }

    const { imageBase64, mimeType = "image/jpeg" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing image data. Please upload a valid image." });
    }

    // Clean base64 string if it contains data URI header
    let cleanBase64 = imageBase64;
    let detectedMime = mimeType;

    const dataUriMatch = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (dataUriMatch) {
      detectedMime = dataUriMatch[1];
      cleanBase64 = dataUriMatch[2];
    }

    // Ensure MIME type is compatible with Gemini Vision
    if (detectedMime === "image/svg+xml" || !["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(detectedMime)) {
      detectedMime = "image/png";
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `You are an expert Optical Character Recognition (OCR) and Bibliographic Cataloging AI specializing in Sinhala books and documents (සිංහල පොත් කවර සහ ලේඛන).
You are analyzing an image of a Sinhala book cover (front cover, back cover, spine, title page, or copyright imprint page).

Carefully perform high-precision extraction and categorize all book information:
1. BOOK TITLE (පොතේ නම / ග්‍රන්ථ නාමය):
   - Extract the full primary book title in accurate Sinhala Unicode.
   - Provide the phonetic Singlish transliteration and English translated title.
2. AUTHOR NAME (කර්තෘ / රචකයා / ලේඛකයා):
   - Identify the primary author's name in Sinhala, Latin transliteration, and role (e.g. "කර්තෘ / Author", "පරිවර්තක / Translator", "සංස්කාරක / Editor").
3. SUB-HEADINGS & TAGLINES (උප සිරැසි / විස්තරාත්මක පාඨ):
   - Identify subtitles, series information, volume numbers, or award banners (e.g. "ස්වර්ණ පුස්තක සම්මානලාභී නවකතාව", "ඓතිහාසික ගවේෂණ", "දෙවන මුද්‍රණය").
4. PUBLISHER COMPANY & PRESS (ප්‍රකාශන ආයතනය / මුද්‍රණාලය):
   - Identify the publishing house (e.g. සරසවි ප්‍රකාශකයෝ / Sarasavi, ඇස්. ගොඩගේ / Godage, එම්. ඩී. ගුණසේන / M.D. Gunasena, විසිදුනු / Visidunu, දයාවංශ ජයකොඩි / Dayawansa Jayakody, සමයවර්ධන / Samayawardhana, ප්‍රදීප / Pradeepa, etc.).
   - Extract publisher city or address if visible (e.g. කොළඹ, නුගේගොඩ, මරදාන).
5. ISBN NUMBER (ISBN අංකය) & BARCODE:
   - Identify any ISBN number (e.g. 978-955-xxx-xxx-x or 10-digit ISBN). Format it cleanly with hyphens if identifiable.
   - Note if valid or if a barcode number is present.
6. EDITION, YEAR & PRICE:
   - Print year, edition statement (e.g. "පළමු මුද්‍රණය 2024", "තෙවන සංස්කරණය"), and price (e.g. "රු. 850.00" / "Rs. 850").
7. GENRE & BLURB:
   - Genre (නවකතාව, කෙටිකතා, ළමා කතා, කාව්‍ය, ඓතිහාසික, පරිවර්තන, දර්ශනය, ශාස්ත්‍රීය).
   - If this is a back cover or jacket, extract the full blurb/synopsis.
8. ALL SINHALA TEXT:
   - Extract ALL visible text verbatim into rawSinhalaText with correct Unicode diacritics (පිල්ලම්, කොම්බු, ඇලපිලි, බැඳි අකුරු).
   - Provide structured blocks tagging each segment as book_title, author_name, sub_heading, publisher, isbn_barcode, edition_year, price, blurb, or paragraph.

If the image is not a book cover, still extract the title, heading, and author/creator if present, or label accordingly.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        rawSinhalaText: {
          type: Type.STRING,
          description: "Complete verbatim extracted Sinhala text preserving authentic Unicode characters and layout line breaks."
        },
        documentType: {
          type: Type.STRING,
          description: "E.g. 'Book Front Cover', 'Book Back Cover with Blurb & Barcode', 'Book Title / Copyright Page', 'Book Spine', 'Literature Document'"
        },
        summary: {
          type: Type.STRING,
          description: "A concise 1-2 sentence English explanation of the book and its content."
        },
        englishTranslation: {
          type: Type.STRING,
          description: "Full English translation of all extracted text."
        },
        singlishTransliteration: {
          type: Type.STRING,
          description: "Romanized Singlish phonetics for easy pronunciation."
        },
        bookMetadata: {
          type: Type.OBJECT,
          description: "Categorized bibliographic metadata specifically extracted for this book",
          properties: {
            title: {
              type: Type.OBJECT,
              properties: {
                sinhala: { type: Type.STRING, description: "Book title in Sinhala Unicode" },
                englishTranslation: { type: Type.STRING, description: "English translation of book title" },
                singlishTransliteration: { type: Type.STRING, description: "Phonetic pronunciation of book title" }
              },
              required: ["sinhala"]
            },
            author: {
              type: Type.OBJECT,
              properties: {
                sinhala: { type: Type.STRING, description: "Author name in Sinhala Unicode" },
                englishOrLatin: { type: Type.STRING, description: "Author name in English or Latin transliteration" },
                role: { type: Type.STRING, description: "Author, Translator, Editor, Illustrator, etc." }
              },
              required: ["sinhala"]
            },
            subHeading: {
              type: Type.OBJECT,
              properties: {
                sinhala: { type: Type.STRING, description: "Sub-heading or tagline in Sinhala" },
                englishTranslation: { type: Type.STRING, description: "English meaning of sub-heading" }
              }
            },
            publisher: {
              type: Type.OBJECT,
              properties: {
                nameSinhala: { type: Type.STRING, description: "Publisher company name in Sinhala" },
                nameEnglish: { type: Type.STRING, description: "Publisher name in English" },
                locationOrAddress: { type: Type.STRING, description: "City or address (e.g. Colombo, Nugegoda)" }
              }
            },
            isbn: {
              type: Type.STRING,
              description: "ISBN-13 (e.g., 978-955-573-820-1) or ISBN-10 number if found, or empty string"
            },
            isValidIsbn: {
              type: Type.BOOLEAN,
              description: "Whether a valid ISBN format was identified"
            },
            editionOrYear: {
              type: Type.STRING,
              description: "Print edition or publication year (e.g., 2024, 1st Edition)"
            },
            price: {
              type: Type.STRING,
              description: "Printed price (e.g. රු. 750.00 or Rs. 750)"
            },
            genre: {
              type: Type.STRING,
              description: "Genre or category (e.g. Novel, Short Stories, History, Children, Poetry, Translation)"
            },
            blurbOrSummary: {
              type: Type.STRING,
              description: "Back-cover blurb or book summary if present"
            },
            coverType: {
              type: Type.STRING,
              description: "front_cover | back_cover | title_page | spine | jacket | general_cover"
            },
            contributors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  name: { type: Type.STRING }
                },
                required: ["role", "name"]
              }
            },
            barcodeText: {
              type: Type.STRING,
              description: "Barcode numbers if visible on back cover"
            }
          },
          required: ["title", "author"]
        },
        detectedLanguageMix: {
          type: Type.STRING,
          description: "E.g. 'Pure Sinhala', 'Sinhala with English publisher details', 'Bilingual'."
        },
        notesOrUncertainties: {
          type: Type.STRING,
          description: "Notes on any illegible, damaged, or stylized font characters."
        },
        blocks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sinhala: { type: Type.STRING, description: "Text segment in original Sinhala" },
              translation: { type: Type.STRING, description: "English translation for this segment" },
              transliteration: { type: Type.STRING, description: "Singlish pronunciation for this segment" },
              blockType: {
                type: Type.STRING,
                description: "book_title | author_name | sub_heading | publisher | isbn_barcode | edition_year | price | blurb | heading | paragraph | other"
              },
              confidence: {
                type: Type.STRING,
                description: "high | medium | low"
              }
            },
            required: ["sinhala", "translation", "transliteration", "blockType"]
          }
        }
      },
      required: ["rawSinhalaText", "documentType", "summary", "englishTranslation", "singlishTransliteration", "blocks"]
    };

    const { responseText } = await generateOCRWithFallback(
      ai,
      detectedMime,
      cleanBase64,
      prompt,
      responseSchema
    );

    if (!responseText) {
      throw new Error("No response generated from vision model.");
    }

    const parsed = JSON.parse(responseText);
    parsed.timestamp = Date.now();

    return res.json(parsed);
  } catch (error: any) {
    console.error("OCR Processing Error:", error);

    // Extract a human-readable error message if the error contains a JSON payload
    let userMessage = "Failed to extract Sinhala text from the provided image. Please try again.";
    if (error?.message) {
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.error?.message) {
          userMessage = parsed.error.message;
        } else {
          userMessage = error.message;
        }
      } catch {
        userMessage = error.message;
      }
    }

    return res.status(500).json({
      error: userMessage
    });
  }
});

async function startServer() {
  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sinhala OCR Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

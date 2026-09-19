// Helper to generate realistic Sinhala book cover data URLs for testing and demonstration

function createSvgDataUrl(width: number, height: number, svgContent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export interface SampleImage {
  id: string;
  title: string;
  sinhalaTitle: string;
  description: string;
  category: 'front_cover' | 'back_cover' | 'academic' | 'children';
  dataUrl: string;
}

// 1. Classical Sinhala Novel Front Cover: "ගම්පෙරළිය" by Martin Wickramasinghe
const sample1Svg = `
  <defs>
    <linearGradient id="novelBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffdf5" />
      <stop offset="50%" stop-color="#fcf6e8" />
      <stop offset="100%" stop-color="#f4ecd6" />
    </linearGradient>
    <linearGradient id="goldBanner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>

  <!-- Book Canvas -->
  <rect width="600" height="850" fill="url(#novelBg)"/>
  <!-- Spine Shadow & Binding -->
  <rect x="0" y="0" width="28" height="850" fill="#78350f" opacity="0.85"/>
  <line x1="28" y1="0" x2="28" y2="850" stroke="#451a03" stroke-width="2"/>
  <line x1="32" y1="0" x2="32" y2="850" stroke="#fef3c7" stroke-width="1" opacity="0.5"/>

  <!-- Ornate Outer Border -->
  <rect x="48" y="30" width="510" height="790" fill="none" stroke="#92400e" stroke-width="3" rx="8"/>
  <rect x="58" y="40" width="490" height="770" fill="none" stroke="#d97706" stroke-width="1.5" stroke-dasharray="8,4" rx="4"/>

  <!-- Top Genre / Series Ribbon -->
  <rect x="140" y="80" width="320" height="34" rx="17" fill="url(#goldBanner)"/>
  <text x="300" y="103" font-family="'Noto Sans Sinhala', sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">
    සම්භාව්‍ය සිංහල සාහිත්‍ය මාලාව
  </text>

  <!-- Award / Recognition Seal -->
  <circle cx="300" cy="180" r="32" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="300" y="176" font-family="'Noto Sans Sinhala', sans-serif" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">
    ස්වර්ණ
  </text>
  <text x="300" y="192" font-family="'Noto Sans Sinhala', sans-serif" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">
    පුස්තක
  </text>

  <!-- MAIN BOOK TITLE -->
  <text x="300" y="290" font-family="'Noto Sans Sinhala', sans-serif" font-size="52" font-weight="900" fill="#451a03" text-anchor="middle">
    ගම්පෙරළිය
  </text>

  <!-- SUBTITLE / TAGLINE -->
  <text x="300" y="335" font-family="'Noto Sans Sinhala', sans-serif" font-size="18" font-weight="600" fill="#92400e" text-anchor="middle">
    - සම්භාව්‍ය යථාර්ථවාදී නවකතාව -
  </text>
  <text x="300" y="360" font-family="'Noto Sans Sinhala', sans-serif" font-size="14" font-style="italic" fill="#78716c" text-anchor="middle">
    (The Village Transformation)
  </text>

  <line x1="180" y1="400" x2="420" y2="400" stroke="#d97706" stroke-width="2"/>
  <circle cx="300" cy="400" r="4" fill="#92400e"/>

  <!-- AUTHOR SECTION -->
  <text x="300" y="470" font-family="'Noto Sans Sinhala', sans-serif" font-size="15" font-weight="500" fill="#78716c" text-anchor="middle">
    කර්තෘ
  </text>
  <text x="300" y="515" font-family="'Noto Sans Sinhala', sans-serif" font-size="32" font-weight="800" fill="#1c1917" text-anchor="middle">
    මාර්ටින් වික්‍රමසිංහ
  </text>
  <text x="300" y="545" font-family="'Noto Sans Sinhala', sans-serif" font-size="15" font-weight="500" fill="#57534e" text-anchor="middle">
    Martin Wickramasinghe
  </text>

  <!-- EDITION & YEAR -->
  <rect x="180" y="600" width="240" height="32" rx="6" fill="#f5ebe0"/>
  <text x="300" y="621" font-family="'Noto Sans Sinhala', sans-serif" font-size="13" font-weight="bold" fill="#78350f" text-anchor="middle">
    28 වන මුද්‍රණය • 2024
  </text>

  <!-- PUBLISHER & ISBN SECTION -->
  <line x1="100" y1="670" x2="500" y2="670" stroke="#e7e5e4" stroke-width="1.5"/>

  <text x="300" y="705" font-family="'Noto Sans Sinhala', sans-serif" font-size="19" font-weight="bold" fill="#92400e" text-anchor="middle">
    සරසවි ප්‍රකාශකයෝ
  </text>
  <text x="300" y="728" font-family="sans-serif" font-size="12" font-weight="500" fill="#78716c" text-anchor="middle">
    Sarasavi Publishers (Pvt) Ltd • Nugegoda
  </text>

  <rect x="190" y="745" width="220" height="26" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="300" y="762" font-family="monospace" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">
    ISBN 978-955-573-820-1
  </text>
  <text x="300" y="790" font-family="'Noto Sans Sinhala', sans-serif" font-size="13" font-weight="bold" fill="#b45309" text-anchor="middle">
    මිල: රු. 750.00
  </text>
`;

// 2. Book Back Cover with Blurb, Barcode & Publisher: "විරාගය" (Viragaya)
const sample2Svg = `
  <defs>
    <linearGradient id="backCoverBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fafaf9" />
      <stop offset="100%" stop-color="#f5f5f4" />
    </linearGradient>
  </defs>

  <rect width="600" height="850" fill="url(#backCoverBg)"/>
  <rect x="35" y="30" width="530" height="790" fill="none" stroke="#78716c" stroke-width="1.5" rx="6"/>

  <!-- Top Header -->
  <text x="300" y="75" font-family="'Noto Sans Sinhala', sans-serif" font-size="28" font-weight="bold" fill="#1c1917" text-anchor="middle">
    විරාගය
  </text>
  <text x="300" y="102" font-family="'Noto Sans Sinhala', sans-serif" font-size="16" font-weight="600" fill="#b45309" text-anchor="middle">
    මාර්ටින් වික්‍රමසිංහ
  </text>
  <line x1="80" y1="120" x2="520" y2="120" stroke="#d6d3d1" stroke-width="1"/>

  <!-- Back Cover Blurb Heading -->
  <text x="65" y="160" font-family="'Noto Sans Sinhala', sans-serif" font-size="15" font-weight="bold" fill="#44403c">
    පොත පිළිබඳ විචාරක සටහන:
  </text>

  <!-- Blurb Paragraphs in Sinhala -->
  <text x="65" y="195" font-family="'Noto Sans Sinhala', sans-serif" font-size="16" font-weight="400" fill="#292524">
    අරවින්ද ජයසේනගේ චරිතය තුළින් මිනිස් සිතෙහි පවතින
  </text>
  <text x="65" y="225" font-family="'Noto Sans Sinhala', sans-serif" font-size="16" font-weight="400" fill="#292524">
    සියුම් මනෝභාවයන් හා ආශාවන්ගේ නිසරු බව විරාගය නවකතාව
  </text>
  <text x="65" y="255" font-family="'Noto Sans Sinhala', sans-serif" font-size="16" font-weight="400" fill="#292524">
    මැනවින් විවරණය කරයි. සිංහල සාහිත්‍ය ඉතිහාසයේ ලියැවුණු
  </text>
  <text x="65" y="285" font-family="'Noto Sans Sinhala', sans-serif" font-size="16" font-weight="400" fill="#292524">
    විශිෂ්ටතම මනෝවිද්‍යාත්මක නවකතාවක් ලෙස මෙය සැලකේ.
  </text>

  <text x="65" y="335" font-family="'Noto Sans Sinhala', sans-serif" font-size="16" font-weight="400" fill="#292524">
    නූතන සාහිත්‍ය රසිකයන්ගේ මෙන්ම විශ්වවිද්‍යාල සිසුන්ගේ
  </text>
  <text x="65" y="365" font-family="'Noto Sans Sinhala', sans-serif" font-size="16" font-weight="400" fill="#292524">
    නිරන්තර අධ්‍යයනයට ලක්වන අගනා සම්භාව්‍ය කෘතියකි.
  </text>

  <!-- Author Quote Box -->
  <rect x="65" y="415" width="470" height="90" rx="8" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5"/>
  <text x="85" y="445" font-family="'Noto Sans Sinhala', sans-serif" font-size="14" font-style="italic" fill="#92400e">
    "ජීවිතය තේරුම් ගැනීමට වෙහෙසෙන මිනිසාගේ ශෝකාන්තය"
  </text>
  <text x="430" y="480" font-family="'Noto Sans Sinhala', sans-serif" font-size="12" font-weight="bold" fill="#78350f">
    - සාහිත්‍ය විමර්ශන මණ්ඩලය
  </text>

  <!-- Publisher and Imprint -->
  <line x1="65" y1="545" x2="535" y2="545" stroke="#e7e5e4" stroke-width="1"/>

  <text x="65" y="580" font-family="'Noto Sans Sinhala', sans-serif" font-size="18" font-weight="bold" fill="#0f172a">
    විසිදුනු ප්‍රකාශකයෝ
  </text>
  <text x="65" y="605" font-family="sans-serif" font-size="13" fill="#64748b">
    Visidunu Prakashakayo • Colombo, Sri Lanka
  </text>
  <text x="65" y="628" font-family="'Noto Sans Sinhala', sans-serif" font-size="13" fill="#475569">
    දුරකථන: 011-2856789 • විද්‍යුත් තැපෑල: info@visidunu.lk
  </text>

  <!-- Real-looking Barcode Graphic & ISBN Block -->
  <rect x="65" y="665" width="260" height="110" fill="#ffffff" stroke="#94a3b8" rx="4"/>
  <text x="195" y="685" font-family="monospace" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">
    ISBN 978-955-123-456-7
  </text>
  
  <!-- Barcode lines simulation -->
  <g fill="#0f172a">
    <rect x="85" y="695" width="3" height="55"/>
    <rect x="91" y="695" width="2" height="55"/>
    <rect x="96" y="695" width="5" height="55"/>
    <rect x="105" y="695" width="2" height="55"/>
    <rect x="110" y="695" width="4" height="55"/>
    <rect x="118" y="695" width="2" height="55"/>
    <rect x="123" y="695" width="5" height="55"/>
    <rect x="132" y="695" width="3" height="55"/>
    <rect x="140" y="695" width="2" height="55"/>
    <rect x="145" y="695" width="4" height="55"/>
    <rect x="153" y="695" width="2" height="55"/>
    <rect x="160" y="695" width="5" height="55"/>
    <rect x="170" y="695" width="3" height="55"/>
    <rect x="177" y="695" width="2" height="55"/>
    <rect x="183" y="695" width="4" height="55"/>
    <rect x="192" y="695" width="3" height="55"/>
    <rect x="200" y="695" width="2" height="55"/>
    <rect x="205" y="695" width="5" height="55"/>
    <rect x="215" y="695" width="3" height="55"/>
    <rect x="222" y="695" width="2" height="55"/>
    <rect x="230" y="695" width="4" height="55"/>
    <rect x="240" y="695" width="3" height="55"/>
    <rect x="248" y="695" width="2" height="55"/>
    <rect x="254" y="695" width="4" height="55"/>
    <rect x="262" y="695" width="3" height="55"/>
    <rect x="270" y="695" width="2" height="55"/>
    <rect x="278" y="695" width="4" height="55"/>
  </g>
  <text x="195" y="765" font-family="monospace" font-size="10" fill="#334155" text-anchor="middle">
    9 789551 234567
  </text>

  <!-- Price Tag in Right Corner -->
  <rect x="375" y="685" width="160" height="65" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
  <text x="455" y="710" font-family="'Noto Sans Sinhala', sans-serif" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">
    නියමිත මිල
  </text>
  <text x="455" y="736" font-family="'Noto Sans Sinhala', sans-serif" font-size="20" font-weight="900" fill="#065f46" text-anchor="middle">
    රු. 650.00
  </text>
`;

// 3. Academic / Historical Research Book Cover: "පුරාණ ලංකාවේ ශිෂ්ටාචාරය"
const sample3Svg = `
  <defs>
    <linearGradient id="academicBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>

  <rect width="600" height="850" fill="url(#academicBg)"/>
  <!-- Gold trim border -->
  <rect x="35" y="30" width="530" height="790" fill="none" stroke="#d4af37" stroke-width="2.5" rx="4"/>
  <rect x="45" y="40" width="510" height="770" fill="none" stroke="#b45309" stroke-width="1" stroke-dasharray="4,4"/>

  <!-- Academic Department Tag -->
  <text x="300" y="90" font-family="'Noto Sans Sinhala', sans-serif" font-size="14" font-weight="600" fill="#94a3b8" text-anchor="middle" letter-spacing="1">
    පුරාවිද්‍යා හා ඉතිහාස පර්යේෂණ ග්‍රන්ථ මාලාව
  </text>

  <line x1="200" y1="110" x2="400" y2="110" stroke="#d4af37" stroke-width="1.5"/>

  <!-- Main Title -->
  <text x="300" y="200" font-family="'Noto Sans Sinhala', sans-serif" font-size="36" font-weight="bold" fill="#f8fafc" text-anchor="middle">
    පුරාණ ලංකාවේ
  </text>
  <text x="300" y="255" font-family="'Noto Sans Sinhala', sans-serif" font-size="44" font-weight="900" fill="#fbbf24" text-anchor="middle">
    ශිෂ්ටාචාරය
  </text>

  <!-- Sub-heading -->
  <text x="300" y="310" font-family="'Noto Sans Sinhala', sans-serif" font-size="18" font-weight="500" fill="#cbd5e1" text-anchor="middle">
    පුරාවිද්‍යාත්මක හා ඓතිහාසික විමර්ශනය
  </text>
  <text x="300" y="335" font-family="sans-serif" font-size="13" font-style="italic" fill="#94a3b8" text-anchor="middle">
    Civilization of Ancient Lanka: An Archaeological Survey
  </text>

  <!-- Decorative Antique Emblem -->
  <circle cx="300" cy="420" r="45" fill="none" stroke="#d4af37" stroke-width="2"/>
  <circle cx="300" cy="420" r="38" fill="none" stroke="#d4af37" stroke-width="1" stroke-dasharray="6,3"/>
  <text x="300" y="426" font-family="'Noto Sans Sinhala', sans-serif" font-size="18" font-weight="bold" fill="#fbbf24" text-anchor="middle">
    ශ්‍රී
  </text>

  <!-- Author Name & Title -->
  <text x="300" y="525" font-family="'Noto Sans Sinhala', sans-serif" font-size="16" font-weight="600" fill="#fbbf24" text-anchor="middle">
    මහාචාර්ය
  </text>
  <text x="300" y="565" font-family="'Noto Sans Sinhala', sans-serif" font-size="30" font-weight="800" fill="#f8fafc" text-anchor="middle">
    සෙනරත් පරණවිතාන
  </text>
  <text x="300" y="595" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">
    Prof. Senarath Paranavitana
  </text>

  <!-- Publisher and Details -->
  <line x1="80" y1="670" x2="520" y2="670" stroke="#334155" stroke-width="1"/>

  <text x="300" y="705" font-family="'Noto Sans Sinhala', sans-serif" font-size="20" font-weight="bold" fill="#f8fafc" text-anchor="middle">
    ඇස්. ගොඩගේ සහ සහෝදරයෝ
  </text>
  <text x="300" y="728" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">
    S. Godage &amp; Brothers (Pvt) Ltd • Colombo 10
  </text>

  <rect x="180" y="745" width="240" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
  <text x="300" y="762" font-family="monospace" font-size="12" font-weight="bold" fill="#38bdf8" text-anchor="middle">
    ISBN 978-955-20-9876-4
  </text>
  <text x="300" y="792" font-family="'Noto Sans Sinhala', sans-serif" font-size="13" font-weight="bold" fill="#fbbf24" text-anchor="middle">
    තෙවන සංස්කරණය • මිල: රු. 1,200.00
  </text>
`;

// 4. Children's Book Cover: "හඳහාමි සහ තවත් කතා"
const sample4Svg = `
  <defs>
    <linearGradient id="childBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef9c3" />
      <stop offset="100%" stop-color="#fed7aa" />
    </linearGradient>
  </defs>

  <rect width="600" height="850" fill="url(#childBg)"/>
  <rect x="30" y="30" width="540" height="790" fill="none" stroke="#ea580c" stroke-width="3" rx="16"/>

  <!-- Top Badge -->
  <rect x="190" y="60" width="220" height="34" rx="17" fill="#ea580c"/>
  <text x="300" y="82" font-family="'Noto Sans Sinhala', sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">
    ළමා සාහිත්‍ය මාලාව
  </text>

  <!-- Illustration of Moon & Rabbit in SVG -->
  <circle cx="300" cy="220" r="85" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
  <circle cx="285" cy="205" r="10" fill="#eab308"/>
  <circle cx="325" cy="225" r="14" fill="#eab308"/>
  <circle cx="295" cy="255" r="8" fill="#eab308"/>
  
  <!-- Book Title -->
  <text x="300" y="365" font-family="'Noto Sans Sinhala', sans-serif" font-size="44" font-weight="900" fill="#9a3412" text-anchor="middle">
    හඳහාමි
  </text>
  <text x="300" y="415" font-family="'Noto Sans Sinhala', sans-serif" font-size="26" font-weight="bold" fill="#c2410c" text-anchor="middle">
    සහ තවත් කතා
  </text>

  <!-- Subtitle -->
  <text x="300" y="460" font-family="'Noto Sans Sinhala', sans-serif" font-size="16" font-weight="600" fill="#7c2d12" text-anchor="middle">
    ළමා කාව්‍ය හා උපමා කතා එකතුව
  </text>

  <!-- Author & Illustrator -->
  <rect x="110" y="505" width="380" height="110" rx="12" fill="#ffffff" stroke="#fdba74" stroke-width="2"/>
  
  <text x="300" y="535" font-family="'Noto Sans Sinhala', sans-serif" font-size="14" font-weight="500" fill="#78716c" text-anchor="middle">
    ප්‍රවීණ සාහිත්‍යධර
  </text>
  <text x="300" y="565" font-family="'Noto Sans Sinhala', sans-serif" font-size="24" font-weight="bold" fill="#1c1917" text-anchor="middle">
    කුමාරතුංග මුනිදාස
  </text>
  <text x="300" y="595" font-family="'Noto Sans Sinhala', sans-serif" font-size="13" font-weight="500" fill="#ea580c" text-anchor="middle">
    චිත්‍ර නිර්මාණය: ජී. එල්. ගෞතමදාස
  </text>

  <!-- Publisher and Details -->
  <text x="300" y="680" font-family="'Noto Sans Sinhala', sans-serif" font-size="20" font-weight="bold" fill="#7c2d12" text-anchor="middle">
    එම්. ඩී. ගුණසේන සහ සමාගම
  </text>
  <text x="300" y="705" font-family="sans-serif" font-size="13" fill="#78716c" text-anchor="middle">
    M.D. Gunasena &amp; Co. Ltd • Colombo
  </text>

  <rect x="180" y="730" width="240" height="26" rx="4" fill="#ffffff" stroke="#ea580c"/>
  <text x="300" y="747" font-family="monospace" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">
    ISBN 978-955-21-0123-9
  </text>
  <text x="300" y="780" font-family="'Noto Sans Sinhala', sans-serif" font-size="14" font-weight="bold" fill="#c2410c" text-anchor="middle">
    මිල: රු. 450.00
  </text>
`;

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: "gamperaliya-front",
    title: "Gamperaliya Front Cover",
    sinhalaTitle: "ගම්පෙරළිය (පෙරමුණු කවරය)",
    description: "Book Title, Author (Martin Wickramasinghe), Sub-heading, Sarasavi Publisher, ISBN 978-955-573-820-1, Price",
    category: "front_cover",
    dataUrl: createSvgDataUrl(600, 850, sample1Svg),
  },
  {
    id: "viragaya-back",
    title: "Viragaya Back Cover & Barcode",
    sinhalaTitle: "විරාගය (පසුපස කවරය සහ Barcode)",
    description: "Book Title, Author, Synopsis/Blurb, Visidunu Publisher, ISBN Barcode 978-955-123-456-7, Price Tag",
    category: "back_cover",
    dataUrl: createSvgDataUrl(600, 850, sample2Svg),
  },
  {
    id: "ancient-lanka-academic",
    title: "Ancient Lanka Civilization Cover",
    sinhalaTitle: "පුරාණ ලංකාවේ ශිෂ්ටාචාරය (පර්යේෂණ ග්‍රන්ථය)",
    description: "Historical Book Title, Prof. Senarath Paranavitana, Godage Publisher, 3rd Edition, ISBN 978-955-20-9876-4",
    category: "academic",
    dataUrl: createSvgDataUrl(600, 850, sample3Svg),
  },
  {
    id: "handahami-children",
    title: "Handahami Storybook Cover",
    sinhalaTitle: "හඳහාමි සහ තවත් කතා (ළමා කෘතිය)",
    description: "Children's Classic Title, Author Kumaratunga Munidasa, Illustrator, M.D. Gunasena, ISBN 978-955-21-0123-9",
    category: "children",
    dataUrl: createSvgDataUrl(600, 850, sample4Svg),
  },
];

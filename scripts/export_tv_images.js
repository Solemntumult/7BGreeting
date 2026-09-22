const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUTPUT_DIR = path.resolve('c:/Users/USER/Desktop/suite7B/SEVENB_TV_IMAGES_AVEC_TEXTES');
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const PHOTOS_DIR = path.resolve(PUBLIC_DIR, 'selection_photos_tv');
const LOGO_PATH = path.resolve(PUBLIC_DIR, 'sevenblogo.svg');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function getLogoBuffer(size = 80) {
  return await sharp(LOGO_PATH)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

// 1. Export Standard Slide (Lower-third elegant typography)
async function exportStandardSlide({ index, id, filename, category, title, description, outputName }) {
  console.log(`Rendering [${index}] ${outputName}...`);
  const imagePath = path.resolve(PHOTOS_DIR, filename);

  const bgBuffer = await sharp(imagePath)
    .resize(1920, 1080, { fit: 'cover', position: 'center' })
    .toBuffer();

  const logoBuf = await getLogoBuffer(84);

  // SVG text and gradient overlay
  const overlaySvg = `
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Bottom gradient for text legibility without obscuring photo -->
      <linearGradient id="bottomVignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0" />
        <stop offset="45%" stop-color="#000000" stop-opacity="0.45" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.92" />
      </linearGradient>

      <!-- Top subtle vignette for logo -->
      <linearGradient id="topVignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </linearGradient>

      <!-- Text drop shadow filter -->
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000000" flood-opacity="0.95" />
      </filter>
      <filter id="titleShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#000000" flood-opacity="0.98" />
      </filter>
    </defs>

    <!-- Top vignette -->
    <rect x="0" y="0" width="1920" height="140" fill="url(#topVignette)" />

    <!-- Bottom vignette -->
    <rect x="0" y="480" width="1920" height="600" fill="url(#bottomVignette)" />

    <!-- Eyebrow Category -->
    <text x="960" y="915" text-anchor="middle"
          fill="#f1f5f9" font-size="18" font-family="'Segoe UI', -apple-system, Roboto, sans-serif"
          font-weight="700" letter-spacing="5" filter="url(#dropShadow)">
      SEVEN B • ${escapeXml(category.toUpperCase())}
    </text>

    <!-- Title -->
    <text x="960" y="975" text-anchor="middle"
          fill="#ffffff" font-size="46" font-family="'Segoe UI', -apple-system, Roboto, sans-serif"
          font-weight="900" letter-spacing="-0.5" filter="url(#titleShadow)">
      ${escapeXml(title)}
    </text>

    <!-- Description -->
    <text x="960" y="1025" text-anchor="middle"
          fill="#f8fafc" font-size="22" font-family="'Segoe UI', -apple-system, Roboto, sans-serif"
          font-weight="300" letter-spacing="0.5" filter="url(#dropShadow)">
      ${escapeXml(description)}
    </text>
  </svg>
  `;

  const compositeImages = [
    { input: Buffer.from(overlaySvg), top: 0, left: 0 },
    { input: logoBuf, top: 35, left: 1795 }
  ];

  // Export JPEG
  await sharp(bgBuffer)
    .composite(compositeImages)
    .jpeg({ quality: 94 })
    .toFile(path.join(OUTPUT_DIR, `${outputName}.jpg`));

  // Export WebP
  await sharp(bgBuffer)
    .composite(compositeImages)
    .webp({ quality: 90 })
    .toFile(path.join(OUTPUT_DIR, `${outputName}.webp`));

  console.log(`✔ Generated: ${outputName}.jpg & .webp`);
}

// 2. Export Mosaic / Fractionné Slide
async function exportMosaicSlide({ index, outputName }) {
  console.log(`Rendering [${index}] ${outputName} (Mosaïque 5 Volets)...`);

  const panelFiles = [
    { file: '01_facade_devanture_seven_b.webp', title: 'DEVANTURE', tag: 'ACCUEIL' },
    { file: '02_reception_accueil_prestige.webp', title: 'RÉCEPTION', tag: 'SERVICE 24H' },
    { file: 'salon_image005_hd.webp', title: 'SALONS', tag: 'SÉJOUR' },
    { file: 'espace_diner_image011.webp', title: 'ESPACE DÎNER', tag: 'REPAS' },
    { file: 'chambre_lit_prestige.webp', title: 'CHAMBRES', tag: 'NUITS' }
  ];

  const panelWidth = 380;
  const panelHeight = 1080;
  const gap = 5;

  const panelComposites = [];

  for (let i = 0; i < panelFiles.length; i++) {
    const p = panelFiles[i];
    const left = i * (panelWidth + gap);
    const pPath = path.resolve(PHOTOS_DIR, p.file);

    const resizedPanel = await sharp(pPath)
      .resize(panelWidth, panelHeight, { fit: 'cover', position: 'center' })
      .png()
      .toBuffer();

    panelComposites.push({
      input: resizedPanel,
      top: 0,
      left: left
    });
  }

  const logoBuf = await getLogoBuffer(84);

  // Center cinematic overlay with panel labels
  const overlaySvg = `
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Dark overlay for panels to make center text pop -->
      <radialGradient id="centerGlow" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.82" />
        <stop offset="50%" stop-color="#000000" stop-opacity="0.65" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.45" />
      </radialGradient>

      <!-- Panel bottom vignette -->
      <linearGradient id="panelBottomGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.9" />
      </linearGradient>

      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000000" flood-opacity="0.95" />
      </filter>
      <filter id="titleShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000000" flood-opacity="0.98" />
      </filter>
    </defs>

    <!-- Background dark veil across all panels -->
    <rect x="0" y="0" width="1920" height="1080" fill="url(#centerGlow)" />

    <!-- Bottom vignette for panel tags -->
    <rect x="0" y="850" width="1920" height="230" fill="url(#panelBottomGrad)" />

    <!-- Panel 1 label -->
    <text x="190" y="1010" text-anchor="middle" fill="#cbd5e1" font-size="13" font-family="'Segoe UI', sans-serif" font-weight="600" letter-spacing="3" filter="url(#dropShadow)">ACCUEIL</text>
    <text x="190" y="1038" text-anchor="middle" fill="#ffffff" font-size="18" font-family="'Segoe UI', sans-serif" font-weight="800" filter="url(#dropShadow)">DEVANTURE</text>

    <!-- Panel 2 label -->
    <text x="575" y="1010" text-anchor="middle" fill="#cbd5e1" font-size="13" font-family="'Segoe UI', sans-serif" font-weight="600" letter-spacing="3" filter="url(#dropShadow)">SERVICE 24H</text>
    <text x="575" y="1038" text-anchor="middle" fill="#ffffff" font-size="18" font-family="'Segoe UI', sans-serif" font-weight="800" filter="url(#dropShadow)">RÉCEPTION</text>

    <!-- Panel 3 label -->
    <text x="960" y="1010" text-anchor="middle" fill="#cbd5e1" font-size="13" font-family="'Segoe UI', sans-serif" font-weight="600" letter-spacing="3" filter="url(#dropShadow)">SÉJOUR</text>
    <text x="960" y="1038" text-anchor="middle" fill="#ffffff" font-size="18" font-family="'Segoe UI', sans-serif" font-weight="800" filter="url(#dropShadow)">SALONS</text>

    <!-- Panel 4 label -->
    <text x="1345" y="1010" text-anchor="middle" fill="#cbd5e1" font-size="13" font-family="'Segoe UI', sans-serif" font-weight="600" letter-spacing="3" filter="url(#dropShadow)">REPAS</text>
    <text x="1345" y="1038" text-anchor="middle" fill="#ffffff" font-size="18" font-family="'Segoe UI', sans-serif" font-weight="800" filter="url(#dropShadow)">ESPACE DÎNER</text>

    <!-- Panel 5 label -->
    <text x="1730" y="1010" text-anchor="middle" fill="#cbd5e1" font-size="13" font-family="'Segoe UI', sans-serif" font-weight="600" letter-spacing="3" filter="url(#dropShadow)">NUITS</text>
    <text x="1730" y="1038" text-anchor="middle" fill="#ffffff" font-size="18" font-family="'Segoe UI', sans-serif" font-weight="800" filter="url(#dropShadow)">CHAMBRES</text>

    <!-- CENTER LUXURY HERO OVERLAY -->
    <!-- Eyebrow -->
    <text x="960" y="470" text-anchor="middle"
          fill="#e2e8f0" font-size="18" font-family="'Segoe UI', sans-serif"
          font-weight="700" letter-spacing="6" filter="url(#dropShadow)">
      L&apos;EXPÉRIENCE SEVEN B GUEST HOUSE
    </text>

    <!-- Main Title -->
    <text x="960" y="545" text-anchor="middle"
          fill="#ffffff" font-size="56" font-family="'Segoe UI', sans-serif"
          font-weight="900" letter-spacing="-0.5" filter="url(#titleShadow)">
      Bienvenue à Seven B Guest House
    </text>

    <!-- Description -->
    <text x="960" y="605" text-anchor="middle"
          fill="#f8fafc" font-size="24" font-family="'Segoe UI', sans-serif"
          font-weight="300" letter-spacing="0.5" filter="url(#dropShadow)">
      L&apos;excellence de l&apos;hospitalité et du confort au cœur de Cotonou
    </text>
  </svg>
  `;

  const allComposites = [
    ...panelComposites,
    { input: Buffer.from(overlaySvg), top: 0, left: 0 },
    { input: logoBuf, top: 35, left: 1795 }
  ];

  // Save JPEG
  await sharp({
    create: {
      width: 1920,
      height: 1080,
      channels: 4,
      background: { r: 5, g: 7, b: 12, alpha: 1 }
    }
  })
    .composite(allComposites)
    .jpeg({ quality: 94 })
    .toFile(path.join(OUTPUT_DIR, `${outputName}.jpg`));

  // Save WebP
  await sharp({
    create: {
      width: 1920,
      height: 1080,
      channels: 4,
      background: { r: 5, g: 7, b: 12, alpha: 1 }
    }
  })
    .composite(allComposites)
    .webp({ quality: 90 })
    .toFile(path.join(OUTPUT_DIR, `${outputName}.webp`));

  console.log(`✔ Generated: ${outputName}.jpg & .webp`);
}

// 3. Export Location Map Slide with Animated-Style Pin Marker
async function exportMapSlide({ index, outputName }) {
  console.log(`Rendering [${index}] ${outputName} (Carte Localisation)...`);

  const mapPath = path.resolve(PHOTOS_DIR, 'carte_bg.svg');
  const bgBuffer = await sharp(mapPath)
    .resize(1920, 1080, { fit: 'cover', position: 'center' })
    .png()
    .toBuffer();

  const logoBuf = await getLogoBuffer(84);

  // Pin coordinate percentages from carte.svg (1917 x 735) -> (916.5, 668.2)
  const pinX = 916.5;
  const pinY = 668.2;

  const overlaySvg = `
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Top vignette for text -->
      <linearGradient id="mapTopGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#080c14" stop-opacity="0.88" />
        <stop offset="60%" stop-color="#080c14" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#080c14" stop-opacity="0" />
      </linearGradient>

      <!-- Bottom subtle vignette -->
      <linearGradient id="mapBottomGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#080c14" stop-opacity="0" />
        <stop offset="100%" stop-color="#080c14" stop-opacity="0.85" />
      </linearGradient>

      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000000" flood-opacity="0.95" />
      </filter>
      <filter id="titleShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000000" flood-opacity="0.98" />
      </filter>
      <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#ff1e42" flood-opacity="0.6" />
      </filter>
    </defs>

    <!-- Top and bottom vignettes -->
    <rect x="0" y="0" width="1920" height="340" fill="url(#mapTopGrad)" />
    <rect x="0" y="860" width="1920" height="220" fill="url(#mapBottomGrad)" />

    <!-- TOP TEXT -->
    <!-- Eyebrow -->
    <text x="960" y="100" text-anchor="middle"
          fill="#f1f5f9" font-size="18" font-family="'Segoe UI', sans-serif"
          font-weight="700" letter-spacing="5" filter="url(#dropShadow)">
      SEVEN B GUEST HOUSE • LOCALISATION
    </text>

    <!-- Title -->
    <text x="960" y="160" text-anchor="middle"
          fill="#ffffff" font-size="52" font-family="'Segoe UI', sans-serif"
          font-weight="900" letter-spacing="-0.5" filter="url(#titleShadow)">
      Où sommes-nous ?
    </text>

    <!-- Address Description -->
    <text x="960" y="210" text-anchor="middle"
          fill="#f8fafc" font-size="22" font-family="'Segoe UI', sans-serif"
          font-weight="300" letter-spacing="0.5" filter="url(#dropShadow)">
      Maison Claude LISSANON, Rue 12578, Akogbato — Cotonou, Bénin
    </text>

    <!-- RADAR PULSING RINGS AT PIN LOCATION -->
    <circle cx="${pinX}" cy="${pinY}" r="45" fill="none" stroke="#ff2e47" stroke-width="2" stroke-opacity="0.4" />
    <circle cx="${pinX}" cy="${pinY}" r="75" fill="none" stroke="#ff2e47" stroke-width="1.5" stroke-opacity="0.25" />
    <circle cx="${pinX}" cy="${pinY}" r="110" fill="none" stroke="#ff2e47" stroke-width="1" stroke-opacity="0.15" />

    <!-- PIN SHADOW -->
    <ellipse cx="${pinX}" cy="${pinY + 4}" rx="14" ry="6" fill="#000000" fill-opacity="0.6" filter="url(#dropShadow)" />

    <!-- PIN MARKER ICON (Tip points directly to pinX, pinY) -->
    <g transform="translate(${pinX - 25}, ${pinY - 68})" filter="url(#pinGlow)">
      <path d="M25 0 C11.19 0 0 11.19 0 25 C0 43.75 25 68 25 68 C25 68 50 43.75 50 25 C50 11.19 38.81 0 25 0 Z" fill="#FF1E42" stroke="#FFFFFF" stroke-width="2" />
      <circle cx="25" cy="25" r="9" fill="#FFFFFF" />
      <circle cx="25" cy="25" r="5" fill="#FF1E42" />
    </g>

    <!-- Tooltip badge next to pin -->
    <g transform="translate(${pinX + 35}, ${pinY - 55})" filter="url(#dropShadow)">
      <rect x="0" y="0" width="220" height="42" rx="8" fill="#0b0f17" fill-opacity="0.92" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1" />
      <text x="110" y="26" text-anchor="middle" fill="#ffffff" font-size="14" font-family="'Segoe UI', sans-serif" font-weight="700" letter-spacing="1">SEVEN B GUEST HOUSE</text>
    </g>
  </svg>
  `;

  const finalComposite = [
    { input: Buffer.from(overlaySvg), top: 0, left: 0 },
    { input: logoBuf, top: 35, left: 1795 }
  ];

  // Save JPEG
  await sharp(bgBuffer)
    .composite(finalComposite)
    .jpeg({ quality: 94 })
    .toFile(path.join(OUTPUT_DIR, `${outputName}.jpg`));

  // Save WebP
  await sharp(bgBuffer)
    .composite(finalComposite)
    .webp({ quality: 90 })
    .toFile(path.join(OUTPUT_DIR, `${outputName}.webp`));

  console.log(`✔ Generated: ${outputName}.jpg & .webp`);
}

// 4. Generate HTML viewer inside the folder
function generateFolderHtmlViewer(slidesList) {
  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seven B — Images TV Exportées avec Textes</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #07090e; color: #fff; padding: 30px 20px; }
    .container { max-width: 1400px; margin: 0 auto; }
    header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #1e293b; padding-bottom: 20px; }
    h1 { font-size: 2.2rem; font-weight: 900; margin-bottom: 8px; color: #fff; }
    p.subtitle { color: #94a3b8; font-size: 1.05rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 24px; margin-top: 25px; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; transition: transform 0.2s; }
    .card:hover { transform: translateY(-4px); border-color: #38bdf8; }
    .card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; cursor: pointer; }
    .card-body { padding: 16px 18px; }
    .card-num { color: #38bdf8; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
    .card-title { font-size: 1.15rem; font-weight: 800; margin: 4px 0 6px; color: #fff; }
    .card-desc { font-size: 0.9rem; color: #94a3b8; line-height: 1.4; }
    .badge { display: inline-block; background: #1e293b; color: #38bdf8; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-family: monospace; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Seven B Guest House — Images TV avec Textes Incrustés</h1>
      <p class="subtitle">Collection officielle Full HD (1920×1080) avec typographie, logos et textes descriptifs directement incrustés sur chaque visuel.</p>
    </header>
    <div class="grid">
      ${slidesList.map((s, idx) => `
        <div class="card">
          <a href="${s.file}.jpg" target="_blank">
            <img src="${s.file}.jpg" alt="${s.title}" />
          </a>
          <div class="card-body">
            <div class="card-num">Étape ${idx + 1} • ${s.category}</div>
            <div class="card-title">${s.title}</div>
            <div class="card-desc">${s.desc}</div>
            <span class="badge">${s.file}.jpg / .webp</span>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'apercu_des_images.html'), htmlContent, 'utf-8');
  console.log('✔ Generated apercu_des_images.html');
}

async function main() {
  console.log('--- STARTING TV IMAGES EXPORT ---');
  console.log(`Destination Folder: ${OUTPUT_DIR}\n`);

  const slidesToExport = [
    // 1. Mosaïque
    {
      type: 'mosaic',
      index: 1,
      outputName: '01_mosaique_entree',
      title: 'Bienvenue à Seven B Guest House (Mosaïque 5 Volets)',
      category: 'Bienvenue',
      desc: "L'excellence de l'hospitalité et du confort au cœur de Cotonou"
    },
    // 2. Devanture
    {
      type: 'standard',
      index: 2,
      filename: '01_facade_devanture_seven_b.webp',
      category: 'Accueil',
      title: 'Bienvenue à Seven B Guest House',
      description: "Un cadre d'exception et un accueil chaleureux disponible 24h/24, 7j/7",
      outputName: '02_devanture'
    },
    // 3. Salons
    {
      type: 'standard',
      index: 3,
      filename: 'salon_image005_hd.webp',
      category: 'Salons & Suites',
      title: 'Salons Contemporains & Espaces de Vie',
      description: "Design moderne, confort raffiné et connectivité pour vos moments de détente",
      outputName: '03_salons'
    },
    // 4. Espace Dîner
    {
      type: 'standard',
      index: 4,
      filename: 'espace_diner_image011.webp',
      category: 'Convivialité',
      title: 'Espaces Dîner & Convivialité',
      description: "Partagez des repas chaleureux dans l'intimité de votre appartement",
      outputName: '04_espace_diner'
    },
    // 5. Chambres
    {
      type: 'standard',
      index: 5,
      filename: 'chambre_lit_prestige.webp',
      category: 'Chambres',
      title: 'Suites & Chambres Prestige',
      description: "Literie grand confort et ambiance raffinée pour des nuits paisibles et sereines",
      outputName: '05_chambres'
    },
    // 6. Jacuzzi
    {
      type: 'standard',
      index: 6,
      filename: '08_espace_balneo_jacuzzi_privatif.webp',
      category: 'Bien-être',
      title: 'Salle de bain avec Jacuzzi',
      description: "Offrez-vous un instant de bien-être et de relaxation absolue",
      outputName: '06_jacuzzi'
    },
    // 7. Événements 1
    {
      type: 'standard',
      index: 7,
      filename: 'evenement_reception_01.webp',
      category: 'Événements',
      title: 'Vos Événements & Réceptions à Seven B',
      description: "Séminaires, cocktails d'entreprises, anniversaires et rencontres professionnelles",
      outputName: '07_evenements_1'
    },
    // 8. Événements 2
    {
      type: 'standard',
      index: 8,
      filename: 'evenement_reception_02.webp',
      category: 'Célébrations',
      title: 'Organisation Clé en Main & Service Traiteur',
      description: "Une équipe dédiée pour faire de chacune de vos célébrations une réussite inoubliable",
      outputName: '08_evenements_2'
    },
    // 9. Localisation
    {
      type: 'map',
      index: 9,
      outputName: '09_localisation',
      title: 'Où sommes-nous ?',
      category: 'Localisation',
      desc: 'Maison Claude LISSANON, Rue 12578, Akogbato — Cotonou, Bénin'
    }
  ];

  const exportedMeta = [];

  for (const item of slidesToExport) {
    if (item.type === 'mosaic') {
      await exportMosaicSlide({ index: item.index, outputName: item.outputName });
      exportedMeta.push({ file: item.outputName, title: item.title, category: item.category, desc: item.desc });
    } else if (item.type === 'map') {
      await exportMapSlide({ index: item.index, outputName: item.outputName });
      exportedMeta.push({ file: item.outputName, title: item.title, category: item.category, desc: item.desc });
    } else {
      await exportStandardSlide(item);
      exportedMeta.push({ file: item.outputName, title: item.title, category: item.category, desc: item.description });
    }
  }

  generateFolderHtmlViewer(exportedMeta);

  console.log('\n--- ALL 9 TV IMAGES WITH EMBEDDED TEXTS SUCCESSFULLY EXPORTED! ---');
  console.log(`Folder path: ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error('Error during export:', err);
  process.exit(1);
});

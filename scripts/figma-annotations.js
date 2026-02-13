#!/usr/bin/env node
/**
 * Figma Annotations Extractor
 * Fetches comments and design-layer annotations from Figma and FigJam files, writes DESIGN_ANNOTATIONS.md
 *
 * Usage:
 *   node scripts/figma-annotations.js <fileKey|url> [--include-file]
 *   node scripts/figma-annotations.js <fileKey1> <fileKey2> [--include-file]
 *
 * Env: FIGMA_ACCESS_TOKEN (required)
 *      FIGMA_FILE_KEY - Figma design file key or URL (supports figma.com/file, design, board)
 *      FIGJAM_FILE_KEY - FigJam board key(s), comma-separated for multiple
 * Loads .env from project root if present.
 *
 * FigJam: Typed sticky notes, shapes, and comments are parsed. Handwritten (stylus) content
 * is stored as vectors and cannot be parsed directly; see HANDWRITING_OCR.md for workflow.
 */

const path = require('path');
const fs = require('fs');
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const FIGMA_API = 'https://api.figma.com/v1';

function getEnv(key, fallback) {
  const val = process.env[key];
  if (val) return val;
  return fallback;
}

function extractFileKey(input) {
  if (!input) return null;
  const match = input.match(/figma\.com\/(?:file|design|board)\/([a-zA-Z0-9]+)/);
  return match ? match[1] : input;
}

async function fetchFigma(endpoint, token) {
  const res = await fetch(`${FIGMA_API}${endpoint}`, {
    headers: { 'X-Figma-Token': token },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API ${res.status}: ${text}`);
  }
  return res.json();
}

function collectTextFromNode(node, acc = [], parentName = '') {
  if (!node) return acc;
  const name = node.name || '';
  const combinedName = parentName ? `${parentName} / ${name}` : name;

  if (node.type === 'TEXT' && node.characters) {
    acc.push({ name, text: node.characters, path: combinedName });
  }
  if (node.children) {
    for (const child of node.children) {
      collectTextFromNode(child, acc, combinedName);
    }
  }
  return acc;
}

const ANNOTATION_FRAME_NAMES = [
  '_DevNotes',
  '_Annotations',
  'Annotations',
  'Dev Notes',
  '_SpacingMeasurements',
];

function isAnnotationFrame(name) {
  return ANNOTATION_FRAME_NAMES.some((n) =>
    (name || '').toLowerCase().includes(n.toLowerCase())
  );
}

function extractSpacingFromFile(document) {
  const spacing = [];

  function walk(node, pathParts = []) {
    if (!node) return;
    const name = node.name || '';
    if (isAnnotationFrame(name)) return;

    const path = pathParts.length ? pathParts.join(' / ') : name;
    const parts = [];

    if (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL') {
      if (typeof node.itemSpacing === 'number' && node.itemSpacing > 0) {
        parts.push(`gap: ${node.itemSpacing}px`);
      }
      if (typeof node.counterAxisSpacing === 'number' && node.counterAxisSpacing > 0) {
        parts.push(`counterAxisSpacing: ${node.counterAxisSpacing}px`);
      }
      const padL = node.paddingLeft ?? 0;
      const padR = node.paddingRight ?? 0;
      const padT = node.paddingTop ?? 0;
      const padB = node.paddingBottom ?? 0;
      if (padL || padR || padT || padB) {
        if (padL === padR && padT === padB && padL === padT) {
          parts.push(`padding: ${padL}px`);
        } else {
          const p = [];
          if (padT) p.push(`top ${padT}px`);
          if (padR) p.push(`right ${padR}px`);
          if (padB) p.push(`bottom ${padB}px`);
          if (padL) p.push(`left ${padL}px`);
          parts.push(`padding: ${p.join(', ')}`);
        }
      }
      if (parts.length) {
        spacing.push({ path: path || 'Frame', props: parts });
      }
    } else if (node.children?.length > 1 && node.type !== 'TEXT') {
      const children = node.children.filter((c) => c.absoluteBoundingBox);
      for (let i = 0; i < children.length - 1; i++) {
        const a = children[i].absoluteBoundingBox;
        const b = children[i + 1].absoluteBoundingBox;
        if (!a || !b) continue;
        const gapH = Math.round(b.x - (a.x + a.width));
        const gapV = Math.round(b.y - (a.y + a.height));
        const gap = gapH >= 0 && gapH < 500 ? gapH : gapV >= 0 && gapV < 500 ? gapV : null;
        if (gap !== null && gap > 0) {
          const label = `${children[i].name || 'item'} → ${children[i + 1].name || 'item'}`;
          spacing.push({
            path: path || 'Group',
            props: [`between ${label}: ${gap}px`],
          });
        }
      }
    }

    for (const child of node.children || []) {
      const nextPath = pathParts.length ? [...pathParts, name] : (name ? [name] : []);
      walk(child, name && child.name ? nextPath : pathParts);
    }
  }

  if (document?.children) {
    for (const child of document.children) {
      walk(child);
    }
  }
  return spacing;
}

function extractAnnotationsFromFile(document) {
  const annotations = [];
  const annotationPrefixes = ['NOTE:', 'INSTRUCTION:', 'TODO:', 'DEV:'];

  function walk(node, parentFrameName = '') {
    if (!node) return;
    const name = node.name || '';

    if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'GROUP') {
      const frameContext = isAnnotationFrame(name) ? name : parentFrameName;
      for (const child of node.children || []) {
        walk(child, frameContext || parentFrameName);
      }
      return;
    }

    if (node.type === 'TEXT' && node.characters) {
      const hasPrefix = annotationPrefixes.some((p) => name.startsWith(p));
      const inAnnotationFrame = isAnnotationFrame(parentFrameName);
      if (hasPrefix || inAnnotationFrame) {
        annotations.push({
          frame: parentFrameName || 'General',
          name,
          text: node.characters,
        });
      }
    }

    for (const child of node.children || []) {
      walk(child, parentFrameName);
    }
  }

  if (document?.children) {
    for (const child of document.children) {
      walk(child);
    }
  }
  return annotations;
}

/**
 * Extract typed text from FigJam-specific nodes: STICKY, SHAPE_WITH_TEXT, CODE_BLOCK, TEXT.
 * Handwritten content (vector strokes) is not parseable via API.
 */
function extractFigJamContent(document) {
  const items = [];

  function getTextFromNode(node) {
    if (node.type === 'TEXT' && node.characters) return node.characters;
    if (node.text?.characters) return node.text.characters;
    if (node.code) return node.code;
    return null;
  }

  function walk(node, pageName = '') {
    if (!node) return;
    const name = node.name || '';

    if (node.type === 'STICKY') {
      const text = getTextFromNode(node);
      if (text && text.trim()) {
        items.push({
          type: 'sticky',
          page: pageName,
          name: name || 'Sticky',
          author: node.authorName || '',
          text: text.trim(),
        });
      }
    } else if (node.type === 'SHAPE_WITH_TEXT') {
      const text = getTextFromNode(node);
      if (text && text.trim()) {
        items.push({
          type: 'shape',
          page: pageName,
          name: name || 'Shape',
          text: text.trim(),
        });
      }
    } else if (node.type === 'CODE_BLOCK') {
      const text = getTextFromNode(node);
      if (text && text.trim()) {
        items.push({
          type: 'code',
          page: pageName,
          name: name || 'Code block',
          text: text.trim(),
        });
      }
    } else if (node.type === 'TEXT' && node.characters) {
      items.push({
        type: 'text',
        page: pageName,
        name: name || 'Text',
        text: node.characters.trim(),
      });
    }

    const nextPage = node.type === 'CANVAS' ? name : pageName;
    for (const child of node.children || []) {
      walk(child, nextPage);
    }
  }

  if (document?.children) {
    for (const child of document.children) {
      walk(child);
    }
  }
  return items;
}

/**
 * Parse file keys from env vars. Supports comma-separated values.
 * FIGMA_FILE_KEY, FIGJAM_FILE_KEY, or both.
 */
function parseFileKeysFromEnv() {
  const keys = [];
  const figma = getEnv('FIGMA_FILE_KEY', '').trim();
  const figjam = getEnv('FIGJAM_FILE_KEY', '').trim();
  if (figma) keys.push(...figma.split(',').map((k) => k.trim()).filter(Boolean));
  if (figjam) keys.push(...figjam.split(',').map((k) => k.trim()).filter(Boolean));
  return [...new Set(keys)];
}

/**
 * Build DESIGN_ANNOTATIONS.md from merged data from multiple Figma/FigJam files.
 * @param {Array<{fileKey: string, fileName?: string, editorType: string, comments: any[], annotations?: any[], spacing?: any[], figjamContent?: any[]}>} sources
 */
function buildMarkdown(sources) {
  const sections = [];
  const fileKeys = sources.map((s) => s.fileKey).join(', ');
  sections.push(`# Design Annotations`);
  sections.push('');
  sections.push(`> Auto-generated from Figma/FigJam files. Use as context for development.`);
  sections.push(`> File key(s): \`${fileKeys}\``);
  sections.push('');

  let hasAnyContent = false;

  for (const src of sources) {
    const label = src.fileName ? `${src.fileName} (\`${src.fileKey}\`)` : src.fileKey;

    if (src.spacing?.length > 0) {
      hasAnyContent = true;
      sections.push('## Spacing Measurements (from Figma)');
      sections.push('');
      sections.push(`From ${label}. Extracted from layout properties (\`itemSpacing\`, \`padding*\`, \`counterAxisSpacing\`) and computed gaps between siblings.`);
      sections.push('');
      const byPath = {};
      for (const s of src.spacing) {
        const path = s.path || 'Frame';
        if (!byPath[path]) byPath[path] = [];
        byPath[path].push(...s.props);
      }
      for (const [path, props] of Object.entries(byPath)) {
        sections.push(`### ${path}`);
        for (const p of props) {
          sections.push(`- ${p}`);
        }
        sections.push('');
      }
    }
  }

  const allComments = sources.flatMap((s) => (s.comments || []).map((c) => ({ ...c, _sourceKey: s.fileKey, _sourceLabel: s.fileName || s.fileKey })));
  if (allComments.length > 0) {
    hasAnyContent = true;
    sections.push('## Figma Comments');
    sections.push('');
    const bySource = {};
    for (const c of allComments) {
      const key = c._sourceKey;
      if (!bySource[key]) bySource[key] = [];
      bySource[key].push(c);
    }
    for (const [key, list] of Object.entries(bySource)) {
      const src = sources.find((s) => s.fileKey === key);
      const title = src?.fileName ? `${src.fileName} (${key})` : `File ${key}`;
      sections.push(`### ${title}`);
      const byNode = {};
      for (const c of list) {
        const nodeId = c.client_meta?.node_id?.[0] || 'uncategorized';
        if (!byNode[nodeId]) byNode[nodeId] = [];
        byNode[nodeId].push(c);
      }
      for (const [nodeId, nodeList] of Object.entries(byNode)) {
        for (const c of nodeList) {
          const msg = c.message ?? c.message_content ?? '(no message)';
          const author = c.user?.handle ?? c.user?.email ?? 'unknown';
          const date = c.created_at ? new Date(c.created_at).toLocaleDateString() : '';
          sections.push(`- **${author}** (${date}): ${msg}`);
        }
      }
      sections.push('');
    }
  }

  for (const src of sources) {
    if (src.annotations?.length > 0) {
      hasAnyContent = true;
      const label = src.fileName ? `${src.fileName} (\`${src.fileKey}\`)` : src.fileKey;
      sections.push('## Design-Layer Annotations');
      sections.push('');
      sections.push(`From ${label}.`);
      sections.push('');
      const byFrame = {};
      for (const a of src.annotations) {
        const frame = a.frame || 'General';
        if (!byFrame[frame]) byFrame[frame] = [];
        byFrame[frame].push(a);
      }
      for (const [frame, list] of Object.entries(byFrame)) {
        sections.push(`### ${frame}`);
        for (const a of list) {
          sections.push(`- **${a.name}**: ${a.text}`);
        }
        sections.push('');
      }
    }
  }

  for (const src of sources) {
    if (src.figjamContent?.length > 0) {
      hasAnyContent = true;
      const label = src.fileName ? `${src.fileName} (\`${src.fileKey}\`)` : src.fileKey;
      sections.push('## FigJam Content');
      sections.push('');
      sections.push(`From ${label}. Typed sticky notes, shapes, and text. Handwritten content (stylus) is not parseable via API.`);
      sections.push('');
      const byPage = {};
      for (const item of src.figjamContent) {
        const page = item.page || 'General';
        if (!byPage[page]) byPage[page] = [];
        byPage[page].push(item);
      }
      for (const [page, list] of Object.entries(byPage)) {
        sections.push(`### ${page}`);
        for (const item of list) {
          const typeLabel = item.type === 'sticky' ? 'Sticky' : item.type === 'shape' ? 'Shape' : item.type === 'code' ? 'Code' : 'Text';
          const author = item.author ? ` (${item.author})` : '';
          sections.push(`- **[${typeLabel}]** ${item.name}${author}: ${item.text}`);
        }
        sections.push('');
      }
    }
  }

  if (!hasAnyContent) {
    sections.push('## No Annotations Found');
    sections.push('');
    sections.push('Add annotations using:');
    sections.push('- **Comments**: Use Figma\'s comment tool on the design or FigJam board');
    sections.push('- **Design layers** (Figma): Create a frame named `_DevNotes`, `_Annotations`, or `_SpacingMeasurements` with text layers');
    sections.push('- **FigJam**: Add typed sticky notes, shapes with text, or code blocks (handwritten stylus content is not parseable)');
    sections.push('- **Screenshots**: Export annotation screenshots to `Annotations/` and reference them in the table below');
    sections.push('');
  }

  sections.push('## Screenshot References');
  sections.push('');
  sections.push('Link measurement tool screenshots for visual reference:');
  sections.push('');
  sections.push('| Screen | File | Notes |');
  sections.push('| ------ | ---- | ----- |');
  sections.push('| Home - Desktop | [Spacing Measurements](Annotations/Home%20-%20Desktop%20-%20Spacing%20Measurements.jpg) | Spacing annotations |');
  sections.push('| Home - Tablet | _(add file)_ | _(add spacing notes)_ |');
  sections.push('| Home - Mobile | _(add file)_ | _(add spacing notes)_ |');
  sections.push('');

  return sections.join('\n');
}

/**
 * Fetch and process a single Figma or FigJam file.
 */
async function processFile(fileKeyOrUrl, token, includeFile) {
  const fileKey = extractFileKey(fileKeyOrUrl) || fileKeyOrUrl;
  const source = {
    fileKey,
    fileName: null,
    editorType: 'figma',
    comments: [],
    annotations: [],
    spacing: [],
    figjamContent: [],
  };

  try {
    const commentsRes = await fetchFigma(`/files/${fileKey}/comments?as_md=true`, token);
    source.comments = commentsRes.comments || [];
    console.log(`  [${fileKey}] Found ${source.comments.length} comment(s)`);
  } catch (e) {
    console.warn(`  [${fileKey}] Could not fetch comments:`, e.message);
  }

  if (includeFile) {
    try {
      const fileRes = await fetchFigma(`/files/${fileKey}`, token);
      source.fileName = fileRes.name || null;
      source.editorType = fileRes.editorType || 'figma';
      const doc = fileRes.document;

      if (source.editorType === 'figjam') {
        source.figjamContent = extractFigJamContent(doc);
        console.log(`  [${fileKey}] FigJam: found ${source.figjamContent.length} typed item(s)`);
      } else {
        source.annotations = extractAnnotationsFromFile(doc);
        source.spacing = extractSpacingFromFile(doc);
        console.log(`  [${fileKey}] Figma: found ${source.annotations.length} annotation(s), ${source.spacing.length} spacing(s)`);
      }
    } catch (e) {
      console.warn(`  [${fileKey}] Could not fetch file:`, e.message);
    }
  }

  return source;
}

async function main() {
  const args = process.argv.slice(2);
  const includeFile = args.includes('--include-file');
  const fileKeyArgs = args.filter((a) => !a.startsWith('--'));

  let fileKeys = [];
  if (fileKeyArgs.length > 0) {
    fileKeys = fileKeyArgs.map((a) => extractFileKey(a) || a);
  } else {
    fileKeys = parseFileKeysFromEnv();
  }

  const token = getEnv('FIGMA_ACCESS_TOKEN', '');

  if (!token) {
    console.error('Error: FIGMA_ACCESS_TOKEN is required. Set it in .env or export it.');
    process.exit(1);
  }
  if (fileKeys.length === 0) {
    console.error('Usage: node scripts/figma-annotations.js <fileKey|url> [fileKey2|url2 ...] [--include-file]');
    console.error('   Or:  FIGMA_FILE_KEY=xxx node scripts/figma-annotations.js');
    console.error('   Or:  FIGJAM_FILE_KEY=yyy node scripts/figma-annotations.js');
    console.error('   Or:  FIGMA_FILE_KEY=xxx FIGJAM_FILE_KEY=yyy,zzz node scripts/figma-annotations.js --include-file');
    process.exit(1);
  }

  console.log(`Fetching annotations from ${fileKeys.length} file(s)...`);

  const sources = [];
  for (const key of fileKeys) {
    const source = await processFile(key, token, includeFile);
    sources.push(source);
  }

  const markdown = buildMarkdown(sources);
  const outPath = path.join(process.cwd(), 'DESIGN_ANNOTATIONS.md');
  fs.writeFileSync(outPath, markdown, 'utf8');
  console.log(`Wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

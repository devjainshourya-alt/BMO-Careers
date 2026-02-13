/**
 * Export Cursor chat history from state.vscdb to Markdown files.
 * Run with Cursor closed so the database is not locked.
 *
 * Usage:
 *   node scripts/export-chat-history.js
 *   node scripts/export-chat-history.js --db "C:\path\to\workspaceStorage\41cb...\state.vscdb"
 *   npm run export:chats
 *
 * Output: docs/chat-exports/*.md
 */

const fs = require('fs');
const path = require('path');

const CHAT_KEYS = [
  'workbench.panel.aichat.view.aichat.chatdata',
  'aiService.prompts',
  'workbench.panel.aichat.chatdata',
];

const DEBUG = process.argv.includes('--debug');

const WORKSPACE_ID = '41cb3403b7837b6ea8c6cfc27ef27823';
const APPDATA = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');

function getDefaultDbPaths() {
  const base = path.join(APPDATA, 'Cursor', 'User', 'workspaceStorage');
  const candidates = [
    path.join(base, WORKSPACE_ID, 'state.vscdb'),
    path.join(base, WORKSPACE_ID, 'state.vscdb.backup'),
  ];
  // Also try Shourya Jain path if we're on another user (e.g. Administrator)
  const shouryaBase = path.join('C:', 'Users', 'Shourya Jain', 'AppData', 'Roaming', 'Cursor', 'User', 'workspaceStorage');
  candidates.push(path.join(shouryaBase, WORKSPACE_ID, 'state.vscdb'));
  candidates.push(path.join(shouryaBase, WORKSPACE_ID, 'state.vscdb.backup'));
  return candidates;
}

function findDbPath() {
  const idx = process.argv.indexOf('--db');
  if (idx !== -1 && process.argv[idx + 1]) {
    const p = process.argv[idx + 1];
    if (fs.existsSync(p)) return p;
    console.error('Not found: ' + p);
    process.exit(1);
  }
  for (const p of getDefaultDbPaths()) {
    if (fs.existsSync(p)) return p;
  }
  console.error('Could not find state.vscdb. Close Cursor and run again, or pass --db "path\\to\\state.vscdb"');
  process.exit(1);
}

function sanitizeFileName(name) {
  return (name || 'untitled')
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80) || 'untitled';
}

function describeValue(v) {
  if (v == null) return 'null';
  if (Array.isArray(v)) return `array[${v.length}]`;
  if (typeof v !== 'object') return typeof v;
  const keys = Object.keys(v).slice(0, 15);
  return 'object{' + keys.join(',') + (Object.keys(v).length > 15 ? '...' : '') + '}';
}

function deepSample(v, depth) {
  if (depth <= 0 || v == null) return v;
  if (Array.isArray(v)) return v.slice(0, 2).map((x) => deepSample(x, depth - 1));
  if (typeof v !== 'object') return v;
  const out = {};
  for (const k of Object.keys(v).slice(0, 8)) {
    out[k] = deepSample(v[k], depth - 1);
  }
  return out;
}

/** Group entries that look like single messages (have conversationId/chatId) into full conversations. */
function groupMessagesIntoConversations(entries) {
  const byConv = new Map();
  for (const { id, raw } of entries) {
    const cid = raw.conversationId || raw.chatId || raw.conversation_id || id;
    if (!byConv.has(cid)) byConv.set(cid, { id: cid, raw: { messages: [], title: raw.title || raw.preview } });
    const conv = byConv.get(cid);
    if (Array.isArray(conv.raw.messages)) conv.raw.messages.push(raw);
    else conv.raw.messages = [raw];
  }
  return Array.from(byConv.values());
}

function extractConversations(data, sourceKey) {
  const out = [];
  if (!data) return out;

  if (Array.isArray(data)) {
    return data.map((item, i) => ({ id: String(i), raw: item }));
  }

  if (typeof data !== 'object') return out;

  if (data.conversations && Array.isArray(data.conversations)) {
    data.conversations.forEach((c, i) => out.push({ id: c.id || String(i), raw: c }));
    return out;
  }

  if (data.chats && Array.isArray(data.chats)) {
    data.chats.forEach((c, i) => out.push({ id: c.id || c.conversationId || String(i), raw: c }));
    return out;
  }

  const entries = [];
  for (const [id, val] of Object.entries(data)) {
    if (val && typeof val === 'object') entries.push({ id, raw: val });
  }

  // If every entry has conversationId/chatId, treat as per-message and group by conversation
  const first = entries[0] && entries[0].raw;
  const looksLikeMessageList =
    entries.length > 0 &&
    first &&
    (first.conversationId != null || first.chatId != null || (first.text != null && first.commandType != null));

  if (looksLikeMessageList && entries.length > 1) {
    const grouped = groupMessagesIntoConversations(entries);
    return grouped;
  }

  entries.forEach((e) => out.push(e));
  return out;
}

/** Recursively find first array that looks like message list (objects with text/content). */
function findMessageArray(obj, depth) {
  if (depth <= 0 || !obj || typeof obj !== 'object') return null;
  if (Array.isArray(obj)) {
    const first = obj[0];
    if (obj.length > 0 && first && typeof first === 'object' && (first.text != null || first.content != null || first.message != null))
      return obj;
    return null;
  }
  const order = ['bubbles', 'messages', 'turns', 'items', 'promptHistory', 'data'];
  for (const k of order) {
    if (obj[k] && Array.isArray(obj[k])) {
      const found = findMessageArray(obj[k], 1);
      if (found) return found;
    }
  }
  for (const v of Object.values(obj)) {
    const found = findMessageArray(v, depth - 1);
    if (found) return found;
  }
  return null;
}

function messagesFromConversation(conv) {
  if (!conv || typeof conv !== 'object') return [];
  const list = conv.messages || conv.bubbles || conv.turns || conv.items || [];
  if (Array.isArray(list) && list.length > 0) return list;
  if (conv.promptHistory && Array.isArray(conv.promptHistory)) return conv.promptHistory;
  const nested = findMessageArray(conv, 4);
  if (nested) return nested;
  // Single message with .text (e.g. { text, commandType })
  const textVal = conv.text;
  if (textVal != null) {
    const text = typeof textVal === 'string' ? textVal : String(textVal);
    if (text.trim()) return [{ role: conv.role || 'user', text }];
  }
  return [];
}

function messageToMarkdown(msg) {
  if (!msg) return '';
  let text = msg.text ?? msg.content ?? msg.message ?? (typeof msg === 'string' ? msg : '');
  if (text && typeof text === 'object') {
    if (Array.isArray(text)) text = text.map((p) => (typeof p === 'string' ? p : p?.text ?? '')).join('');
    else text = text.parts?.map((p) => p?.text ?? p).join('') ?? text.text ?? JSON.stringify(text);
  }
  text = String(text || '').trim();
  if (!text) return '';
  const role = (msg.role || msg.type || msg.speaker || msg.kind || 'user').toLowerCase();
  const name = role === 'user' ? '**You**' : role === 'assistant' || role === 'model' ? '**Assistant**' : `**${role}**`;
  return `### ${name}\n\n${text}\n\n`;
}

function conversationToMarkdown(conv, index) {
  const raw = conv.raw || conv;
  const title = raw.title || raw.name || raw.preview || conv.title || conv.name || `Chat ${index + 1}`;
  const messages = messagesFromConversation(raw);
  let body = messages.map(messageToMarkdown).join('---\n\n');
  if (!body.trim() && raw.text != null) {
    const t = typeof raw.text === 'string' ? raw.text : String(raw.text);
    if (t.trim()) body = '### **You**\n\n' + t.trim() + '\n\n';
  }
  if (!body.trim()) {
    body = '(No messages extracted. Raw keys: ' + Object.keys(raw).join(', ') + ')\n';
  }
  return { title: String(title).slice(0, 200), body };
}

function run() {
  const dbPath = findDbPath();
  console.log('Using database:', dbPath);

  const initSqlJs = require('sql.js');
  const wasmPath = path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');

  initSqlJs({ locateFile: () => wasmPath }).then((SQL) => {
    const fileBuffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(fileBuffer);

    // Also discover any key that might hold chat data
    const allKeysStmt = db.prepare(
      `SELECT key FROM ItemTable WHERE key LIKE '%chat%' OR key LIKE '%aichat%' OR key LIKE '%prompt%'`
    );
    const discoveredKeys = new Set(CHAT_KEYS);
    while (allKeysStmt.step()) {
      discoveredKeys.add(allKeysStmt.getAsObject().key);
    }
    allKeysStmt.free();
    const chatKeys = Array.from(discoveredKeys);

    const placeholders = chatKeys.map(() => '?').join(',');
    const stmt = db.prepare(
      `SELECT key, value FROM ItemTable WHERE key IN (${placeholders})`
    );
    stmt.bind(chatKeys);

    let allConversations = [];
    let debugSamples = null;
    if (DEBUG) debugSamples = { keys: chatKeys, samples: [] };

    while (stmt.step()) {
      const row = stmt.getAsObject();
      const key = row.key;
      let value = row.value;
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch (_) {
          continue;
        }
      }
      if (DEBUG && debugSamples.samples.length < 5) {
        debugSamples.samples.push({ key, valueShape: describeValue(value), sample: deepSample(value, 4) });
      }
      if (DEBUG && key === 'workbench.panel.aichat.view.aichat.chatdata' && value && typeof value === 'object') {
        const firstEntry = Object.entries(value)[0];
        debugSamples.chatdataFirstEntry = firstEntry ? { key: firstEntry[0], value: deepSample(firstEntry[1], 5) } : null;
      }
      const list = extractConversations(value, key);
      list.forEach((c) => {
        const parsed = conversationToMarkdown(c, allConversations.length);
        allConversations.push({ ...parsed, id: c.id });
      });
    }
    stmt.free();
    db.close();

    if (DEBUG && debugSamples) {
      const debugPath = path.join(__dirname, '..', 'docs', 'chat-exports-debug.json');
      fs.writeFileSync(debugPath, JSON.stringify(debugSamples, null, 2), 'utf8');
      console.log('Debug dump written to', debugPath);
    }

    const outDir = path.join(__dirname, '..', 'docs', 'chat-exports');
    if (!fs.existsSync(path.join(__dirname, '..', 'docs'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'docs'), { recursive: true });
    }
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Dedupe by id (same chat can appear under multiple keys)
    const seen = new Set();
    const unique = allConversations.filter((c) => {
      const k = c.id + '|' + (c.body || '').slice(0, 100);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    let exported = 0;
    const usedNames = new Set();
    unique.forEach((conv, i) => {
      const base = sanitizeFileName(conv.title);
      let name = base;
      let n = 0;
      while (usedNames.has(name)) {
        n++;
        name = `${base}-${n}`;
      }
      usedNames.add(name);
      const filename = `${String(i + 1).padStart(3, '0')}-${name}.md`;
      const filepath = path.join(outDir, filename);
      const content = `# ${conv.title}\n\n---\n\n${conv.body}`;
      fs.writeFileSync(filepath, content, 'utf8');
      exported++;
    });

    console.log('Exported', exported, 'chats to', outDir);
  }).catch((err) => {
    console.error('Error:', err.message);
    if (err.message && err.message.includes('locked')) {
      console.error('Close Cursor completely (File → Exit) and run this script again.');
    }
    process.exit(1);
  });
}

run();

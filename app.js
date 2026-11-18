/* =========================================================
   Teuto-Tour – App
   Vanilla JS, keine Abhängigkeiten außer Leaflet (lokal).
   ========================================================= */
(() => {
'use strict';

const C = window.CONFIG;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* ---------- Icons (Linien-Icons im Stil von SF Symbols) ---------- */
const ICONS = {
  house: '<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v10.5a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  lockOpen: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 7.6-1.7"/>',
  book: '<path d="M12 6.5C10 5 7 4.6 3.5 5v13.5c3.5-.4 6.5 0 8.5 1.5 2-1.5 5-1.9 8.5-1.5V5C17 4.6 14 5 12 6.5Z"/><path d="M12 6.5V20"/>',
  rings: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5M12 7.5a4.5 4.5 0 0 1 4.5 4.5"/>',
  location: '<path d="M20.5 3.5 3.5 10.6l7.4 2.5 2.5 7.4Z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8L16.2 9.5"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
  chevron: '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
  xmark: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  send: '<path d="M20.5 3.5 10.5 13.5"/><path d="M20.5 3.5 14.2 20.5l-3.7-7-7-3.7Z"/>',
  tray: '<path d="M3.5 13.5 6 5h12l2.5 8.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19Z"/><path d="M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5"/>',
  share: '<path d="M12 3v12"/><path d="m7.5 7.5 4.5-4.5 4.5 4.5"/><path d="M7.5 10.5H6A1.5 1.5 0 0 0 4.5 12v7.5A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5V12a1.5 1.5 0 0 0-1.5-1.5h-1.5"/>',
  flag: '<path d="M5.5 21V3.5"/><path d="M5.5 4h11l-2.2 4 2.2 4h-11"/>',
  walk: '<circle cx="13.5" cy="4.5" r="1.8"/><path d="M9 21l2.6-6.6 2.9 2.6V21"/><path d="M7.5 12.5 9.8 8.6l3.7-1.1 2.1 4 3 1.5"/><path d="m11.6 14.4 1.2-6.6"/>',
  mountain: '<path d="M2.5 19.5 9 8.5l4 6.5 2.5-3.5 6 8Z"/>',
  sparkles: '<path d="M11 3.5 12.7 9l5.3 1.7-5.3 1.7L11 17.5l-1.7-5.1L4 10.7 9.3 9Z"/><path d="M18.5 15v5M16 17.5h5"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0Z"/><path d="M8 6H5a3 3 0 0 0 3 4.2M16 6h3a3 3 0 0 1-3 4.2"/><path d="M12 13v4M8.5 20.5h7M10 17h4"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  wifiSlash: '<path d="M3.5 3.5l17 17"/><path d="M8.8 15.8a4.6 4.6 0 0 1 6.1-.3M5.4 12.4a9.4 9.4 0 0 1 3.7-2.2M12.6 9.6a9.4 9.4 0 0 1 6 2.8M2 9a14 14 0 0 1 3.6-2.5M10.2 5.1A14 14 0 0 1 22 9"/><circle cx="12" cy="19.3" r=".7" fill="currentColor"/>',
  pencil: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z"/><path d="m13.5 6.5 4 4"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2.5"/>',
  play: '<path d="M8 5.5v13l10.5-6.5Z"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.6 14.2a4.5 4.5 0 0 1 5 5.3"/>',
  map: '<path d="M9 4.5 3.5 6.5v13l5.5-2 6 2 5.5-2v-13l-5.5 2Z"/><path d="M9 4.5v13M15 6.5v13"/>',
  clipboard: '<rect x="5.5" y="4.5" width="13" height="16.5" rx="2.5"/><path d="M9 4.5V3.5h6v1"/><path d="M9 11h6M9 15h4"/>',
  bolt: '<path d="M13 3 5.5 13.5H12L11 21l7.5-10.5H12Z"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20Z"/>',
  footprints: '<path d="M7.5 3.5c1.8 0 2.8 2 2.8 4.5S9 12.5 7.5 12.5 4.7 10.5 4.7 8s1-4.5 2.8-4.5Z"/><path d="M5.5 15h4v1.5a2 2 0 0 1-4 0Z"/><path d="M16.5 7.5c1.8 0 2.8 2 2.8 4.5s-1.3 4.5-2.8 4.5-2.8-2-2.8-4.5 1-4.5 2.8-4.5Z"/><path d="M14.5 19h4v.5a2 2 0 0 1-4 0Z"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  arrowCircle: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4v4h-4"/>',
};
const I = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------- Storage ---------- */
const ls = {
  get(k, d = null) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { console.warn(e); return false; } },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};

/* ---------- Zeit (mit Testmodus) ---------- */
const qs = new URLSearchParams(location.search);
const TEST = !!C.TEST_MODE && (qs.has('test') || ls.get('tt:test', false));
if (TEST) ls.set('tt:test', true);
let offset = TEST ? Number(ls.get('tt:offset', 0)) || 0 : 0;
const now = () => Date.now() + offset;
const HIKE_DAY_START = new Date(C.HIKE_DAY + 'T00:00:00').getTime();
const COUNTDOWN_TS = new Date(C.COUNTDOWN_TO).getTime();

/* ---------- Wer bin ich? ---------- */
const codeParam = qs.get('p');
const ME = C.PEOPLE.find((p) => p.code === (codeParam || ls.get('tt:me')));
if (ME) ls.set('tt:me', ME.code);
const OTHERS = ME ? C.PEOPLE.filter((p) => p.id !== ME.id) : [];
const byId = (id) => C.PEOPLE.find((p) => p.id === id);
const gen = (name) => (/[sxzß]$/i.test(name) ? name + '’' : name + 's');

/* ---------- Zustand ---------- */
const KEY = ME ? 'tt:state:' + ME.id : null;
const blank = () => ({
  v: 1,
  tips: { km: null, pee: null },
  sent: {},            // empfängerId -> { text, points, poolIdx, at }
  received: {},        // verfasserId -> { text, points, at, done, random }
  hike: { start: null, end: null },
  revealed: false,
  checkins: [],        // { t, mood, energy, note, lat, lng, acc }
  counters: {},
  steps: null,
  kmOverride: null,
  resolution: null,
  setup: { loc: false },
});
const stored = KEY ? ls.get(KEY, {}) : {};
const S = Object.assign(blank(), stored);
S.tips = Object.assign(blank().tips, S.tips);
S.hike = Object.assign(blank().hike, S.hike);
S.setup = Object.assign(blank().setup, S.setup);
function save() { if (KEY && !ls.set(KEY, S)) toast('Speichern fehlgeschlagen', 'xmark'); }

/* ---------- Abgeleitete Werte ---------- */
const phase = () => (!S.hike.start ? 'before' : !S.hike.end ? 'during' : 'after');
const canStart = () => now() >= HIKE_DAY_START;
const lastCheckinTs = () => (S.checkins.length ? S.checkins[S.checkins.length - 1].t : S.hike.start);
const checkinDue = () => phase() === 'during' && (!S.checkins.length || now() - lastCheckinTs() >= (C.CHECKIN_INTERVAL_MIN - 5) * 60000);
const receivedCount = () => OTHERS.filter((o) => S.received[o.id]).length;
const sentCount = () => OTHERS.filter((o) => S.sent[o.id]).length;
const missionPoints = () => OTHERS.reduce((a, o) => a + (S.received[o.id]?.done ? S.received[o.id].points : 0), 0);
const missionsDone = () => OTHERS.filter((o) => S.received[o.id]?.done).length;
const geoPts = () => S.checkins.filter((c) => c.lat != null && c.lng != null);
function haversine(a, b) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function kmComputed() {
  const p = geoPts(); if (p.length < 2) return null;
  let d = 0; for (let i = 1; i < p.length; i++) d += haversine(p[i - 1], p[i]);
  return d * C.ROUTE_FACTOR;
}
const kmFinal = () => (S.kmOverride != null ? S.kmOverride : kmComputed());
const durationMs = () => (S.hike.start ? (S.hike.end || now()) - S.hike.start : 0);

/* ---------- Formatierung ---------- */
const fmtTime = (t) => new Date(t).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
const fmtKm = (k) => (k == null ? '–' : k.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
const fmtInt = (n) => (n == null ? '–' : Math.round(n).toLocaleString('de-DE'));
function fmtDur(ms, long = false) {
  const m = Math.max(0, Math.floor(ms / 60000)), h = Math.floor(m / 60), mm = m % 60;
  if (long) return h ? `${h} Std ${mm} Min` : `${mm} Min`;
  return `${h}:${String(mm).padStart(2, '0')}`;
}
const dayLabel = new Date(C.HIKE_DAY + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
const dayShort = new Date(C.HIKE_DAY + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const othersNames = () => { const n = OTHERS.map((o) => o.name); return n.slice(0, -1).join(', ') + ' & ' + n[n.length - 1]; };
const parseNum = (v) => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };

/* ---------- Haptik & Toast ---------- */
function haptic(pattern = 10) {
  try { if (navigator.vibrate && navigator.vibrate(pattern)) return; } catch {}
  // iOS 18+: Umschalten eines <input switch> erzeugt ein haptisches Feedback
  const l = $('#haptic-label'); if (l) l.click();
}
let toastTimer;
function toast(msg, icon = 'checkCircle') {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.append(t); }
  t.innerHTML = `${I(icon)}<span>${esc(msg)}</span>`;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Missions-Codes (leicht verschleiert, kein Hochsicherheits-Krypto) ---------- */
const enc = new TextEncoder(), dec = new TextDecoder('utf-8', { fatal: true });
const keyFor = (p) => enc.encode(C.MISSION_SALT + ':' + p.code + ':' + p.id);
const xor = (bytes, key) => bytes.map((b, i) => b ^ key[i % key.length] ^ ((i * 47 + 13) & 255));
function b64u(bytes) { let s = ''; bytes.forEach((b) => (s += String.fromCharCode(b))); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function unb64u(str) { str = str.replace(/-/g, '+').replace(/_/g, '/'); while (str.length % 4) str += '='; const s = atob(str); return Uint8Array.from(s, (c) => c.charCodeAt(0)); }
function encodeMission(to, m) {
  const payload = JSON.stringify({ n: Math.random().toString(36).slice(2, 8), v: 1, f: ME.id, t: to.id, x: m.text, p: m.points });
  return 'TT1-' + b64u(xor(enc.encode(payload), keyFor(to)));
}
function decodeMission(text) {
  const m = String(text || '').match(/TT1-([A-Za-z0-9_-]{16,})/);
  if (!m) return { err: 'nocode' };
  try {
    const obj = JSON.parse(dec.decode(xor(unb64u(m[1]), keyFor(ME))));
    if (obj.t !== ME.id || !byId(obj.f)) return { err: 'notforme' };
    return { ok: obj };
  } catch { return { err: 'notforme' }; }
}

/* ---------- Höhenlinien (Marching Squares über ein Fantasie-Höhenfeld) ---------- */
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function contourSVG({ w = 600, h = 1000, cell = 9, levels = 18, seed = 11, color = 'currentColor', strong = 'currentColor', sw = 1 } = {}) {
  const rnd = mulberry32(seed);
  const hills = Array.from({ length: 8 }, () => ({ x: rnd() * w, y: rnd() * h, r: 90 + rnd() * 230, a: 0.4 + rnd() }));
  const f = (x, y) => {
    let v = 0;
    for (const p of hills) { const dx = x - p.x, dy = y - p.y; v += p.a * Math.exp(-(dx * dx + dy * dy) / (2 * p.r * p.r)); }
    return v + 0.07 * Math.sin(x / 47 + y / 89) + 0.05 * Math.sin(y / 37 - x / 63);
  };
  const nx = Math.ceil(w / cell) + 1, ny = Math.ceil(h / cell) + 1;
  const g = new Float32Array(nx * ny);
  let min = Infinity, max = -Infinity;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const v = f(i * cell, j * cell); g[j * nx + i] = v; if (v < min) min = v; if (v > max) max = v; }
  const T = { 1: [[3, 2]], 2: [[2, 1]], 3: [[3, 1]], 4: [[0, 1]], 5: [[3, 0], [2, 1]], 6: [[0, 2]], 7: [[3, 0]], 8: [[3, 0]], 9: [[0, 2]], 10: [[0, 1], [3, 2]], 11: [[0, 1]], 12: [[3, 1]], 13: [[2, 1]], 14: [[3, 2]] };
  const r1 = (v) => Math.round(v * 10) / 10;
  let thin = '', thick = '';
  for (let l = 1; l < levels; l++) {
    const t = min + ((max - min) * l) / levels;
    let d = '';
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const tl = g[j * nx + i], tr = g[j * nx + i + 1], br = g[(j + 1) * nx + i + 1], bl = g[(j + 1) * nx + i];
      const idx = (tl > t ? 8 : 0) | (tr > t ? 4 : 0) | (br > t ? 2 : 0) | (bl > t ? 1 : 0);
      const segs = T[idx]; if (!segs) continue;
      const x0 = i * cell, y0 = j * cell;
      const pt = (e) => e === 0 ? [x0 + cell * (t - tl) / (tr - tl), y0]
        : e === 1 ? [x0 + cell, y0 + cell * (t - tr) / (br - tr)]
        : e === 2 ? [x0 + cell * (t - bl) / (br - bl), y0 + cell]
        : [x0, y0 + cell * (t - tl) / (bl - tl)];
      for (const [a, b] of segs) { const p = pt(a), q = pt(b); d += `M${r1(p[0])} ${r1(p[1])}L${r1(q[0])} ${r1(q[1])}`; }
    }
    if (l % 5 === 0) thick += d; else thin += d;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke-linecap="round"><path d="${thin}" stroke="${color}" stroke-width="${sw}"/><path d="${thick}" stroke="${strong}" stroke-width="${sw * 1.8}"/></g></svg>`;
}
const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/* ---------- Karte ---------- */
const darkMQ = matchMedia('(prefers-color-scheme: dark)');
const TILE_ATTR = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · © <a href="https://carto.com/attributions">CARTO</a>';
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const tileUrl = () => `https://{s}.basemaps.cartocdn.com/${darkMQ.matches ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`;
function makeTiles() {
  return L.tileLayer(tileUrl(), { subdomains: 'abcd', maxNativeZoom: 14, maxZoom: 16, crossOrigin: true, errorTileUrl: BLANK, attribution: TILE_ATTR });
}
let map, tiles, routeLayer, mapKey = '';
function initMap() {
  if (!window.L) return;
  map = L.map('map', { zoomControl: false, center: C.MAP_CENTER, zoom: C.MAP_ZOOM, zoomSnap: 0.25, maxZoom: 16, minZoom: 9 });
  map.attributionControl.setPrefix(false);
  tiles = makeTiles().addTo(map);
  routeLayer = L.layerGroup().addTo(map);
  darkMQ.addEventListener('change', () => tiles.setUrl(tileUrl()));
}
function drawRoute(layer, pts, mini = false) {
  layer.clearLayers();
  if (pts.length > 1) {
    L.polyline(pts.map((p) => [p.lat, p.lng]), { color: '#ffffff', weight: mini ? 6 : 8, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }).addTo(layer);
    L.polyline(pts.map((p) => [p.lat, p.lng]), { color: '#30b158', weight: mini ? 3.5 : 4.5, opacity: 1, lineCap: 'round', lineJoin: 'round' }).addTo(layer);
  }
  if (mini) {
    pts.forEach((p, i) => L.circleMarker([p.lat, p.lng], { radius: i === 0 || i === pts.length - 1 ? 6 : 4, color: '#fff', weight: 2, fillColor: i === 0 ? '#007aff' : i === pts.length - 1 ? '#ff3b30' : '#30b158', fillOpacity: 1 }).addTo(layer));
    return;
  }
  pts.forEach((p, i) => {
    const icon = L.divIcon({ className: '', html: `<div class="pin ${i === 0 ? 'start' : ''} emoji">${C.MOODS[p.mood] || '📍'}</div>`, iconSize: [34, 34], iconAnchor: [17, 17] });
    L.marker([p.lat, p.lng], { icon, keyboard: false }).addTo(layer);
  });
}
function sheetVisibleHeight() { const s = $('.sheet'); return s ? Math.max(0, innerHeight - s.getBoundingClientRect().top) : 0; }
function fitMap(animate = true) {
  if (!map) return;
  const pts = geoPts();
  const padB = Math.min(sheetVisibleHeight(), innerHeight * 0.7) + 24;
  if (pts.length) {
    map.fitBounds(L.latLngBounds(pts.map((p) => [p.lat, p.lng])), { paddingTopLeft: [48, 80], paddingBottomRight: [48, padB], maxZoom: 14, animate });
  } else {
    map.setView(C.MAP_CENTER, C.MAP_ZOOM, { animate: false });
    map.panBy([0, padB / 2 - 40], { animate: false });
  }
}
function updateMap(force) {
  if (!map) return;
  const key = S.checkins.length + ':' + geoPts().length;
  if (key === mapKey && !force) return;
  mapKey = key;
  drawRoute(routeLayer, geoPts());
  fitMap(!force);
}

/* ---------- Bottom Sheet ---------- */
let tab = 'home', detent = 'medium';
const sheetPos = () => { const H = $('.sheet').offsetHeight; return { large: 0, medium: Math.round(H * 0.38), small: Math.max(0, H - 200) }; };
function setDetent(d) {
  detent = d; document.body.dataset.sheet = d;
  const y = sheetPos()[d];
  const s = $('.sheet'); s.style.transform = ''; s.style.setProperty('--sheet-y', y + 'px');
  $('.sheet-scroll').style.paddingBottom = `calc(${y}px + var(--tabbar-h) + var(--safe-b) + 28px)`;
}
function initSheetDrag() {
  const sheet = $('.sheet'), handle = $('.sheet-handle');
  let startY = 0, startOff = 0, lastY = 0, lastT = 0, vel = 0, moved = false, active = false;
  handle.addEventListener('pointerdown', (e) => {
    active = true; moved = false; startY = lastY = e.clientY; lastT = performance.now();
    startOff = sheetPos()[detent]; sheet.classList.add('dragging'); handle.setPointerCapture(e.pointerId);
  });
  handle.addEventListener('pointermove', (e) => {
    if (!active) return;
    const dy = e.clientY - startY; if (Math.abs(dy) > 4) moved = true;
    const t = performance.now(); vel = (e.clientY - lastY) / Math.max(1, t - lastT); lastY = e.clientY; lastT = t;
    const max = sheetPos().small;
    let y = startOff + dy; if (y < 0) y = y / 3; if (y > max) y = max + (y - max) / 3;
    sheet.style.transform = `translateY(${y}px)`;
  });
  const end = (e) => {
    if (!active) return; active = false; sheet.classList.remove('dragging');
    const P = sheetPos();
    if (!moved) { setDetent(detent === 'large' ? 'medium' : detent === 'medium' ? 'large' : 'medium'); return; }
    const y = startOff + (e.clientY - startY) + vel * 180;
    const best = Object.entries(P).sort((a, b) => Math.abs(a[1] - y) - Math.abs(b[1] - y))[0][0];
    setDetent(best);
    if (best !== 'large') setTimeout(() => fitMap(), 420);
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
  $('.sheet-scroll').addEventListener('scroll', (e) => { if (detent !== 'large' && e.target.scrollTop > 40) setDetent('large'); }, { passive: true });
  addEventListener('resize', () => setDetent(detent));
}

/* ---------- Komponenten ---------- */
const dots = (n) => `<span class="points">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;
const ptsWord = (n) => (n === 1 ? '1 Punkt' : `${n} Punkte`);
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function row({ icon, color = '', emoji, title, sub, trail = '', act, data = '', chevron = true, cls = '' }) {
  const ico = emoji ? `<div class="ico emoji-ico emoji">${emoji}</div>` : icon ? `<div class="ico ${color}">${I(icon)}</div>` : '';
  const tag = act ? 'button' : 'div';
  return `<${tag} class="row ${cls} ${ico ? '' : 'no-icon'}" ${act ? `data-act="${act}"` : ''} ${data}>${ico}
    <div class="main"><div class="title">${title}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>
    <div class="trail">${trail}${act && chevron ? `<span class="chev">${I('chevron')}</span>` : ''}</div></${tag}>`;
}
function stepper(act, id, val, { locked = false } = {}) {
  if (locked) return `<div class="trail num" style="font-size:20px;font-weight:600;color:var(--label)">${val ?? '–'} <span class="chev">${I('lock')}</span></div>`;
  return `<div class="stepper"><button data-act="${act}" data-id="${id}" data-d="-1" aria-label="weniger">${I('minus')}</button><output data-out="${act}-${id}" class="num">${val ?? '–'}</output><button class="plus" data-act="${act}" data-id="${id}" data-d="1" aria-label="mehr">${I('plus')}</button></div>`;
}
const countersGroup = () => `<div class="group">${C.COUNTERS.map((c) => `<div class="row"><div class="ico emoji-ico emoji">${c.emoji}</div><div class="main"><div class="title">${esc(c.label)}</div></div>${stepper('cnt', c.id, S.counters[c.id] || 0)}</div>`).join('')}</div>`;

function countdownHTML() {
  const ms = Math.max(0, COUNTDOWN_TS - now());
  const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
  return [[d, d === 1 ? 'Tag' : 'Tage'], [h, 'Std'], [m, 'Min'], [s, 'Sek']].map(([v, l]) => `<div><b>${String(v).padStart(2, '0')}</b><span>${l}</span></div>`).join('');
}
function sealedCard() {
  const n = receivedCount();
  return `<button class="sealed" data-act="tab" data-tab="missions" style="display:block;width:100%;text-align:left">
    <div class="stamp">STRENG GEHEIM</div>
    <div class="seal">${I('lock')}</div>
    <h3>Geheime Missionen</h3>
    <p>${n === 0 ? 'Noch keine Mission eingetroffen.' : `${n} von ${OTHERS.length} Missionen eingetroffen.`} Entsiegelt wird erst, wenn du am Samstag die Wanderung startest.</p>
    <div class="dots">${OTHERS.map((o) => `<i class="${S.received[o.id] ? 'on' : ''}"></i>`).join('')}</div>
  </button>`;
}
function dueBanner() {
  if (!checkinDue()) return '';
  const first = !S.checkins.length;
  return `<button class="banner" data-act="checkin"><div class="ico emoji">${first ? '🏁' : '⏰'}</div><div style="flex:1"><b>${first ? 'Start-Check-in' : 'Zeit für einen Check-in'}</b><span>${first ? 'Stimmung, Energie und Startpunkt festhalten' : 'Wie geht’s dir gerade? Dauert 10 Sekunden.'}</span></div><span class="chev">${I('chevron')}</span></button>`;
}
function liveStats() {
  return `<div class="live">
    <div class="stat blue"><div class="k">${I('clock')} Unterwegs</div><div class="v num" data-tick="dur">${fmtDur(durationMs())}<small>h</small></div></div>
    <div class="stat green"><div class="k">${I('walk')} Strecke</div><div class="v num">${fmtKm(kmFinal())}<small>km</small></div></div>
    <div class="stat"><div class="k">${I('location')} Check-ins</div><div class="v num">${S.checkins.length}</div></div>
    <div class="stat"><div class="k" style="color:var(--orange)">${I('sparkles')} Missionen</div><div class="v num">${missionPoints()}<small>P.</small></div></div>
  </div>`;
}
function nextCheckinText() {
  if (phase() !== 'during') return '';
  if (checkinDue()) return 'Check-in ist fällig';
  const ms = lastCheckinTs() + (C.CHECKIN_INTERVAL_MIN - 5) * 60000 - now();
  return `Nächster Check-in in ${Math.max(1, Math.ceil(ms / 60000))} Min`;
}

/* ---------- Ansicht: Übersicht ---------- */
function viewHome() {
  const p = phase();
  let h = '';
  if (p === 'before') {
    h += `<h1 class="large-title">Moin, ${esc(ME.name)}!</h1><p class="subtitle">${esc(dayLabel)} · mit ${esc(othersNames())}</p>`;
    const counting = now() < COUNTDOWN_TS;
    h += `<div class="hero">
      <div class="eyebrow">${counting ? 'Countdown bis Samstag' : 'Heute ist Wandertag'}</div>
      <div class="big">${counting ? 'Teutoburger Wald · Detmold' : 'Bereit, Buben?'}</div>
      ${counting ? `<div class="countdown" data-tick="countdown">${countdownHTML()}</div>` : `<div style="margin-top:6px;opacity:.9">${esc(C.TAGLINE)}. Heute zählt jeder Kilometer.</div>`}
    </div>`;
    if (canStart()) h += `<div style="margin-top:14px"><button class="btn primary" data-act="start">${I('play')} Wanderung starten</button></div>`;
    else h += `<p class="footnote">Am Samstag erscheint hier „Wanderung starten“. Damit beginnt dein Tagebuch, und deine Missionen werden entsiegelt.</p>`;
    h += `<div style="margin-top:14px">${sealedCard()}</div>`;

    const tiles = ls.get('tt:tiles', null);
    const tileSub = tiles?.done ? 'Für unterwegs gespeichert' : tiles?.pct != null ? `Wird gespeichert … ${tiles.pct} %` : navigator.onLine ? 'Wird vorbereitet …' : 'Lädt beim nächsten Öffnen mit Internet';
    h += `<div class="section-title">Vorbereitung</div><div class="group">
      ${row({ icon: 'phone', color: 'blue', title: 'Zum Home-Bildschirm', sub: isStandalone() ? 'Erledigt, läuft auch offline' : 'Damit die App im Wald offline läuft', act: 'install', trail: isStandalone() ? `<span class="check">${I('checkCircle')}</span>` : '', chevron: !isStandalone() })}
      ${row({ icon: 'location', title: 'Standort erlauben', sub: S.setup.loc ? 'Erlaubt, nur beim Check-in' : 'Nur beim Check-in, kein Dauer-GPS', act: 'askLoc', trail: S.setup.loc ? `<span class="check">${I('checkCircle')}</span>` : '', chevron: !S.setup.loc })}
      ${row({ icon: 'send', color: 'purple', title: 'Missionen verschicken', sub: `${sentCount()} von ${OTHERS.length} verschickt`, act: 'tab', data: 'data-tab="missions"', trail: sentCount() === OTHERS.length ? `<span class="check">${I('checkCircle')}</span>` : '' })}
      ${row({ icon: 'map', color: 'gray', title: 'Offline-Karte', sub: tileSub, trail: tiles?.done ? `<span class="check">${I('checkCircle')}</span>` : '' })}
    </div>`;
    h += tipsGroup(false);
  } else if (p === 'during') {
    h += dueBanner();
    h += `<h1 class="large-title">Unterwegs</h1><p class="subtitle">Gestartet um ${fmtTime(S.hike.start)} · <span data-tick="next">${nextCheckinText()}</span></p>`;
    h += liveStats();
    h += `<div class="btn-row" style="margin-top:12px"><button class="btn tinted" data-act="checkin">${I('location')} Check-in</button><button class="btn gray" data-act="end">${I('flag')} Beenden</button></div>`;
    h += `<div class="section-title">Zähler</div>${countersGroup()}`;
    h += `<div class="section-title">Geheim</div><div class="group">${row({ icon: 'lockOpen', color: 'orange', title: 'Deine Missionen', sub: `${missionsDone()} von ${receivedCount()} erledigt · ${missionPoints()} Punkte`, act: 'tab', data: 'data-tab="missions"' })}</div>`;
  } else {
    h += `<h1 class="large-title">Geschafft! 🎉</h1><p class="subtitle">${fmtTime(S.hike.start)}–${fmtTime(S.hike.end)} Uhr · ${fmtDur(durationMs(), true)}</p>`;
    h += liveStats();
    h += `<div class="stack" style="margin-top:12px">
      <button class="btn primary" data-act="summary">${I('rings')} Meine Bilanz</button>
      <button class="btn tinted blue-t" data-act="resolution">${I('trophy')} Auflösung & Siegerehrung</button>
    </div>`;
    h += resultsGroup();
    h += `<div class="section-title">Zähler</div>${countersGroup()}`;
  }
  return h;
}
function tipsGroup(locked) {
  return `<div class="section-title">Deine Tipps</div><div class="group">
    <div class="row"><div class="ico">${I('walk')}</div><div class="main"><div class="title">Wie viele km schafft ihr?</div></div>${stepper('tip', 'km', S.tips.km, { locked })}</div>
    <div class="row"><div class="ico emoji-ico emoji">💦</div><div class="main"><div class="title">Wie viele Pinkelpausen machst du?</div></div>${stepper('tip', 'pee', S.tips.pee, { locked })}</div>
  </div><p class="footnote">${locked ? 'Festgeschrieben beim Start.' : 'Werden beim Start festgeschrieben.'} In der Bilanz steht dann dein Tipp neben dem echten Ergebnis.</p>`;
}
function resultsGroup() {
  const kc = kmComputed();
  return `<div class="section-title">Ergebnis</div><div class="group">
    <div class="row"><div class="ico orange">${I('footprints')}</div><div class="main"><div class="title">Schritte</div><div class="sub">Aus der Health-App</div></div><input class="inline-input" data-input="steps" inputmode="numeric" pattern="[0-9]*" placeholder="z. B. 28.500" value="${S.steps ?? ''}"></div>
    <div class="row"><div class="ico">${I('location')}</div><div class="main"><div class="title">Strecke (Check-ins)</div><div class="sub">Luftlinie × ${String(C.ROUTE_FACTOR).replace('.', ',')}, grob geschätzt</div></div><div class="trail num">${kc == null ? 'zu wenig Punkte' : fmtKm(kc) + ' km'}</div></div>
    <div class="row"><div class="ico blue">${I('pencil')}</div><div class="main"><div class="title">Strecke aus Komoot/Uhr</div><div class="sub">Ersetzt die Schätzung</div></div><input class="inline-input" data-input="kmOverride" inputmode="decimal" placeholder="km" value="${S.kmOverride != null ? fmtKm(S.kmOverride) : ''}"></div>
  </div>`;
}

/* ---------- Ansicht: Missionen ---------- */
function missionCard(writer, m, { open = true, interactive = true } = {}) {
  return `<div class="flip ${open ? 'open' : ''}" data-from="${writer.id}">
    <div class="flip-inner">
      <div class="flip-face flip-front">
        <div class="mission-meta" style="color:rgba(245,241,230,.55)"><span>Streng geheim</span>${I('lock')}</div>
        <div style="display:flex;align-items:center;gap:14px"><div class="seal" style="width:48px;height:48px;font-size:22px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff6b5e,#c0271c 70%);display:grid;place-items:center">${I('lock')}</div>
        <div><div style="font-size:20px;font-weight:700">Mission ${m.random ? '(Zufall)' : 'von ' + esc(writer.name)}</div><div style="color:rgba(245,241,230,.6);font-size:14px">Versiegelt</div></div></div>
        <div style="font-size:13px;color:rgba(245,241,230,.45)">Nur du und ${m.random ? 'der Zufall' : esc(writer.name)} wissen davon.</div>
      </div>
      <div class="flip-face flip-back">
        <div class="mission-meta"><span>${m.random ? 'Zufallsmission' : 'Von ' + esc(writer.name)}</span><span style="display:flex;gap:6px;align-items:center">${dots(m.points)}<span class="pts-label">${ptsWord(m.points)}</span></span></div>
        <div class="mission-text">${esc(m.text)}</div>
        ${interactive ? `<button class="done-btn ${m.done ? 'done' : ''}" data-act="toggleDone" data-from="${writer.id}">${I(m.done ? 'checkCircle' : 'circle')} ${m.done ? 'Erledigt' : 'Als erledigt markieren'}</button>` : ''}
      </div>
    </div></div>`;
}
function viewMissions() {
  const p = phase();
  let h = `<h1 class="large-title">Geheime Missionen</h1><p class="subtitle">Jeder schreibt jedem eine Mission. Nur Verfasser und Empfänger kennen sie.</p>`;
  h += `<div class="section-title">Deine Missionen</div>`;
  if (p === 'before') {
    h += sealedCard();
    h += `<div style="margin-top:12px"><button class="btn tinted blue-t" data-act="receive">${I('tray')} Mission empfangen</button></div>`;
  } else {
    OTHERS.forEach((o) => {
      const m = S.received[o.id];
      if (m) h += missionCard(o, m);
      else h += `<div class="card fade-in" style="margin-top:14px"><div class="mission-meta"><span>Von ${esc(o.name)}</span></div><p class="small" style="margin:8px 0 14px">Von ${esc(o.name)} ist keine Mission eingetroffen. Lass sie dir schicken oder zieh eine Zufallsmission.</p>
        <div class="btn-row"><button class="btn gray small" data-act="receive">${I('tray')} Empfangen</button><button class="btn tinted small" data-act="drawRandom" data-from="${o.id}">${I('dice')} Zufall</button></div></div>`;
    });
    h += `<p class="footnote">Regel: Die anderen dürfen nicht merken, dass es eine Mission ist. Bei der Auflösung raten sie, was du vorhattest.</p>`;
  }

  h += `<div class="section-title">Missionen schreiben</div><div class="group">`;
  OTHERS.forEach((o) => {
    const s = S.sent[o.id];
    h += row({ emoji: s ? '✉️' : '✏️', title: `Für ${esc(o.name)}`, sub: s ? `Verschickt · ${ptsWord(s.points)} · „${esc(s.text.slice(0, 38))}${s.text.length > 38 ? '…' : ''}“` : 'Noch offen', act: 'write', data: `data-to="${o.id}"`, trail: s ? `<span class="check">${I('checkCircle')}</span>` : '' });
  });
  h += `</div><p class="footnote">Schick jede Mission im Einzelchat, nicht in die Gruppe. Der Code ist verschlüsselt, ${esc(OTHERS[0]?.name || '')} kann ihn erst am Wandertag lesen.</p>`;

  h += `<div class="section-title">So funktioniert’s</div><div class="group">
    ${row({ icon: 'pencil', color: 'purple', title: 'Schreiben', sub: 'Vorschlag wählen oder eigene Idee, 1–3 Punkte je nach Schwierigkeit' })}
    ${row({ icon: 'send', color: 'blue', title: 'Verschicken', sub: 'Code im Einzelchat schicken. Der andere fügt ihn unter „Mission empfangen“ ein.' })}
    ${row({ icon: 'lockOpen', color: 'orange', title: 'Entsiegeln', sub: 'Beim Start der Wanderung. Dann unauffällig erledigen und abhaken.' })}
    ${row({ icon: 'trophy', title: 'Auflösen', sub: 'Am Ende auf einem Handy: erledigt = Punkte der Mission, richtig geraten = 1 Punkt' })}
  </div>`;
  if (p !== 'before') h += `<div class="section-title">Ende</div><div class="group">${row({ icon: 'trophy', color: 'orange', title: 'Auflösung & Siegerehrung', sub: 'Auf einem Handy für alle', act: 'resolution' })}${row({ icon: 'tray', color: 'gray', title: 'Mission empfangen', act: 'receive' })}</div>`;
  return h;
}

/* ---------- Ansicht: Tagebuch ---------- */
function viewDiary() {
  const p = phase();
  let h = p === 'during' ? dueBanner() : '';
  h += `<h1 class="large-title">Tagebuch</h1><p class="subtitle">Nur für dich, bleibt auf deinem Handy.</p>`;
  if (p === 'before') {
    h += `<div class="card center"><div class="empty" style="padding:8px"><div class="big-emoji emoji">🥾</div><b style="color:var(--label)">Noch nicht gestartet</b><p class="small" style="margin:6px 0 0">Am Samstag startest du hier deine Wanderung. Danach alle ${C.CHECKIN_INTERVAL_MIN} Minuten ein kurzer Check-in.</p></div>
      ${canStart() ? `<button class="btn primary" data-act="start" style="margin-top:10px">${I('play')} Wanderung starten</button>` : ''}</div>`;
  } else {
    h += `<div class="group">
      ${row({ icon: 'play', title: 'Start', trail: `<span class="num">${fmtTime(S.hike.start)} Uhr</span>` })}
      ${row({ icon: 'flag', color: 'blue', title: 'Ende', trail: `<span class="num">${S.hike.end ? fmtTime(S.hike.end) + ' Uhr' : '–'}</span>` })}
      ${row({ icon: 'clock', color: 'orange', title: 'Dauer', trail: `<span class="num" data-tick="durlong">${fmtDur(durationMs(), true)}</span>` })}
    </div>`;
    if (p === 'during') h += `<div class="btn-row" style="margin-top:12px"><button class="btn tinted" data-act="checkin">${I('location')} Check-in</button><button class="btn gray" data-act="end">${I('flag')} Beenden</button></div>`;
    h += `<div class="section-title">Check-ins</div>`;
    if (!S.checkins.length) h += `<div class="group"><div class="empty">Noch keine Check-ins.</div></div>`;
    else h += `<div class="group timeline">${S.checkins.slice().reverse().map((c) => `<div class="row"><div class="moodbig emoji">${C.MOODS[c.mood]}</div><div class="main"><div class="title num">${fmtTime(c.t)} Uhr <span class="bat" style="margin-left:6px">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= c.energy ? 'on' : ''}"></i>`).join('')}</span></div>${c.note ? `<div class="note">„${esc(c.note)}“</div>` : ''}<div class="sub">${c.lat != null ? `${I('location')} Standort gespeichert` : 'ohne Standort'}</div></div></div>`).join('')}</div>`;
  }
  h += `<div class="section-title">Zähler</div>${countersGroup()}`;
  h += tipsGroup(p !== 'before');
  if (p !== 'before') h += resultsGroup();
  return h;
}

/* ---------- Ansicht: Bilanz-Hub ---------- */
function viewSummaryHub() {
  const p = phase();
  let h = `<h1 class="large-title">Bilanz</h1><p class="subtitle">Dein Rückblick für die WhatsApp-Gruppe.</p>`;
  if (p === 'before') {
    h += `<div class="card"><div class="empty"><div class="big-emoji emoji">📊</div><b style="color:var(--label)">Gibt’s nach der Wanderung</b><p class="small" style="margin:6px 0 0">Dauer, Kilometer, Schritte, Stimmungskurve, Route, Zähler, Missionspunkte und deine Tipps gegen das echte Ergebnis.</p></div></div>`;
    return h;
  }
  h += `<div class="stack"><button class="btn primary" data-act="summary">${I('rings')} Bilanz anzeigen</button>
    <button class="btn tinted blue-t" data-act="resolution">${I('trophy')} Auflösung & Siegerehrung</button></div>
    <p class="footnote">Tipp: In der Bilanz einen Screenshot machen und in die Gruppe schicken.</p>`;
  if (p === 'after') h += resultsGroup();
  return h;
}

/* ---------- Grundgerüst ---------- */
const TABS = [
  { id: 'home', label: 'Übersicht', icon: 'house', view: viewHome },
  { id: 'missions', label: 'Missionen', icon: 'lock', view: viewMissions },
  { id: 'diary', label: 'Tagebuch', icon: 'book', view: viewDiary },
  { id: 'summary', label: 'Bilanz', icon: 'rings', view: viewSummaryHub },
];
function mountShell() {
  $('#app').innerHTML = `
    <div class="offline-chip ${navigator.onLine ? 'hidden' : ''}">${I('wifiSlash')} Offline</div>
    <div class="map-buttons"><button data-act="fit" aria-label="Route zeigen">${I('location')}</button></div>
    <section class="sheet" aria-label="Inhalt"><div class="sheet-handle" aria-label="Ziehen zum Vergrößern"></div><div class="sheet-scroll"></div></section>
    <nav class="tabbar" role="tablist">${TABS.map((t) => `<button role="tab" data-act="tab" data-tab="${t.id}" aria-selected="${t.id === tab}">${I(t.id === 'missions' && phase() !== 'before' ? 'lockOpen' : t.icon)}<span>${t.label}</span><span class="badge hidden"></span></button>`).join('')}</nav>`;
  addEventListener('online', updateOnline); addEventListener('offline', updateOnline);
}
function updateOnline() { $('.offline-chip')?.classList.toggle('hidden', navigator.onLine); if (navigator.onLine) startPrefetch(); }
function renderTabbar() {
  $$('.tabbar button').forEach((b) => {
    const id = b.dataset.tab; b.setAttribute('aria-selected', String(id === tab));
    const badge = $('.badge', b);
    let txt = '';
    if (id === 'diary' && checkinDue()) txt = '1';
    if (id === 'missions' && phase() === 'before' && sentCount() < OTHERS.length) txt = String(OTHERS.length - sentCount());
    badge.textContent = txt; badge.classList.toggle('hidden', !txt);
  });
}
function render() {
  if (!ME) return;
  const sc = $('.sheet-scroll');
  const st = sc.scrollTop;
  sc.innerHTML = TABS.find((t) => t.id === tab).view();
  sc.scrollTop = st;
  renderTabbar();
  updateMap();
}
function setTab(id) {
  if (id === tab) { $('.sheet-scroll').scrollTo({ top: 0, behavior: 'smooth' }); if (detent === 'small') setDetent('medium'); return; }
  tab = id; $('.sheet-scroll').scrollTop = 0; render();
  if (detent === 'small') setDetent('medium');
}

/* ---------- Modals ---------- */
const modals = [];
function openModal({ title = '', body = '', foot = '', full = false, head = true, actions = {}, onClose, right } = {}) {
  const bd = document.createElement('div'); bd.className = 'modal-backdrop';
  const m = document.createElement('div'); m.className = 'modal' + (full ? ' full' : ''); m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
  m.innerHTML = `${head ? `<div class="modal-head"><div class="l"></div><h2></h2><div class="r">${right || `<button class="close-x" data-act="close" aria-label="Schließen">${I('xmark')}</button>`}</div></div>` : ''}<div class="modal-body"></div>${foot !== null ? '<div class="modal-foot"></div>' : ''}`;
  const api = {
    el: m, body: $('.modal-body', m), actions, closed: false,
    set(html) { const st = api.body.scrollTop; api.body.innerHTML = html; api.body.scrollTop = st; },
    setFoot(html) { const f = $('.modal-foot', m); if (f) { f.innerHTML = html; f.style.display = html ? '' : 'none'; } },
    setTitle(t) { const h2 = $('h2', m); if (h2) h2.textContent = t; },
    close(silent) {
      if (api.closed) return; api.closed = true;
      m.classList.remove('show'); bd.classList.remove('show');
      setTimeout(() => { m.remove(); bd.remove(); }, 450);
      modals.splice(modals.indexOf(api), 1);
      render();
      if (!silent && onClose) onClose();
    },
  };
  m.__api = api;
  api.setTitle(title); api.set(body); api.setFoot(foot);
  document.body.append(bd, m);
  requestAnimationFrame(() => requestAnimationFrame(() => { bd.classList.add('show'); m.classList.add('show'); }));
  bd.addEventListener('click', () => api.close());
  // Wischen nach unten zum Schließen
  const hd = $('.modal-head', m);
  if (hd && !full) {
    let y0 = null;
    hd.addEventListener('pointerdown', (e) => { y0 = e.clientY; m.style.transition = 'none'; hd.setPointerCapture(e.pointerId); });
    hd.addEventListener('pointermove', (e) => { if (y0 == null) return; const dy = Math.max(0, e.clientY - y0); m.style.transform = `translateY(${dy}px)`; });
    const up = (e) => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null; m.style.transition = ''; m.style.transform = ''; if (dy > 110) api.close(); };
    hd.addEventListener('pointerup', up); hd.addEventListener('pointercancel', up);
  }
  modals.push(api);
  return api;
}
function confirmSheet({ title, text, ok = 'OK', cancel = 'Abbrechen', okClass = 'primary', emoji = '' }) {
  return new Promise((resolve) => {
    let result = false;
    const md = openModal({
      title: '', foot: null,
      body: `<div class="center" style="padding:4px 8px 6px">${emoji ? `<div class="emoji" style="font-size:52px;margin-bottom:6px">${emoji}</div>` : ''}<h2 style="margin:0 0 6px;font-size:22px">${esc(title)}</h2><p class="muted" style="margin:0 0 20px">${text}</p></div>
        <div class="stack"><button class="btn ${okClass}" data-act="ok">${esc(ok)}</button><button class="btn gray" data-act="close">${esc(cancel)}</button></div>`,
      actions: { ok: () => { result = true; md.close(); } },
      onClose: () => resolve(result),
    });
  });
}

/* ---------- Start / Ende ---------- */
async function doStart() {
  const ok = await confirmSheet({ emoji: '🥾', title: 'Wanderung starten?', text: 'Deine Startzeit wird gespeichert, deine Tipps werden festgeschrieben, und deine geheimen Missionen werden entsiegelt.', ok: 'Los geht’s' });
  if (!ok) return;
  S.hike.start = now(); save(); haptic(20);
  tab = 'home'; mountTabIcons(); render();
  setTimeout(() => openReveal(() => openCheckin({ first: true })), 350);
}
async function doEnd() {
  const ok = await confirmSheet({ emoji: '🏁', title: 'Wanderung beenden?', text: 'Endzeit und Dauer werden gespeichert. Danach kommen ein letzter Check-in und deine Schritte.', ok: 'Beenden', okClass: 'blue' });
  if (!ok) return;
  S.hike.end = now(); save(); haptic(20); render();
  setTimeout(() => openCheckin({ final: true, then: openResults }), 350);
}
function mountTabIcons() {
  const b = $('.tabbar [data-tab="missions"] svg'); if (b) b.outerHTML = I(phase() === 'before' ? 'lock' : 'lockOpen');
}

/* ---------- Aufdecken ---------- */
function openReveal(then) {
  const list = OTHERS.map((o) => [o, S.received[o.id]]).filter(([, m]) => m);
  const body = list.length
    ? `<p class="muted center" style="margin:0 0 16px">Streng geheim. Lass dir nichts anmerken. 🤫</p>${list.map(([o, m]) => missionCard(o, m, { open: false, interactive: false })).join('')}`
    : `<div class="empty"><div class="big-emoji emoji">📭</div><b style="color:var(--label)">Keine Missionen eingetroffen</b><p class="small">Unter „Missionen“ kannst du sie noch empfangen oder Zufallsmissionen ziehen.</p></div>`;
  const md = openModal({ title: 'Deine Missionen', body, foot: `<button class="btn primary" data-act="close">Verstanden 🤫</button>`, onClose: () => { S.revealed = true; save(); then && then(); } });
  $$('.flip', md.body).forEach((el, i) => setTimeout(() => { el.classList.add('open'); haptic([18, 40, 18]); }, 650 + i * 700));
}

/* ---------- Check-in ---------- */
function getPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    let done = false;
    const fin = (v) => { if (!done) { done = true; resolve(v); } };
    setTimeout(() => fin(null), 16000);
    navigator.geolocation.getCurrentPosition(
      (p) => fin({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy) }),
      () => fin(null),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  });
}
function openCheckin({ first = false, final = false, then } = {}) {
  const st = { mood: null, energy: null, note: '' };
  const title = first ? 'Start-Check-in' : final ? 'Ziel-Check-in' : 'Check-in';
  const draw = () => {
    md.set(`<p class="muted center" style="margin:0 0 4px">${first ? 'Auf geht’s! Wie startest du in den Tag?' : final ? 'Geschafft! Wie fühlst du dich?' : fmtTime(now()) + ' Uhr: Wie läuft’s?'}</p>
      <div class="section-title">Stimmung</div>
      <div class="moods">${C.MOODS.map((e, i) => `<button class="emoji" data-act="mood" data-v="${i}" aria-pressed="${st.mood === i}" aria-label="Stimmung ${i + 1}">${e}</button>`).join('')}</div>
      <div class="section-title">Energie</div>
      <div class="energy">${[1, 2, 3, 4, 5].map((i) => `<button data-act="energy" data-v="${i}" class="${st.energy != null && i <= st.energy ? 'on' : ''}">${I('bolt')}${i}</button>`).join('')}</div>
      <div class="section-title">Ein Satz zum Moment (optional)</div>
      <textarea class="field" data-input="note" maxlength="140" rows="2" placeholder="z. B. Erste Rast am Hermann, Rico verteilt Brote">${esc(st.note)}</textarea>
      <p class="footnote" style="margin-left:2px">${I('location')} Beim Speichern wird einmalig dein Standort erfasst.</p>`);
    md.setFoot(`<button class="btn primary" data-act="saveCI" ${st.mood == null || st.energy == null ? 'disabled' : ''}>Check-in speichern</button>`);
  };
  const md = openModal({
    title, onClose: () => then && then(),
    actions: {
      mood: (el) => { st.mood = +el.dataset.v; haptic(); draw(); },
      energy: (el) => { st.energy = +el.dataset.v; haptic(); draw(); },
      saveCI: async (el) => {
        el.disabled = true; el.innerHTML = `${I('location')} Standort wird ermittelt …`;
        const pos = await getPosition();
        if (pos) S.setup.loc = true;
        S.checkins.push({ t: now(), mood: st.mood, energy: st.energy, note: st.note.trim(), ...(pos || {}) });
        save(); haptic(15);
        md.close();
        toast(pos ? 'Check-in gespeichert' : 'Gespeichert, ohne Standort', pos ? 'checkCircle' : 'location');
        updateMap(true);
      },
    },
  });
  md.note = (v) => { st.note = v; };
  draw();
}

/* ---------- Ergebnis (Schritte & km) ---------- */
function openResults() {
  openModal({
    title: 'Ergebnis', body: `<p class="muted center" style="margin:0 0 4px">Trag noch deine Schritte aus der Health-App ein. Wenn du Komoot oder eine Uhr genutzt hast, ersetz die geschätzte Strecke.</p>${resultsGroup()}`,
    foot: `<button class="btn primary" data-act="toSummary">${I('rings')} Bilanz anzeigen</button>`,
    actions: { toSummary: (el, e, md) => { md.close(true); setTimeout(openSummary, 300); } },
  });
}

/* ---------- Missionen schreiben ---------- */
function openWriter(toId) {
  const to = byId(toId);
  const prev = S.sent[toId];
  const st = { mode: prev && prev.poolIdx == null ? 'custom' : 'pool', idx: prev?.poolIdx ?? null, text: prev && prev.poolIdx == null ? prev.text : '', points: prev?.points ?? 2 };
  const takenBy = {};
  OTHERS.forEach((o) => { if (o.id !== toId && S.sent[o.id]?.poolIdx != null) takenBy[S.sent[o.id].poolIdx] = o.name; });
  const draw = () => {
    let b = `<div class="segmented" style="margin:4px 0 14px"><button data-act="mode" data-v="pool" aria-pressed="${st.mode === 'pool'}">Vorschläge</button><button data-act="mode" data-v="custom" aria-pressed="${st.mode === 'custom'}">Eigene Idee</button></div>`;
    if (st.mode === 'pool') {
      b += `<div class="group pool-list">${C.MISSION_POOL.map((m, i) => {
        const taken = takenBy[i];
        return `<button class="row no-icon" data-act="pick" data-i="${i}" ${taken ? 'disabled style="opacity:.4"' : ''}><span class="radio ${st.idx === i ? 'on' : ''}">${st.idx === i ? I('check') : ''}</span><div class="main"><div class="title">${esc(m.text)}</div><div class="sub" style="display:flex;gap:6px;align-items:center">${dots(m.points)} ${taken ? `schon an ${esc(taken)} vergeben` : ptsWord(m.points)}</div></div></button>`;
      }).join('')}</div>`;
    } else {
      b += `<textarea class="field" data-input="wtext" maxlength="240" rows="4" placeholder="Was soll ${esc(to.name)} heimlich tun? z. B. „Bring Jan dazu, …“">${esc(st.text)}</textarea>
        <p class="footnote" style="margin-left:2px">Bitte harmlos und freundlich: nichts Gefährliches, nichts, was Fremde nervt.</p>`;
    }
    md.set(b);
    md.setFoot(`<div class="pts-picker" style="margin-bottom:10px">${[[1, 'leicht'], [2, 'mittel'], [3, 'schwer']].map(([p, l]) => `<button data-act="pts" data-v="${p}" aria-pressed="${st.points === p}">${ptsWord(p)}<small>${l}</small></button>`).join('')}</div>
      <button class="btn primary" data-act="send">${I('lock')} Versiegeln & an ${esc(to.name)} schicken</button>`);
  };
  const md = openModal({
    title: `Mission für ${to.name}`,
    actions: {
      mode: (el) => { st.mode = el.dataset.v; draw(); },
      pick: (el) => { st.idx = +el.dataset.i; st.points = C.MISSION_POOL[st.idx].points; haptic(); draw(); },
      pts: (el) => { st.points = +el.dataset.v; haptic(); draw(); },
      send: () => {
        const text = st.mode === 'pool' ? (st.idx != null ? C.MISSION_POOL[st.idx].text : '') : st.text.trim();
        if (text.length < 6) { toast(st.mode === 'pool' ? 'Wähl erst eine Mission aus' : 'Schreib erst eine Mission', 'pencil'); return; }
        const code = encodeMission(to, { text, points: st.points });
        S.sent[toId] = { text, points: st.points, poolIdx: st.mode === 'pool' ? st.idx : null, at: now(), code };
        save();
        shareMission(to, code).then((how) => {
          if (how === 'shared') toast(`An ${to.name} verschickt`, 'send');
          else if (how === 'copied') toast(`Kopiert, jetzt im Chat mit ${to.name} einfügen`, 'clipboard');
          md.close();
        });
      },
    },
  });
  md.wtext = (v) => { st.text = v; };
  draw();
}
function missionMessage(to, code) {
  return `🔒 Geheime Mission für ${to.name}\n\nNur für dich, ${to.name}. Bitte nicht in die Gruppe weiterleiten! 🤫\nÖffne die Teuto-Tour-App → Missionen → „Mission empfangen“ und füge diese Nachricht ein. Lesbar wird sie erst, wenn du am Samstag die Wanderung startest.\n\n${code}`;
}
async function shareMission(to, code) {
  const text = missionMessage(to, code);
  if (navigator.share) {
    try { await navigator.share({ text }); return 'shared'; }
    catch (e) { if (e && e.name === 'AbortError') return 'aborted'; }
  }
  try { await navigator.clipboard.writeText(text); return 'copied'; }
  catch {
    openModal({ title: 'Nachricht kopieren', body: `<p class="muted">Kopiere diesen Text und schick ihn im Einzelchat an ${esc(to.name)}:</p><textarea class="field" rows="8" readonly>${esc(text)}</textarea>` });
    return 'manual';
  }
}

/* ---------- Mission empfangen ---------- */
function openReceive() {
  const draw = (msg = '') => {
    md.set(`<div class="center" style="padding:0 6px"><div class="emoji" style="font-size:46px">📨</div><p class="muted" style="margin:6px 0 16px">Kopiere die Nachricht mit dem Code aus WhatsApp und füge sie hier ein.</p></div>
      <div class="stack">
        <button class="btn tinted blue-t" data-act="paste">${I('clipboard')} Aus Zwischenablage einfügen</button>
        <textarea class="field" data-input="rx" rows="3" placeholder="…oder hier einfügen (beginnt mit TT1-)"></textarea>
        ${msg}
      </div>`);
  };
  const tryImport = (text) => {
    const r = decodeMission(text);
    if (r.err === 'nocode') { if (text.trim().length > 10) draw(`<p class="footnote" style="color:var(--red);margin:0">Kein Missions-Code gefunden. Er beginnt mit „TT1-“.</p>`); return; }
    if (r.err) { haptic([30, 60, 30]); draw(`<p class="footnote" style="color:var(--red);margin:0">Diese Mission ist nicht für dich, ${esc(ME.name)}. Nicht spicken! 🙈</p>`); return; }
    const o = r.ok, writer = byId(o.f);
    const existed = S.received[o.f];
    S.received[o.f] = { text: o.x, points: o.p, at: now(), done: existed?.done && existed.text === o.x ? true : false, random: false };
    save(); haptic([15, 40, 15]);
    const started = phase() !== 'before';
    md.set(`<div class="center fade-in" style="padding:6px 6px 0"><div class="sealed" style="text-align:left"><div class="stamp">EINGETROFFEN</div><div class="seal">${I('lock')}</div><h3>Mission von ${esc(writer.name)}</h3>
      <p>${existed ? 'Aktualisiert. ' : ''}${started ? 'Du findest sie jetzt unter „Deine Missionen“.' : 'Bleibt versiegelt, bis du am Samstag die Wanderung startest.'}</p>
      <div class="dots">${OTHERS.map((x) => `<i class="${S.received[x.id] ? 'on' : ''}"></i>`).join('')}</div></div>
      <p class="muted" style="margin:16px 0 0">${receivedCount()} von ${OTHERS.length} Missionen eingetroffen</p></div>`);
    md.setFoot(`<button class="btn primary" data-act="close">Fertig</button>`);
  };
  const md = openModal({
    title: 'Mission empfangen', foot: '',
    actions: {
      paste: async () => {
        try { const t = await navigator.clipboard.readText(); const ta = $('[data-input="rx"]', md.body); if (ta) ta.value = t; tryImport(t); }
        catch { toast('Bitte lange ins Feld tippen → Einsetzen', 'clipboard'); $('[data-input="rx"]', md.body)?.focus(); }
      },
    },
  });
  md.rx = (v) => { if (/TT1-[A-Za-z0-9_-]{16,}/.test(v)) tryImport(v); };
  draw();
}

/* ---------- Zufallsmission ---------- */
function drawRandom(fromId) {
  const used = new Set(Object.values(S.received).map((m) => m.text));
  Object.values(S.sent).forEach((m) => used.add(m.text));
  const pool = C.MISSION_POOL.filter((m) => !used.has(m.text));
  const m = pool[Math.floor(Math.random() * pool.length)] || C.MISSION_POOL[0];
  S.received[fromId] = { text: m.text, points: m.points, at: now(), done: false, random: true };
  save(); haptic([18, 40, 18]); render();
  const el = $(`.flip[data-from="${fromId}"]`);
  if (el) { el.classList.remove('open'); setTimeout(() => el.classList.add('open'), 60); }
}

/* ---------- Bilanz ---------- */
function moodChart() {
  const c = S.checkins;
  if (c.length < 2) return `<div class="muted small" style="padding:12px 0">${c.length ? `Ein Check-in: ${C.MOODS[c[0].mood]}` : 'Keine Check-ins'}. Für eine Kurve braucht es mindestens zwei.</div>`;
  const W = 320, H = 92, t0 = c[0].t, t1 = c[c.length - 1].t, span = Math.max(1, t1 - t0);
  const X = (t) => 14 + ((t - t0) / span) * (W - 28), Y = (m) => 74 - m * 15;
  const P = c.map((p) => [X(p.t), Y(p.mood)]);
  let d = `M${P[0][0]},${P[0][1]}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  const bars = c.map((p) => `<rect x="${X(p.t) - 3}" y="${86 - p.energy * 5}" width="6" height="${p.energy * 5}" rx="2" fill="var(--orange)" opacity=".35"/>`).join('');
  const emo = c.map((p, i) => (c.length <= 9 || i % Math.ceil(c.length / 9) === 0 || i === c.length - 1) ? `<text x="${X(p.t)}" y="${Y(p.mood) - 9}" text-anchor="middle" font-size="13" class="emoji">${C.MOODS[p.mood]}</text>` : '').join('');
  return `<svg viewBox="0 0 ${W} 104" preserveAspectRatio="none">
    <defs><linearGradient id="mg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--green)" stop-opacity=".35"/><stop offset="1" stop-color="var(--green)" stop-opacity="0"/></linearGradient></defs>
    ${bars}<path d="${d} L${P[P.length - 1][0]},86 L${P[0][0]},86 Z" fill="url(#mg)"/>
    <path d="${d}" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"/>
    ${P.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="var(--card)" stroke="var(--green)" stroke-width="2"/>`).join('')}${emo}
    <text x="14" y="102" class="axis">${fmtTime(t0)}</text><text x="${W - 14}" y="102" class="axis" text-anchor="end">${fmtTime(t1)}</text>
  </svg>`;
}
function vsRow(label, tip, real, unit, fmt) {
  let verdict = '';
  if (tip != null && real != null) {
    const diff = Math.abs(real - tip), rel = real ? diff / Math.max(real, 1) : diff;
    verdict = diff === 0 || rel < 0.08 ? '🎯' : rel < 0.25 ? '👍' : real > tip ? '📈' : '📉';
  }
  return `<div>${label}</div><div class="r">${tip == null ? '–' : fmt(tip)}</div><div class="r">${real == null ? '–' : fmt(real)}${unit} <span class="emoji">${verdict}</span></div>`;
}
function rankInfo() {
  const r = S.resolution; if (!r || r.step !== 'final') return null;
  const sc = computeScores(); const sorted = rankList(sc);
  return sorted.find((x) => x.id === ME.id);
}
function openSummary() {
  const km = kmFinal(), pct = km == null ? 0 : Math.min(1, km / C.GOAL_KM);
  const R = 52, CIRC = 2 * Math.PI * R;
  const notes = S.checkins.filter((c) => c.note);
  const quote = notes.length ? notes.slice().sort((a, b) => b.mood - a.mood || b.note.length - a.note.length)[0] : null;
  const rank = rankInfo();
  const body = `<div class="summary">
    <div class="summary-head"><div><div class="date">${esc(dayShort)} · Teutoburger Wald</div><h1>${esc(gen(ME.name))} Wandertag</h1></div><button class="close-x" data-act="close" aria-label="Schließen">${I('xmark')}</button></div>
    <div class="summary-hero">
      <div class="ring-wrap"><svg viewBox="0 0 128 128"><circle cx="64" cy="64" r="${R}" fill="none" stroke-width="14" class="ring-track"/><circle class="ring-bar" cx="64" cy="64" r="${R}" fill="none" stroke-width="14" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}" data-target="${CIRC * (1 - pct)}"/></svg>
        <div class="ring-label"><div><b>${Math.round(pct * 100)}%</b><br><span>der<br>${esc(C.GOAL_LABEL)}</span></div></div></div>
      <div class="hero-stats">
        <div class="hs km"><div class="k">Strecke</div><div class="v">${fmtKm(km)}<small> km</small></div></div>
        <div class="hs time"><div class="k">Dauer</div><div class="v">${fmtDur(durationMs())}<small> Std</small></div></div>
        <div class="hs steps"><div class="k">Schritte</div><div class="v">${fmtInt(S.steps)}</div></div>
      </div>
    </div>
    <div class="sum-card mood-chart"><h4><span class="emoji">🙂</span> Stimmung über den Tag</h4>${moodChart()}${quote ? `<div class="quote">„${esc(quote.note)}“ <span>${fmtTime(quote.t)}</span></div>` : ''}</div>
    <div class="sum-grid" style="margin-top:10px">
      <div class="sum-card"><h4><span class="emoji">🕵️</span> Missionen</h4><div class="big-pts">${missionPoints()}<span style="font-size:15px;color:var(--label-2);font-weight:600"> ${missionPoints() === 1 ? 'Punkt' : 'Punkte'}</span></div><div class="tiny muted" style="margin-top:6px">${missionsDone()} von ${receivedCount() || OTHERS.length} erledigt${rank ? ` · <b style="color:var(--label)">Platz ${rank.rank}</b>` : ''}</div></div>
      <div class="sum-card"><h4><span class="emoji">🎲</span> Tipp vs. echt</h4><div class="vs"><div></div><div class="h">Tipp</div><div class="h">Echt</div>
        ${vsRow('km', S.tips.km, km == null ? null : Math.round(km * 10) / 10, '', (v) => fmtKm(v).replace(',0', ''))}
        ${vsRow('<span class="emoji">💦</span>', S.tips.pee, S.counters.pee || 0, '', (v) => v)}</div></div>
    </div>
    <div class="sum-grid map-row" style="margin-top:10px">
      <div class="sum-card"><h4><span class="emoji">🗺️</span> Route</h4><div class="sum-map"><div id="sum-map"></div></div></div>
      <div class="sum-card"><h4><span class="emoji">📋</span> Zähler</h4><div class="counters-list">${C.COUNTERS.map((c) => `<div><span class="emoji">${c.emoji}</span><span class="l">${esc(c.label.replace(/[„“]/g, ''))}</span><b>${S.counters[c.id] || 0}</b></div>`).join('')}</div></div>
    </div>
    <div class="sum-foot">${I('mountain')} ${esc(C.APP_NAME)} · ${esc(C.TAGLINE)}</div>
  </div>`;
  const md = openModal({ full: true, head: false, foot: null, body });
  md.body.style.padding = '0';
  $('.sum-map', md.body).style.backgroundImage = contourMini;
  setTimeout(() => { $$('.ring-bar', md.body).forEach((c) => (c.style.strokeDashoffset = c.dataset.target)); }, 450);
  setTimeout(() => {
    if (!window.L) return;
    const el = $('#sum-map', md.body); const pts = geoPts();
    const sm = L.map(el, { zoomSnap: 0.25, zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false, boxZoom: false, keyboard: false, tap: false });
    sm.attributionControl.setPrefix(false);
    makeTiles().addTo(sm);
    const lay = L.layerGroup().addTo(sm); drawRoute(lay, pts, true);
    sm.invalidateSize();
    if (pts.length) sm.fitBounds(L.latLngBounds(pts.map((p) => [p.lat, p.lng])), { padding: [14, 14], maxZoom: 14, animate: false });
    else sm.setView(C.MAP_CENTER, 11);
  }, 520);
}

/* ---------- Auflösung ---------- */
function resInit() {
  if (!S.resolution) S.resolution = { idx: 0, step: 'intro', data: {} };
  return S.resolution;
}
function resEntry(X, W) {
  const r = resInit();
  r.data[X] = r.data[X] || {};
  if (!r.data[X][W]) {
    let done = null, points = null;
    if (X === ME.id && S.received[W]) { done = !!S.received[W].done; points = S.received[W].points; }
    if (W === ME.id && S.sent[X]) points = S.sent[X].points;
    r.data[X][W] = { done, points, guessed: [] };
  }
  return r.data[X][W];
}
function computeScores() {
  const sc = {}; C.PEOPLE.forEach((p) => (sc[p.id] = { mission: 0, guess: 0 }));
  const data = S.resolution?.data || {};
  Object.entries(data).forEach(([X, ws]) => Object.values(ws).forEach((e) => {
    if (e.done && e.points) sc[X].mission += e.points;
    (e.guessed || []).forEach((g) => sc[g] && (sc[g].guess += 1));
  }));
  return sc;
}
function rankList(sc) {
  const list = C.PEOPLE.map((p) => ({ id: p.id, name: p.name, ...sc[p.id], total: sc[p.id].mission + sc[p.id].guess })).sort((a, b) => b.total - a.total || b.mission - a.mission);
  list.forEach((x, i) => (x.rank = i && x.total === list[i - 1].total && x.mission === list[i - 1].mission ? list[i - 1].rank : i + 1));
  return list;
}
function openResolution() {
  resInit();
  const P = C.PEOPLE;
  const md = openModal({ full: true, title: 'Auflösung' });
  const draw = () => {
    const r = S.resolution;
    const prog = `<div class="progress-dots">${P.map((p, i) => `<i class="${r.step !== 'intro' && r.step !== 'final' && i === r.idx ? 'on' : ''}" style="${r.step === 'final' || i < r.idx ? 'background:var(--green)' : ''}"></i>`).join('')}</div>`;
    let b = '', f = '';
    if (r.step === 'intro') {
      b = `<div class="center" style="padding:10px 4px"><div class="emoji" style="font-size:64px">🕵️</div><h1 class="large-title" style="margin-top:4px">Auflösung</h1><p class="muted">Ein Handy für alle. Nacheinander ist jeder einmal dran.</p></div>
        <div class="group">
          ${row({ emoji: '🤔', title: 'Raten', sub: 'Die anderen tippen laut, was die Missionen waren. Wer eine Mission geschrieben hat, rät bei ihr nicht mit.' })}
          ${row({ emoji: '🔓', title: 'Aufdecken', sub: 'Die Person zeigt ihre Missionen in der eigenen App und sagt, was geschafft ist.' })}
          ${row({ emoji: '✍️', title: 'Eintragen', sub: 'Hier abhaken: geschafft, Punkte der Mission, wer richtig geraten hat.' })}
        </div>
        <div class="section-title">Punkte</div><div class="group">
          ${row({ emoji: '✅', title: 'Mission geschafft', trail: '1–3 Punkte' })}
          ${row({ emoji: '🎯', title: 'Fremde Mission erraten', trail: '+1 Punkt' })}
        </div>`;
      f = `<button class="btn primary" data-act="rNext">Los geht’s mit ${esc(P[0].name)}</button>`;
    } else if (r.step === 'guess') {
      const X = P[r.idx];
      b = `${prog}<div class="center" style="padding:28px 6px 10px"><div class="res-step">Runde ${r.idx + 1} von ${P.length} · Raten</div><div class="res-person">${esc(X.name)}</div>
        <p class="muted" style="font-size:19px;margin:10px 0 0">${esc(X.name)} verrät noch nichts.</p></div>
        <div class="card" style="margin-top:14px"><div style="font-size:19px;font-weight:600;line-height:1.35">${esc(othersNamesOf(X))}: Welche drei Missionen hatte ${esc(X.name)}?</div>
        <p class="muted small" style="margin:10px 0 0">Jeder sagt laut seinen Tipp. Merkt euch, wer was gesagt hat. Wer eine der Missionen geschrieben hat, rät bei ihr nicht mit.</p></div>`;
      f = `<div class="btn-row"><button class="btn gray" data-act="rBack" style="flex:0 0 30%">Zurück</button><button class="btn blue" data-act="rReveal">${I('eye')} ${esc(X.name)}, deck auf!</button></div>`;
    } else if (r.step === 'enter') {
      const X = P[r.idx];
      const ws = P.filter((p) => p.id !== X.id);
      b = `${prog}<div class="center" style="padding:14px 6px 12px"><div class="res-step">Runde ${r.idx + 1} von ${P.length} · Aufdecken</div><div class="res-person" style="font-size:32px">${esc(X.name)}</div>
        <p class="muted small" style="margin:6px 0 0">${esc(X.name)} zeigt die Missionen in der eigenen App (Tab „Missionen“).</p></div>`;
      b += ws.map((W) => {
        const e = resEntry(X.id, W.id);
        const known = X.id === ME.id ? S.received[W.id]?.text : W.id === ME.id ? S.sent[X.id]?.text : null;
        const guessers = ws.filter((g) => g.id !== W.id);
        return `<div class="res-mission"><div class="mission-meta"><span>Mission von ${esc(W.name)}</span></div>
          ${known ? `<div class="mtext">${esc(known)}</div>` : `<div class="tiny muted" style="margin-top:4px">Text steht auf ${esc(gen(X.name))} Handy.</div>`}
          <div class="lbl">Geschafft?</div><div class="chips">
            <button class="chip green" data-act="rDone" data-x="${X.id}" data-w="${W.id}" data-v="1" aria-pressed="${e.done === true}">${I('check')} Ja</button>
            <button class="chip" data-act="rDone" data-x="${X.id}" data-w="${W.id}" data-v="0" aria-pressed="${e.done === false}" style="${e.done === false ? 'background:var(--label-2)' : ''}">Nein</button></div>
          ${e.done ? `<div class="lbl">Punkte der Mission</div><div class="chips">${[1, 2, 3].map((p) => `<button class="chip" data-act="rPts" data-x="${X.id}" data-w="${W.id}" data-v="${p}" aria-pressed="${e.points === p}" style="${e.points === p ? 'background:var(--orange)' : ''}">${ptsWord(p)}</button>`).join('')}</div>` : ''}
          <div class="lbl">Richtig geraten von</div><div class="chips">${guessers.map((g) => `<button class="chip" data-act="rGuess" data-x="${X.id}" data-w="${W.id}" data-g="${g.id}" aria-pressed="${e.guessed.includes(g.id)}">${esc(g.name)}</button>`).join('')}${!guessers.length ? '<span class="muted small">–</span>' : ''}</div>
        </div>`;
      }).join('');
      const ok = ws.every((W) => { const e = resEntry(X.id, W.id); return e.done === false || (e.done === true && e.points); });
      f = `<div class="btn-row"><button class="btn gray" data-act="rBack" style="flex:0 0 30%">Zurück</button><button class="btn primary" data-act="rNext" ${ok ? '' : 'disabled'}>${r.idx < P.length - 1 ? `Weiter zu ${esc(P[r.idx + 1].name)}` : `${I('trophy')} Siegerehrung`}</button></div>`;
      save();
    } else if (r.step === 'final') {
      const list = rankList(computeScores());
      const podium = [list[1], list[0], list[2]].filter(Boolean);
      b = `<div class="center" style="padding:6px 0 0"><div class="res-step">Siegerehrung</div><h1 class="large-title" style="margin-top:2px">Teuto-Champion ${esc(list[0].name)}</h1></div>
        <div class="podium">${podium.map((x) => `<div class="col p${x === list[0] ? 1 : x === list[1] ? 2 : 3}">${x === list[0] ? '<div class="crown emoji">👑</div>' : ''}<div class="name">${esc(x.name)}</div><div class="score">${x.total} Punkte</div><div class="block">${x.rank}</div></div>`).join('')}</div>
        <div class="group">${list.map((x) => row({ emoji: ['🥇', '🥈', '🥉', '🏅'][x.rank - 1] || '🏅', title: `${esc(x.name)}`, sub: `${x.mission} aus Missionen · ${x.guess} fürs Raten`, trail: `<b class="num" style="color:var(--label);font-size:20px">${x.total}</b>` })).join('')}</div>
        <p class="footnote">Screenshot machen und ab in die Gruppe! Training für die ${esc(C.GOAL_LABEL)} läuft. 💪</p>`;
      f = `<div class="btn-row"><button class="btn gray" data-act="rEdit">Bearbeiten</button><button class="btn primary" data-act="close">Fertig</button></div>`;
    }
    md.set(b); md.setFoot(f);
    md.body.scrollTop = 0;
  };
  md.actions = {
    rNext: () => {
      const r = S.resolution;
      if (r.step === 'intro') { r.step = 'guess'; r.idx = 0; }
      else if (r.step === 'enter') { if (r.idx < P.length - 1) { r.idx++; r.step = 'guess'; } else { r.step = 'final'; setTimeout(confetti, 900); haptic([30, 60, 30, 60, 60]); } }
      save(); draw();
    },
    rBack: () => { const r = S.resolution; if (r.step === 'enter') r.step = 'guess'; else if (r.idx > 0) { r.idx--; r.step = 'enter'; } else r.step = 'intro'; save(); draw(); },
    rReveal: () => { S.resolution.step = 'enter'; haptic([18, 40, 18]); save(); draw(); },
    rEdit: () => { S.resolution.step = 'enter'; S.resolution.idx = P.length - 1; save(); draw(); },
    rDone: (el) => { const e = resEntry(el.dataset.x, el.dataset.w); e.done = el.dataset.v === '1'; haptic(); redraw(); },
    rPts: (el) => { resEntry(el.dataset.x, el.dataset.w).points = +el.dataset.v; haptic(); redraw(); },
    rGuess: (el) => { const e = resEntry(el.dataset.x, el.dataset.w); const g = el.dataset.g; e.guessed = e.guessed.includes(g) ? e.guessed.filter((x) => x !== g) : [...e.guessed, g]; haptic(); redraw(); },
  };
  const redraw = () => { const st = md.body.scrollTop; draw(); md.body.scrollTop = st; };
  if (S.resolution.step === 'final') setTimeout(confetti, 700);
  draw();
}
const othersNamesOf = (X) => { const n = C.PEOPLE.filter((p) => p.id !== X.id).map((p) => p.name); return n.slice(0, -1).join(', ') + ' und ' + n[n.length - 1]; };

function confetti() {
  const cv = document.createElement('canvas'); cv.className = 'confetti'; document.body.append(cv);
  const dpr = devicePixelRatio || 1; cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
  const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
  const cols = ['#34c759', '#007aff', '#ffcc00', '#ff9500', '#ff3b30', '#af52de'];
  const ps = Array.from({ length: 140 }, () => ({ x: innerWidth / 2 + (Math.random() - 0.5) * 80, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 11, vy: -Math.random() * 13 - 4, r: Math.random() * 6 + 4, c: cols[(Math.random() * cols.length) | 0], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3 }));
  const t0 = performance.now();
  (function frame(t) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ps.forEach((p) => { p.vy += 0.32; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
    if (t - t0 < 4200) requestAnimationFrame(frame); else cv.remove();
  })(t0);
}

/* ---------- Installation & Standort ---------- */
let deferredPrompt = null;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
function openInstall() {
  if (isStandalone()) { toast('Läuft schon vom Home-Bildschirm'); return; }
  const ios = isIOS();
  const body = ios
    ? `<ol class="steps">
        <li><div>Diesen Link in <b>Safari</b> öffnen (nicht im WhatsApp-Browser: dort unten rechts auf das Kompass-Symbol tippen).</div></li>
        <li><div>Unten auf <span class="kbd">${I('share')} Teilen</span> tippen.</div></li>
        <li><div><span class="kbd">${I('plus')} Zum Home-Bildschirm</span> wählen (ggf. etwas nach unten scrollen).</div></li>
        <li><div>„Hinzufügen“ tippen und Teuto-Tour <b>ab jetzt nur noch über das neue Symbol</b> öffnen.</div></li>
      </ol>`
    : `${deferredPrompt ? `<button class="btn primary" data-act="doInstall" style="margin-bottom:12px">${I('plus')} Jetzt installieren</button>` : ''}
      <ol class="steps">
        <li><div>Diesen Link in <b>Chrome</b> öffnen.</div></li>
        <li><div>Oben rechts auf <span class="kbd">⋮</span> tippen.</div></li>
        <li><div><span class="kbd">App installieren</span> oder <span class="kbd">Zum Startbildschirm hinzufügen</span> wählen.</div></li>
        <li><div>Teuto-Tour ab jetzt über das neue Symbol öffnen.</div></li>
      </ol>`;
  openModal({
    title: 'Zum Home-Bildschirm',
    body: `<div class="center"><img src="icons/icon-192.png" alt="" width="76" height="76" style="border-radius:18px;box-shadow:var(--shadow-sm)"><p class="muted" style="margin:10px 0 6px">So läuft die App auch ohne Empfang im Wald.</p></div>
      <div class="card" style="margin-top:8px">${body}</div>
      <div class="card" style="margin-top:12px;background:color-mix(in srgb,var(--orange) 14%,var(--card))"><b>Wichtig</b><p class="small" style="margin:4px 0 0">Die App auf dem Home-Bildschirm hat einen eigenen Speicher. Trag Tipps und Missionen am besten erst dort ein und öffne sie vor Samstag einmal mit Internet, damit die Karte gespeichert wird.</p></div>`,
    actions: { doInstall: async (el, e, md) => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; md.close(); } },
  });
}
function askLocation() {
  if (!navigator.geolocation) { toast('Standort wird nicht unterstützt', 'xmark'); return; }
  toast('Standort wird angefragt …', 'location');
  navigator.geolocation.getCurrentPosition(() => { S.setup.loc = true; save(); render(); toast('Standort erlaubt'); }, () => {
    openModal({ title: 'Standort erlauben', body: `<p class="muted center">Der Standort wird nur beim Check-in einmal abgefragt, kein Dauer-GPS.</p>
      <div class="card"><ol class="steps">${isIOS()
        ? '<li><div><b>Einstellungen</b> öffnen → <b>Datenschutz & Sicherheit</b> → <b>Ortungsdienste</b>.</div></li><li><div><b>Safari-Websites</b> → „Beim Verwenden der App“.</div></li><li><div>Zurück in die App und erneut tippen.</div></li>'
        : '<li><div>In Chrome auf das Schloss/Einstellungs-Symbol neben der Adresse tippen.</div></li><li><div><b>Berechtigungen</b> → <b>Standort</b> → Zulassen.</div></li>'}</ol></div>` });
  }, { enableHighAccuracy: false, timeout: 20000, maximumAge: 600000 });
}

/* ---------- Event-Delegation ---------- */
const ACTIONS = {
  tab: (el) => setTab(el.dataset.tab),
  start: doStart,
  end: doEnd,
  checkin: () => openCheckin({ first: !S.checkins.length }),
  summary: openSummary,
  resolution: openResolution,
  install: openInstall,
  askLoc: () => (S.setup.loc ? toast('Standort ist schon erlaubt') : askLocation()),
  write: (el) => openWriter(el.dataset.to),
  receive: openReceive,
  drawRandom: (el) => drawRandom(el.dataset.from),
  fit: () => { fitMap(); haptic(); },
  toggleDone: (el) => {
    const m = S.received[el.dataset.from]; if (!m) return;
    m.done = !m.done; save(); haptic(m.done ? [15, 30, 15] : 8);
    el.classList.toggle('done', m.done); el.innerHTML = `${I(m.done ? 'checkCircle' : 'circle')} ${m.done ? 'Erledigt' : 'Als erledigt markieren'}`;
    if (m.done) toast(`+${ptsWord(m.points)} 🤫`, 'sparkles');
  },
  cnt: (el) => {
    const id = el.dataset.id, v = Math.max(0, (S.counters[id] || 0) + Number(el.dataset.d));
    S.counters[id] = v; save(); haptic(6);
    $$(`[data-out="cnt-${id}"]`).forEach((o) => { o.textContent = v; o.classList.remove('bump'); void o.offsetWidth; o.classList.add('bump'); });
  },
  tip: (el) => {
    if (phase() !== 'before') return;
    const id = el.dataset.id, d = Number(el.dataset.d), def = id === 'km' ? 15 : 3;
    const cur = S.tips[id];
    S.tips[id] = Math.max(0, cur == null ? def : cur + d); save(); haptic(6);
    $$(`[data-out="tip-${id}"]`).forEach((o) => { o.textContent = S.tips[id]; o.classList.remove('bump'); void o.offsetWidth; o.classList.add('bump'); });
  },
};
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
  const act = el.dataset.act;
  const md = el.closest('.modal')?.__api;
  if (act === 'close') { (md || modals[modals.length - 1])?.close(); return; }
  const fn = (md && md.actions[act]) || ACTIONS[act];
  if (fn) fn(el, e, md);
});
document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-input]'); if (!el) return;
  const k = el.dataset.input, md = el.closest('.modal')?.__api;
  if (md && typeof md[k] === 'function') { md[k](el.value); return; }
  if (k === 'steps') { const n = parseInt(String(el.value).replace(/\D/g, ''), 10); S.steps = Number.isFinite(n) ? n : null; save(); }
  if (k === 'kmOverride') { S.kmOverride = el.value.trim() ? parseNum(el.value) : null; save(); }
});
document.addEventListener('change', (e) => {
  const el = e.target.closest('[data-input="steps"]');
  if (el && S.steps != null) el.value = fmtInt(S.steps);
});

/* ---------- Tick ---------- */
let lastKey = '';
function tick() {
  $$('[data-tick="countdown"]').forEach((el) => (el.innerHTML = countdownHTML()));
  $$('[data-tick="dur"]').forEach((el) => (el.innerHTML = `${fmtDur(durationMs())}<small>h</small>`));
  $$('[data-tick="durlong"]').forEach((el) => (el.textContent = fmtDur(durationMs(), true)));
  $$('[data-tick="next"]').forEach((el) => (el.textContent = nextCheckinText()));
  const key = [phase(), canStart(), checkinDue(), now() >= COUNTDOWN_TS].join();
  if (key !== lastKey) {
    const wasDue = lastKey && lastKey.split(',')[2] === 'true';
    lastKey = key; render(); mountTabIcons();
    if (checkinDue() && !wasDue && lastKey) haptic([20, 60, 20]);
  }
  updateTestBar();
}

/* ---------- Testmodus ---------- */
let testBar;
function initTestBar() {
  if (!TEST) return;
  testBar = document.createElement('div'); testBar.className = 'testbar min';
  const at = (s) => new Date(C.HIKE_DAY + 'T' + s).getTime();
  const btns = [['−1 T', () => shift(-864e5)], ['−1 h', () => shift(-36e5)], ['+15 m', () => shift(9e5)], ['+1 h', () => shift(36e5)], ['+1 T', () => shift(864e5)],
    ['Fr 20:00', () => setSim(at('20:00:00') - 864e5)], ['Sa 08:55', () => setSim(at('08:55:00'))], ['Sa 16:30', () => setSim(at('16:30:00'))], ['Echtzeit', () => setSim(Date.now())],
    ['Daten löschen', () => { if (confirm('Alle Daten dieser Person löschen?')) { ls.del(KEY); location.reload(); } }], ['🧪', () => testBar.classList.toggle('min')]];
  testBar.innerHTML = btns.map(([l], i) => `<button data-i="${i}" class="${i === btns.length - 1 ? 'tb-toggle' : ''}">${l}</button>`).join('') + ` <b data-sim></b><span class="tb-label">Zeit-Simulator</span>`;
  testBar.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) btns[+b.dataset.i][1](); });
  document.body.append(testBar);
  function shift(ms) { setSim(now() + ms); }
  function setSim(ts) { offset = ts - Date.now(); ls.set('tt:offset', offset); tick(); render(); }
}
function updateTestBar() {
  if (!testBar) return;
  const el = $('[data-sim]', testBar);
  if (el) el.textContent = new Date(now()).toLocaleString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/* ---------- Service Worker & Offline-Kacheln ---------- */
const TILE_V = 1;
function tileUrls() {
  const [[s, w], [n, e]] = C.PREFETCH_BOUNDS;
  const r = devicePixelRatio > 1 ? '@2x' : '';
  const lx = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z);
  const ly = (lat, z) => { const a = (lat * Math.PI) / 180; return Math.floor(((1 - Math.log(Math.tan(a) + 1 / Math.cos(a)) / Math.PI) / 2) * 2 ** z); };
  const out = [];
  for (const style of ['light_all', 'dark_all']) for (const z of C.PREFETCH_ZOOMS) {
    for (let x = lx(w, z); x <= lx(e, z); x++) for (let y = ly(n, z); y <= ly(s, z); y++) out.push(`https://${'abcd'[Math.abs(x + y) % 4]}.basemaps.cartocdn.com/${style}/${z}/${x}/${y}${r}.png`);
  }
  return out;
}
function startPrefetch() {
  if (!('serviceWorker' in navigator) || !navigator.onLine) return;
  const st = ls.get('tt:tiles', null);
  if (st && st.done && st.v === TILE_V) return;
  navigator.serviceWorker.ready.then((reg) => reg.active && reg.active.postMessage({ type: 'prefetch', urls: tileUrls() }));
}
function initSW() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW', e));
  navigator.serviceWorker.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === 'prefetch-progress') {
      const pct = Math.round((d.done / d.total) * 100);
      const finished = d.done >= d.total;
      ls.set('tt:tiles', { v: TILE_V, pct, done: finished && d.failed / d.total < 0.1 });
      if (finished || pct % 10 === 0) { if (tab === 'home' && !modals.length && phase() === 'before') render(); }
    }
  });
  setTimeout(startPrefetch, 1500);
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}

/* ---------- Start ---------- */
const contourMini = svgUrl(contourSVG({ w: 400, h: 200, cell: 8, levels: 14, seed: 5, color: 'rgba(60,150,90,.22)', strong: 'rgba(60,150,90,.32)' }));
function boot() {
  $('#contours').innerHTML = contourSVG({ seed: 11 });
  document.documentElement.style.setProperty('--hero-contours', svgUrl(contourSVG({ w: 500, h: 300, cell: 7, levels: 14, seed: 3, color: '#fff', strong: '#fff', sw: 1.1 })));
  if (!ME) {
    $('#app').innerHTML = `<div class="lock-screen"><div class="card fade-in"><div class="emoji" style="font-size:56px">🔒</div><h2 style="margin:8px 0 6px">Kein gültiger Link</h2><p class="muted" style="margin:0">Bitte öffne die App über deinen persönlichen Link aus WhatsApp.</p></div></div>`;
    return;
  }
  initMap();
  mountShell();
  initSheetDrag();
  initTestBar();
  setDetent('medium');
  if (checkinDue()) tab = 'home';
  tick();
  render();
  updateMap(true);
  initSW();
  // Beim Zurückkehren in die App: Zeit/Fälligkeit neu prüfen
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  setInterval(tick, 1000);
  window.__tt = { S, now, render, ME };
}
boot();
})();

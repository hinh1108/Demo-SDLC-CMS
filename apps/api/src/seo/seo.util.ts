// Tính điểm SEO đơn giản (heuristic 0–100).
export function computeSeoScore(m: {
  title?: string | null; description?: string | null; keywords?: string | null; schema_json?: any;
}): number {
  let s = 0;
  if (m.title) { s += 30; if (m.title.length >= 30 && m.title.length <= 60) s += 10; }
  if (m.description) { s += 25; if (m.description.length >= 50 && m.description.length <= 160) s += 10; }
  if (m.keywords) s += 15;
  if (m.schema_json && typeof m.schema_json === 'object' && Object.keys(m.schema_json).length) s += 10;
  return Math.min(100, s);
}

// Escape cho XML (sitemap) — chống XML injection/XSS ở output.
export function xmlEscape(s: unknown): string {
  return String(s ?? '').replace(/[<>&'"]/g, (ch) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[ch] as string));
}

// Typed API client cho VietCMS — dùng trong Next.js admin app.
// Đính Authorization: Bearer, parse lỗi RFC 7807.

export interface Problem {
  type: string; title: string; status: number; detail?: string;
  errors?: Array<{ field: string; message: string }>;
}
export class ApiError extends Error {
  constructor(public problem: Problem) { super(problem.detail || problem.title); }
}

export interface TokenPair { access_token: string; token_type: string; expires_in: number }
export interface Content {
  id: string; kind: 'page' | 'post'; title: string; slug: string;
  status: string; seo_score: number | null; updated_at: string;
}
export interface Page<T> { data: T[]; pagination: { next_cursor: string | null; has_more: boolean } }
export interface Block { type: string; props?: Record<string, unknown>; children?: Block[] }
export interface Version { id: string; content_id?: string; blocks?: Block[]; created_at: string }
export interface ContentDetail extends Content { current_version: Version | null }

const BASE = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
  || 'http://localhost:3001/v1';

async function request<T>(path: string, opts: RequestInit = {}, token?: string): Promise<T> {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    let problem: Problem;
    try { problem = await res.json(); }
    catch { problem = { type: 'about:blank', title: res.statusText, status: res.status }; }
    throw new ApiError(problem);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  login(email: string, password: string) {
    // Client-side guard (KHÔNG phải hàng rào duy nhất — server luôn validate lại)
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new ApiError({ type: 'about:blank', title: 'Invalid email', status: 400, detail: 'Email không hợp lệ.' });
    }
    return request<TokenPair>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    });
  },
  listContents(siteId: string, token: string, params: { status?: string; limit?: number; cursor?: string } = {}) {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.cursor) qs.set('cursor', params.cursor);
    const q = qs.toString();
    return request<Page<Content>>(`/sites/${siteId}/contents${q ? '?' + q : ''}`, {}, token);
  },
  // US-01 — editor
  createContent(siteId: string, token: string, body: { kind: 'page' | 'post'; title: string; slug?: string }) {
    return request<Content>(`/sites/${siteId}/contents`, { method: 'POST', body: JSON.stringify(body) }, token);
  },
  getContent(contentId: string, token: string) {
    return request<ContentDetail>(`/contents/${contentId}`, {}, token);
  },
  updateContent(contentId: string, token: string, body: { title?: string; slug?: string }) {
    return request<Content>(`/contents/${contentId}`, { method: 'PATCH', body: JSON.stringify(body) }, token);
  },
  saveVersion(contentId: string, token: string, blocks: Block[]) {
    return request<Version>(`/contents/${contentId}/versions`, { method: 'POST', body: JSON.stringify({ blocks }) }, token);
  },
  listVersions(contentId: string, token: string) {
    return request<Page<Version>>(`/contents/${contentId}/versions`, {}, token);
  },
  // US-14 — publishing
  publish(contentId: string, token: string, scheduled_at?: string) {
    return request<{ status: string; public_url: string; used_temp_subdomain: boolean; scheduled_at?: string }>(
      `/contents/${contentId}/publication`,
      { method: 'POST', body: JSON.stringify(scheduled_at ? { scheduled_at } : {}) }, token);
  },
  unpublish(contentId: string, token: string) {
    return request<void>(`/contents/${contentId}/publication`, { method: 'DELETE' }, token);
  },
  getSitemap(siteId: string, token: string) {
    return request<{ site_id: string; urls: Array<{ slug: string; public_url: string; published_at: string }> }>(
      `/sites/${siteId}/sitemap`, {}, token);
  },
  // US-09 — SEO
  getSeo(contentId: string, token: string) {
    return request<{ title: string | null; description: string | null; keywords: string | null; schema_json: unknown; score: number | null }>(
      `/contents/${contentId}/seo`, {}, token);
  },
  putSeo(contentId: string, token: string, body: { title?: string; description?: string; keywords?: string; schema_json?: Record<string, unknown> }) {
    return request(`/contents/${contentId}/seo`, { method: 'PUT', body: JSON.stringify(body) }, token);
  },
  // sitemap.xml công khai (không cần token) — trả text XML
  async getSitemapXml(siteId: string): Promise<string> {
    const base = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:3001/v1';
    const res = await fetch(`${base}/sites/${siteId}/sitemap.xml`);
    return res.text();
  },
};

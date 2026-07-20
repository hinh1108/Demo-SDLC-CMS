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
};

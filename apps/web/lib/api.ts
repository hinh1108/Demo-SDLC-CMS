'use client';

// Client gọi same-origin /api/proxy/* — cookie tự gửi kèm, token đính ở server.
export async function apiFetch<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch('/api/proxy/' + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  if (res.status === 204) return undefined as T;
  const txt = await res.text();
  let data: any = null;
  try { data = txt ? JSON.parse(txt) : null; } catch { data = txt; }
  if (!res.ok) throw new Error((data && data.detail) || (data && data.title) || `Lỗi ${res.status}`);
  return data as T;
}

export function getRole(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;\s*)role=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

export const STATUS_LABEL: Record<string, string> = {
  draft: 'Bản nháp', review: 'Chờ duyệt', approved: 'Đã duyệt',
  scheduled: 'Đã lên lịch', published: 'Đã xuất bản', archived: 'Lưu trữ',
};

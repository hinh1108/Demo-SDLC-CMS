// React hook — nạp danh sách content (dùng trong màn Dashboard/Content của admin app).
import { useEffect, useState } from 'react';
import { api, Content, ApiError } from './api-client';

export function useContents(siteId: string, token: string | null, status?: string) {
  const [data, setData] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    setLoading(true);
    setError(null);
    api.listContents(siteId, token, { status })
      .then((res) => { if (alive) setData(res.data); })
      .catch((e: ApiError) => { if (alive) setError(e.problem.detail || e.problem.title); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [siteId, token, status]);

  return { data, loading, error };
}

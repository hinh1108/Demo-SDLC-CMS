// React hook — autosave editor (debounce) + offline queue (US-01 AC-3).
import { useCallback, useEffect, useRef, useState } from 'react';
import { api, Block, ApiError } from './api-client';

type SaveState = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

export function useContentDraft(contentId: string, token: string) {
  const [state, setState] = useState<SaveState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<Block[] | null>(null); // offline queue

  const flush = useCallback(async () => {
    if (!pending.current) return;
    const blocks = pending.current;
    setState('saving');
    try {
      await api.saveVersion(contentId, token, blocks);
      pending.current = null;
      setState('saved');
    } catch (e) {
      // Mất mạng → giữ bản nháp, thử lại khi online (không mất dữ liệu)
      setState(e instanceof ApiError ? 'error' : 'offline');
    }
  }, [contentId, token]);

  // Debounced autosave khi nội dung đổi
  const onChange = useCallback((blocks: Block[]) => {
    pending.current = blocks;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 800);
  }, [flush]);

  // Sync lại khi mạng trở lại
  useEffect(() => {
    const onOnline = () => { if (pending.current) flush(); };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [flush]);

  return { state, onChange };
}

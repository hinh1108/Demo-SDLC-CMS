import { problem } from '../common/problem';

// Allow-list loại block (khớp palette editor). Không cho type lạ.
const ALLOWED_TYPES = new Set([
  'heading', 'paragraph', 'image', 'button', 'list', 'quote', 'form', 'video', 'ai',
]);
const MAX_BLOCKS = 500;
const MAX_DEPTH = 6;
const MAX_BYTES = 512 * 1024; // 512KB

/** Validate mô hình block (server-side) — chống payload rác/quá lớn/lồng sâu. */
export function validateBlocks(blocks: unknown): void {
  if (!Array.isArray(blocks)) {
    throw problem(422, 'validation-error', 'Validation Error', 'blocks phải là một mảng.');
  }
  const bytes = Buffer.byteLength(JSON.stringify(blocks), 'utf8');
  if (bytes > MAX_BYTES) {
    throw problem(422, 'validation-error', 'Validation Error', 'Nội dung quá lớn (giới hạn 512KB).');
  }
  let count = 0;
  const walk = (arr: any[], depth: number) => {
    if (depth > MAX_DEPTH) {
      throw problem(422, 'validation-error', 'Validation Error', 'Block lồng quá sâu.');
    }
    for (const b of arr) {
      if (!b || typeof b !== 'object' || Array.isArray(b) || typeof b.type !== 'string' || !ALLOWED_TYPES.has(b.type)) {
        throw problem(422, 'validation-error', 'Validation Error', `Loại block không hợp lệ: ${b?.type}`);
      }
      if (b.props !== undefined && (typeof b.props !== 'object' || b.props === null || Array.isArray(b.props))) {
        throw problem(422, 'validation-error', 'Validation Error', 'props của block phải là object.');
      }
      if (++count > MAX_BLOCKS) {
        throw problem(422, 'validation-error', 'Validation Error', `Quá nhiều block (giới hạn ${MAX_BLOCKS}).`);
      }
      if (b.children !== undefined) {
        if (!Array.isArray(b.children)) {
          throw problem(422, 'validation-error', 'Validation Error', 'children phải là một mảng.');
        }
        walk(b.children, depth + 1);
      }
    }
  };
  walk(blocks, 1);
}

/** Slugify hỗ trợ tiếng Việt (bỏ dấu). Không dùng để nối chuỗi SQL. */
export function slugify(input: string): string {
  const s = input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // bỏ dấu tổ hợp (Unicode)
    .replace(/[Đđ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
  return s || 'trang';
}

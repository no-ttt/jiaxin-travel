export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

/** Taxonomy list endpoints wrap their rows in `{ items }`. */
export type ItemsResponse<T> = {
  items: T[];
};

/** For list endpoints whose response schema is undocumented: accepts a bare array or `{ items }`. */
export function toItems<T>(res: T[] | ItemsResponse<T> | null | undefined): T[] {
  if (Array.isArray(res)) return res;
  return res?.items ?? [];
}

export type ValidationErrorDetail = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

export type HTTPValidationError = {
  detail: ValidationErrorDetail[];
};

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

export type ValidationErrorDetail = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

export type HTTPValidationError = {
  detail: ValidationErrorDetail[];
};

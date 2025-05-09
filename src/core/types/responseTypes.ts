export interface PaginatedResponseType<T> {
  [x: string]: any;
  pagination: PaginationType;
  results: T[];
}

export interface PaginationType {
  next: string | null;
  previous: string | null;
  count: number;
  total_page: number;
  current_page: number;
}

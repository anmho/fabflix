export interface PaginatedResult<T> {
  page: number;
  limit: number;
  results: T[];
  _links: {
    prev: string;
    self: string;
    next: string;
  };
}

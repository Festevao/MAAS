import { Result } from './movies-response.dto';

export class Pagination {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  lastPage: boolean;
  firstPage: boolean;
}

export class PaginationType<T> {
  data: T[];
  pagination: Pagination;
}

export class PaginationTypeResult {
  data: Result[];
  pagination: Pagination;
}

export class DataMovieWatch {
  userId: string;
  externalId: number;
}

export class PaginationTypeMovieWatch {
  data: DataMovieWatch[];
  pagination: Pagination;
}
/** Every response of the Sociality API is wrapped in this envelope. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/** One item of the `data` array returned by a 400 "Validation failed". */
export interface ApiFieldError {
  type: string;
  value?: unknown;
  msg: string;
  path: string;
  location: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PageParams {
  page?: number;
  limit?: number;
}

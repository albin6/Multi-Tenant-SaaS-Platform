/**
 * Base interface for all entities
 * Includes common fields like timestamps
 */
export interface BaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Base repository interface
 * Defines common CRUD operations
 */
export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findOne(filter: Partial<T>): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

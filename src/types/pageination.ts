interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
}

export interface PaginationResponse<T> {
    data: T[],
    meta: PaginationMeta
}
export interface LaravelPaginateResponse {
    data?: any  // Puede ser un objeto o un array
    current_page?: number
    from?: number
    to?: number
    page?: number
    per_page?: number
    last_page?: number
    total?: number
    path?: string
}
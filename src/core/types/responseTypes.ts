export interface PaginatedResponseType<T> {
    map(
        arg0: (amenities: any) => import('./selectorTypes').SelectorDataType
    ):
        | {
            value: string;
            label: string;
            extra?: string | undefined;
            __isNew__?: boolean | undefined;
        }[]
        | undefined;
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

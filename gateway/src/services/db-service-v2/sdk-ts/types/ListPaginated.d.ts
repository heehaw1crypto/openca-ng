export declare type ListPaginated<T> = {
    paginationInfo: {
        hasPreviousPage: boolean;
        hasNextPage: boolean;
        startCursor: string | number;
        endCursor: string | number;
        totalCount: number;
    };
    results: Array<T>;
};

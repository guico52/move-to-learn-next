export interface ApiResponse<T> {
    readonly code: number;
    readonly success: boolean;
    readonly message: string;
    readonly data?: T | undefined;
}

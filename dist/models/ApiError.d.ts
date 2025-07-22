declare class ApiError extends Error {
    status: number;
    constructor(status: number, message: string);
    static badRequest(): ApiError;
    static notEnoughFunds(): ApiError;
    static notFound(): ApiError;
    static internal(): ApiError;
}
export default ApiError;

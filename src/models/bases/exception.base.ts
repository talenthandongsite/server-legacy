export class BaseException extends Error {
    statusCode: number;
    payload: {
        status: boolean;
        description: string;
        error: any;
    }
}
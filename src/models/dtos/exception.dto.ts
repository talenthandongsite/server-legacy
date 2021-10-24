import { BaseException } from "../bases";
import { HTTP_STATUS_CODE } from "../enums/http-status-code.enum";

export class BadRequestException extends BaseException {
    statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
    payload = { status: null, error: null, description: null };

    constructor(error?: any, description?: string) {
        super();
        
        this.payload.status = false;
        this.payload.error = error || null;
        this.payload.description = description || 'Provided information is invalid';
    }
}

export class UnauthorizedException extends BaseException {
    statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
    payload = { status: null, error: null, description: null };

    constructor(error?: any, description?: string) {
        super();
        
        this.payload.status = false;
        this.payload.error = error || null;
        this.payload.description = description || 'Please provide credentials';
    }
}

export class ForbiddenException extends BaseException {
    statusCode = HTTP_STATUS_CODE.FORBIDDEN;
    payload = { status: null, error: null, description: null };

    constructor(error?: any, description?: string) {
        super();

        this.payload.status = false;
        this.payload.error = error || null;
        this.payload.description = description || 'This endpoint is now allowed to your credentials';
    }
}

export class NotFoundException extends BaseException {
    statusCode = HTTP_STATUS_CODE.NOT_FOUND;
    payload = { status: null, error: null, description: null };

    constructor(error?: any, description?: string) {
        super();

        this.payload.status = false;
        this.payload.error = error || null;
        this.payload.description = description || 'Cannot find data matching provided information';
    }
}

export class InternalServerError extends BaseException {
    statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
    payload = { status: null, error: null, description: null };

    constructor(error?: any, description?: string) {
        super()

        this.payload.status = false;
        this.payload.error = error || null;
        this.payload.description = description || 'Internal Server Error';
    }
}
export class Response<T> {
    isSuccess: boolean;
    data?: T;

    constructor(isSuccess: boolean, data?: T) {
        this.isSuccess = isSuccess;
        this.data = data;
    }
}

export class SuccessResponse<T> extends Response<T> {
    constructor(data?: T) {
        super(true, data);
    }
}

export class ErrorResponse<T> extends Response<T> {
    constructor(error: T) {
        super(false, error);
    }
}

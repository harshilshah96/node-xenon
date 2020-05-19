'use strict';

export class XenonError extends Error {
    response;
    httpStatus;
    constructor(message, httpStatus?, response?) {
        super(message + ' ' + JSON.stringify(response));
        this.name = this.constructor.name;
        this.response = response;
        this.httpStatus = httpStatus;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default { XenonError };

'use strict';
import { XenonError } from './xenon-error';

export class ForbiddenError extends XenonError {
    constructor(message, httpStatus?, response?) {
        super(message, httpStatus, response);
        Error.captureStackTrace(this, this.constructor);
    }
}

export default { ForbiddenError };

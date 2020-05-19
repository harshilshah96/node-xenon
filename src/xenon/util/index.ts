'use strict';

import Uritemplates from 'uri-templates';
import Request from 'request';
import Retry from 'retry';

function retryOnStatus(res) {
    if (res && (res.statusCode === 429 || (res.statusCode >= 500 && res.statusCode < 600))) {
        return new Error(`${res.statusCode} - ${res.statusMessage}`);
    }
}

// ref: https://github.com/FGRibreau/node-request-retry/blob/master/strategies/NetworkError.js#L3:22
const RETRIABLE_ERRORS = [
    'ECONNRESET',
    'ENOTFOUND',
    'ESOCKETTIMEDOUT',
    'ETIMEDOUT',
    'ECONNREFUSED',
    'EHOSTUNREACH',
    'EPIPE',
    'EAI_AGAIN',
];

function retryOnNetworkError(err) {
    if (err && RETRIABLE_ERRORS.indexOf(err.code) > -1) {
        return err;
    }
    return null;
}

export function expandPath(path, data) {
    const template = Uritemplates(path);
    if (Array.isArray(data)) {
        return template.fill(function () {
            return data.shift();
        });
    }

    return template.fill(data);
}

export function retryRequest(retries, options, cb) {
    if (retries === undefined) {
        retries = 20; // default is around 15min
    }

    const operation = Retry.operation({
        retries,
        randomize: true,
        minTimeout: 500,
        maxTimeout: 60 * 1000,
    });
    operation.attempt(function (currentAttempt) {
        Request(options, (err, res, body) => {
            if (operation.retry(retryOnStatus(res) || retryOnNetworkError(err))) {
                return;
            }
            cb(err, res, body);
        });
    });
}

export default { retryRequest };

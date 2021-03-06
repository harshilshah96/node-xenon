'use strict';

import errors from './errors';

import { expandPath, retryRequest } from './util';
import { Config } from './config';
// HTTP verb mapping
const mappings = {
    all: 'GET',
    create: 'POST',
    destroy: 'DELETE',
    cancel: 'PATCH',
    merge: 'PATCH',
    retrieve: 'GET',
    patch: 'PATCH',
    update: 'PUT',
    modify: 'PATCH',
    add: 'POST',
    remove: 'DELETE',
};

/* API Resource Class */
class Resource {
    /**
     * Callback
     * @callback requestCallback
     * @param {Object} error
     * @param {Object} body
     */
    /**
     * Makes a HTTP request and returns a promise
     * @param {Object} config  - Instance of Xenon class
     * @param {string} method  - HTTP verb
     * @param {string} uri - Request URI
     * @param {Object} [data] - POST Data or GET Query Object
     * @param {requestCallback} [callback] - callback that handles the response
     * @returns {Object} - Promise
     */
    static request(config, method, uri, data, callback) {
        const promise = new Promise((resolve, reject) => {
            if (!(config instanceof Config)) {
                const error = new errors.ConfigurationError('First argument should be instance of Xenon class');
                return reject(error);
            }

            const qs = method === 'GET' ? data : {};
            const body = method === 'GET' ? {} : data;

            const options = {
                qs,
                uri,
                body,
                method,
                auth: {
                    user: config.getAccountToken(),
                    pass: config.getSecretKey(),
                    sendImmediately: true,
                },
                baseUrl: config.API_BASE,
                headers: {
                    'User-Agent': 'xenon-node/' + config.VERSION,
                },
                json: true,
            };

            retryRequest(config.retries, options, (error, response, body) => {
                if (error) {
                    return reject(error);
                }

                let err = null;
                switch (response.statusCode) {
                    case 400:
                        err = new errors.SchemaInvalidError(
                            "JSON schema validation hasn't passed.",
                            response.statusCode,
                            body,
                        );
                        break;
                    case 401:
                    case 403:
                        err = new errors.ForbiddenError(
                            'The requested action is forbidden.',
                            response.statusCode,
                            body,
                        );
                        break;
                    case 404:
                        err = new errors.NotFoundError(
                            `The requested ${this.name} could not be found.`,
                            response.statusCode,
                            body,
                        );
                        break;
                    case 422:
                        err = new errors.ResourceInvalidError(
                            `The ${this.name}  could not be created or updated.`,
                            response.statusCode,
                            body,
                        );
                        break;
                    case 200:
                    case 201:
                    case 202:
                    case 204:
                        break;
                    default:
                        err = new errors.XenonError(
                            `${this.name} request error has occurred.`,
                            response.statusCode,
                            body,
                        );
                        break;
                }
                if (err) {
                    return reject(err);
                }
                resolve(body);
            });
        });

        if (callback && typeof callback === 'function') {
            promise.then(callback.bind(null, null), callback);
            return;
        }

        return promise;
    }

    static _method(verb, pathOverride?) {
        return function (config, ...args) {
            // node v4.x doesn't support rest param
            let cb, data;
            if (typeof args[args.length - 1] === 'function') {
                cb = args.pop();
            }
            if (typeof args[args.length - 1] === 'object') {
                data = args.pop();
            }
            const path = expandPath(pathOverride || this.path, args);

            return this.request(config, verb, path, data, cb);
        };
    }
}

// Define actions
Object.keys(mappings).forEach((methodName) => {
    Resource[methodName] = Resource._method(mappings[methodName]);
});

export default Resource;

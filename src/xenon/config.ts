'use strict';

const VERSION = require('../../package.json').version;
const API_BASE = 'http://localhost:4001/api';

export class Config {
    private accountToken;
    private secretKey;
    private apiBase;
    private _retries;
    constructor(accountToken, secretKey, _retries?, apiBase?) {
        this.accountToken = accountToken;
        this.secretKey = secretKey;
        this.apiBase = apiBase || API_BASE;
        this._retries = _retries;
    }
    getAccountToken() {
        return this.accountToken;
    }
    getSecretKey() {
        return this.secretKey;
    }

    get retries() {
        return this._retries;
    }

    get VERSION() {
        return VERSION;
    }

    get API_BASE() {
        return this.apiBase;
    }
}

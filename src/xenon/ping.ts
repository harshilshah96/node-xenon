'use strict';

import Resource from './resource';
export class Ping extends Resource {
    static ping = Resource._method('GET');
    static get path() {
        return '/v1/ping';
    }
}
export default { Ping };

const person: Person = { firstName: 'Bill', lastName: 'Gates' };
console.log(person);

import { Config } from './xenon/config';
import * as errors from './xenon/errors';
import { Ping } from './xenon/ping';

const Xenon = {
    Config,
    Ping,
};
Object.assign(Xenon, errors);

// Ping.ping(new Config('asfaf', 'asfas'))
//     .then((res) => console.log(res))
//     .catch((err) => console.error(err));

module.exports = Xenon;

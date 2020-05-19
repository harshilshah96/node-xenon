'use strict';

import { XenonError } from './xenon-error';
import { ConfigurationError } from './configuration-error';
import { ForbiddenError } from './forbidden-error';
import { NotFoundError } from './not-found-error';
import { ResourceInvalidError } from './resource-invalid-error';
import { SchemaInvalidError } from './schema-invalid-error';

export default {
    XenonError,
    ConfigurationError,
    ForbiddenError,
    NotFoundError,
    ResourceInvalidError,
    SchemaInvalidError,
};

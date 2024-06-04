/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var msalCommon = require('@azure/msal-common');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class ManagedIdentityRequestParameters {
    constructor(httpMethod, endpoint) {
        this.httpMethod = httpMethod;
        this._baseEndpoint = endpoint;
        this.headers = {};
        this.bodyParameters = {};
        this.queryParameters = {};
    }
    computeUri() {
        const parameterBuilder = new msalCommon.RequestParameterBuilder();
        if (this.queryParameters) {
            parameterBuilder.addExtraQueryParameters(this.queryParameters);
        }
        const queryParametersString = parameterBuilder.createQueryString();
        return msalCommon.UrlString.appendQueryString(this._baseEndpoint, queryParametersString);
    }
    computeParametersBodyString() {
        const parameterBuilder = new msalCommon.RequestParameterBuilder();
        if (this.bodyParameters) {
            parameterBuilder.addExtraQueryParameters(this.bodyParameters);
        }
        return parameterBuilder.createQueryString();
    }
}

exports.ManagedIdentityRequestParameters = ManagedIdentityRequestParameters;
//# sourceMappingURL=ManagedIdentityRequestParameters.cjs.map

/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var msalCommon = require('@azure/msal-common');
var Constants = require('../utils/Constants.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class HttpClientWithRetries {
    constructor(httpClientNoRetries, retryPolicy) {
        this.httpClientNoRetries = httpClientNoRetries;
        this.retryPolicy = retryPolicy;
    }
    async sendNetworkRequestAsyncHelper(httpMethod, url, options) {
        if (httpMethod === Constants.HttpMethod.GET) {
            return this.httpClientNoRetries.sendGetRequestAsync(url, options);
        }
        else {
            return this.httpClientNoRetries.sendPostRequestAsync(url, options);
        }
    }
    async sendNetworkRequestAsync(httpMethod, url, options) {
        // the underlying network module (custom or HttpClient) will make the call
        let response = await this.sendNetworkRequestAsyncHelper(httpMethod, url, options);
        let currentRetry = 0;
        while (await this.retryPolicy.pauseForRetry(response.status, currentRetry, response.headers[msalCommon.HeaderNames.RETRY_AFTER])) {
            response = await this.sendNetworkRequestAsyncHelper(httpMethod, url, options);
            currentRetry++;
        }
        return response;
    }
    async sendGetRequestAsync(url, options) {
        return this.sendNetworkRequestAsync(Constants.HttpMethod.GET, url, options);
    }
    async sendPostRequestAsync(url, options) {
        return this.sendNetworkRequestAsync(Constants.HttpMethod.POST, url, options);
    }
}

exports.HttpClientWithRetries = HttpClientWithRetries;
//# sourceMappingURL=HttpClientWithRetries.cjs.map

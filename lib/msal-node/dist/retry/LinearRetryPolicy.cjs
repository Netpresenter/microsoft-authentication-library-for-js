/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class LinearRetryPolicy {
    constructor(maxRetries, retryDelay, httpStatusCodesToRetryOn) {
        this.maxRetries = maxRetries;
        this.retryDelay = retryDelay;
        this.httpStatusCodesToRetryOn = httpStatusCodesToRetryOn;
    }
    retryAfterMillisecondsToSleep(retryHeader) {
        if (!retryHeader) {
            return 0;
        }
        // retry-after header is in seconds
        let millisToSleep = Math.round(parseFloat(retryHeader) * 1000);
        /*
         * retry-after header is in HTTP Date format
         * <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT
         */
        if (isNaN(millisToSleep)) {
            millisToSleep = Math.max(0, 
            // .valueOf() is needed to subtract dates in TypeScript
            new Date(retryHeader).valueOf() - new Date().valueOf());
        }
        return millisToSleep;
    }
    async pauseForRetry(httpStatusCode, currentRetry, retryAfterHeader) {
        if (this.httpStatusCodesToRetryOn.includes(httpStatusCode) &&
            currentRetry < this.maxRetries) {
            const retryAfterDelay = this.retryAfterMillisecondsToSleep(retryAfterHeader);
            await new Promise((resolve) => {
                // retryAfterHeader value of 0 evaluates to false, and this.retryDelay will be used
                return setTimeout(resolve, retryAfterDelay || this.retryDelay);
            });
            return true;
        }
        return false;
    }
}

exports.LinearRetryPolicy = LinearRetryPolicy;
//# sourceMappingURL=LinearRetryPolicy.cjs.map
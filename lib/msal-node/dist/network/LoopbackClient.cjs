/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var msalCommon = require('@azure/msal-common');
var http = require('http');
var NodeAuthError = require('../error/NodeAuthError.cjs');
var Constants = require('../utils/Constants.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class LoopbackClient {
    /**
     * Spins up a loopback server which returns the server response when the localhost redirectUri is hit
     * @param successTemplate
     * @param errorTemplate
     * @returns
     */
    async listenForAuthCode(successTemplate, errorTemplate) {
        if (this.server) {
            throw NodeAuthError.NodeAuthError.createLoopbackServerAlreadyExistsError();
        }
        return new Promise((resolve, reject) => {
            this.server = http.createServer((req, res) => {
                const url = req.url;
                if (!url) {
                    res.end(errorTemplate ||
                        "Error occurred loading redirectUrl");
                    reject(NodeAuthError.NodeAuthError.createUnableToLoadRedirectUrlError());
                    return;
                }
                else if (url === msalCommon.Constants.FORWARD_SLASH) {
                    res.end(successTemplate ||
                        "Auth code was successfully acquired. You can close this window now.");
                    return;
                }
                const redirectUri = this.getRedirectUri();
                const parsedUrl = new URL(url, redirectUri);
                const authCodeResponse = msalCommon.UrlUtils.getDeserializedResponse(parsedUrl.search) || {};
                if (authCodeResponse.code) {
                    res.writeHead(msalCommon.HttpStatus.REDIRECT, {
                        location: redirectUri,
                    }); // Prevent auth code from being saved in the browser history
                    res.end();
                }
                resolve(authCodeResponse);
            });
            this.server.listen(0); // Listen on any available port
        });
    }
    /**
     * Get the port that the loopback server is running on
     * @returns
     */
    getRedirectUri() {
        if (!this.server || !this.server.listening) {
            throw NodeAuthError.NodeAuthError.createNoLoopbackServerExistsError();
        }
        const address = this.server.address();
        if (!address || typeof address === "string" || !address.port) {
            this.closeServer();
            throw NodeAuthError.NodeAuthError.createInvalidLoopbackAddressTypeError();
        }
        const port = address && address.port;
        return `${Constants.Constants.HTTP_PROTOCOL}${Constants.Constants.LOCALHOST}:${port}`;
    }
    /**
     * Close the loopback server
     */
    closeServer() {
        if (this.server) {
            // Only stops accepting new connections, server will close once open/idle connections are closed.
            this.server.close();
            if (typeof this.server.closeAllConnections === "function") {
                /*
                 * Close open/idle connections. This API is available in Node versions 18.2 and higher
                 */
                this.server.closeAllConnections();
            }
            this.server.unref();
            this.server = undefined;
        }
    }
}

exports.LoopbackClient = LoopbackClient;
//# sourceMappingURL=LoopbackClient.cjs.map

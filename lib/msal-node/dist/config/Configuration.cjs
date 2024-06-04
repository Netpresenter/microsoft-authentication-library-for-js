/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var msalCommon = require('@azure/msal-common');
var HttpClient = require('../network/HttpClient.cjs');
var ManagedIdentityId = require('./ManagedIdentityId.cjs');
var Constants = require('../utils/Constants.cjs');
var LinearRetryPolicy = require('../retry/LinearRetryPolicy.cjs');
var HttpClientWithRetries = require('../network/HttpClientWithRetries.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const DEFAULT_AUTH_OPTIONS = {
    clientId: msalCommon.Constants.EMPTY_STRING,
    authority: msalCommon.Constants.DEFAULT_AUTHORITY,
    clientSecret: msalCommon.Constants.EMPTY_STRING,
    clientAssertion: msalCommon.Constants.EMPTY_STRING,
    clientCertificate: {
        thumbprint: msalCommon.Constants.EMPTY_STRING,
        privateKey: msalCommon.Constants.EMPTY_STRING,
        x5c: msalCommon.Constants.EMPTY_STRING,
    },
    knownAuthorities: [],
    cloudDiscoveryMetadata: msalCommon.Constants.EMPTY_STRING,
    authorityMetadata: msalCommon.Constants.EMPTY_STRING,
    clientCapabilities: [],
    protocolMode: msalCommon.ProtocolMode.AAD,
    azureCloudOptions: {
        azureCloudInstance: msalCommon.AzureCloudInstance.None,
        tenant: msalCommon.Constants.EMPTY_STRING,
    },
    skipAuthorityMetadataCache: false,
};
const DEFAULT_CACHE_OPTIONS = {
    claimsBasedCachingEnabled: false,
};
const DEFAULT_LOGGER_OPTIONS = {
    loggerCallback: () => {
        // allow users to not set logger call back
    },
    piiLoggingEnabled: false,
    logLevel: msalCommon.LogLevel.Info,
};
const DEFAULT_SYSTEM_OPTIONS = {
    loggerOptions: DEFAULT_LOGGER_OPTIONS,
    networkClient: new HttpClient.HttpClient(),
    proxyUrl: msalCommon.Constants.EMPTY_STRING,
    customAgentOptions: {},
    disableInternalRetries: false,
};
const DEFAULT_TELEMETRY_OPTIONS = {
    application: {
        appName: msalCommon.Constants.EMPTY_STRING,
        appVersion: msalCommon.Constants.EMPTY_STRING,
    },
};
/**
 * Sets the default options when not explicitly configured from app developer
 *
 * @param auth - Authentication options
 * @param cache - Cache options
 * @param system - System options
 * @param telemetry - Telemetry options
 *
 * @returns Configuration
 * @internal
 */
function buildAppConfiguration({ auth, broker, cache, system, telemetry, }) {
    const systemOptions = {
        ...DEFAULT_SYSTEM_OPTIONS,
        networkClient: new HttpClient.HttpClient(system?.proxyUrl, system?.customAgentOptions),
        loggerOptions: system?.loggerOptions || DEFAULT_LOGGER_OPTIONS,
        disableInternalRetries: system?.disableInternalRetries || false,
    };
    return {
        auth: { ...DEFAULT_AUTH_OPTIONS, ...auth },
        broker: { ...broker },
        cache: { ...DEFAULT_CACHE_OPTIONS, ...cache },
        system: { ...systemOptions, ...system },
        telemetry: { ...DEFAULT_TELEMETRY_OPTIONS, ...telemetry },
    };
}
function buildManagedIdentityConfiguration({ managedIdentityIdParams, system, }) {
    const managedIdentityId = new ManagedIdentityId.ManagedIdentityId(managedIdentityIdParams);
    const loggerOptions = system?.loggerOptions || DEFAULT_LOGGER_OPTIONS;
    let networkClient;
    // use developer provided network client if passed in
    if (system?.networkClient) {
        networkClient = system.networkClient;
        // otherwise, create a new one
    }
    else {
        networkClient = new HttpClient.HttpClient(system?.proxyUrl, system?.customAgentOptions);
    }
    // wrap the network client with a retry policy if the developer has not disabled the option to do so
    if (!system?.disableInternalRetries) {
        const linearRetryPolicy = new LinearRetryPolicy.LinearRetryPolicy(Constants.MANAGED_IDENTITY_MAX_RETRIES, Constants.MANAGED_IDENTITY_RETRY_DELAY, Constants.MANAGED_IDENTITY_HTTP_STATUS_CODES_TO_RETRY_ON);
        networkClient = new HttpClientWithRetries.HttpClientWithRetries(networkClient, linearRetryPolicy);
    }
    return {
        managedIdentityId: managedIdentityId,
        system: {
            loggerOptions,
            networkClient,
        },
    };
}

exports.buildAppConfiguration = buildAppConfiguration;
exports.buildManagedIdentityConfiguration = buildManagedIdentityConfiguration;
//# sourceMappingURL=Configuration.cjs.map

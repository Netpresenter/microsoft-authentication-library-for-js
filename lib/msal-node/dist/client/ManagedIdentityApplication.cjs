/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var msalCommon = require('@azure/msal-common');
var Configuration = require('../config/Configuration.cjs');
var packageMetadata = require('../packageMetadata.cjs');
var CryptoProvider = require('../crypto/CryptoProvider.cjs');
var ClientCredentialClient = require('./ClientCredentialClient.cjs');
var ManagedIdentityClient = require('./ManagedIdentityClient.cjs');
var NodeStorage = require('../cache/NodeStorage.cjs');
var Constants = require('../utils/Constants.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Class to initialize a managed identity and identify the service
 * @public
 */
class ManagedIdentityApplication {
    constructor(configuration) {
        // undefined config means the managed identity is system-assigned
        this.config = Configuration.buildManagedIdentityConfiguration(configuration || {});
        this.logger = new msalCommon.Logger(this.config.system.loggerOptions, packageMetadata.name, packageMetadata.version);
        const fakeStatusAuthorityOptions = {
            canonicalAuthority: msalCommon.Constants.DEFAULT_AUTHORITY,
        };
        if (!ManagedIdentityApplication.nodeStorage) {
            ManagedIdentityApplication.nodeStorage = new NodeStorage.NodeStorage(this.logger, this.config.managedIdentityId.id, msalCommon.DEFAULT_CRYPTO_IMPLEMENTATION, fakeStatusAuthorityOptions);
        }
        this.networkClient = this.config.system.networkClient;
        this.cryptoProvider = new CryptoProvider.CryptoProvider();
        const fakeAuthorityOptions = {
            protocolMode: msalCommon.ProtocolMode.AAD,
            knownAuthorities: [Constants.DEFAULT_AUTHORITY_FOR_MANAGED_IDENTITY],
            cloudDiscoveryMetadata: "",
            authorityMetadata: "",
        };
        this.fakeAuthority = new msalCommon.Authority(Constants.DEFAULT_AUTHORITY_FOR_MANAGED_IDENTITY, this.networkClient, ManagedIdentityApplication.nodeStorage, fakeAuthorityOptions, this.logger, this.cryptoProvider.createNewGuid(), // correlationID
        undefined, true);
        this.fakeClientCredentialClient = new ClientCredentialClient.ClientCredentialClient({
            authOptions: {
                clientId: this.config.managedIdentityId.id,
                authority: this.fakeAuthority,
            },
        });
        this.managedIdentityClient = new ManagedIdentityClient.ManagedIdentityClient(this.logger, ManagedIdentityApplication.nodeStorage, this.networkClient, this.cryptoProvider);
    }
    /**
     * Acquire an access token from the cache or the managed identity
     * @param managedIdentityRequest - the ManagedIdentityRequestParams object passed in by the developer
     * @returns the access token
     */
    async acquireToken(managedIdentityRequestParams) {
        if (!managedIdentityRequestParams.resource) {
            throw msalCommon.createClientConfigurationError(msalCommon.ClientConfigurationErrorCodes.urlEmptyError);
        }
        const managedIdentityRequest = {
            forceRefresh: managedIdentityRequestParams.forceRefresh,
            resource: managedIdentityRequestParams.resource.replace("/.default", ""),
            scopes: [
                managedIdentityRequestParams.resource.replace("/.default", ""),
            ],
            authority: this.fakeAuthority.canonicalAuthority,
            correlationId: this.cryptoProvider.createNewGuid(),
        };
        if (managedIdentityRequest.forceRefresh) {
            // make a network call to the managed identity source
            return this.managedIdentityClient.sendManagedIdentityTokenRequest(managedIdentityRequest, this.config.managedIdentityId, this.fakeAuthority);
        }
        const [cachedAuthenticationResult, lastCacheOutcome] = await this.fakeClientCredentialClient.getCachedAuthenticationResult(managedIdentityRequest, this.config, this.cryptoProvider, this.fakeAuthority, ManagedIdentityApplication.nodeStorage);
        if (cachedAuthenticationResult) {
            // if the token is not expired but must be refreshed; get a new one in the background
            if (lastCacheOutcome === msalCommon.CacheOutcome.PROACTIVELY_REFRESHED) {
                this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
                // make a network call to the managed identity source; refresh the access token in the background
                const refreshAccessToken = true;
                await this.managedIdentityClient.sendManagedIdentityTokenRequest(managedIdentityRequest, this.config.managedIdentityId, this.fakeAuthority, refreshAccessToken);
            }
            return cachedAuthenticationResult;
        }
        else {
            // make a network call to the managed identity source
            return this.managedIdentityClient.sendManagedIdentityTokenRequest(managedIdentityRequest, this.config.managedIdentityId, this.fakeAuthority);
        }
    }
    /**
     * Determine the Managed Identity Source based on available environment variables. This API is consumed by Azure Identity SDK.
     * @returns ManagedIdentitySourceNames - The Managed Identity source's name
     */
    getManagedIdentitySource() {
        return (ManagedIdentityClient.ManagedIdentityClient.sourceName ||
            this.managedIdentityClient.getManagedIdentitySource());
    }
}

exports.ManagedIdentityApplication = ManagedIdentityApplication;
//# sourceMappingURL=ManagedIdentityApplication.cjs.map

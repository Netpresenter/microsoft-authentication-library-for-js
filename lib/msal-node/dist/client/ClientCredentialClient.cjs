/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var msalCommon = require('@azure/msal-common');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * OAuth2.0 client credential grant
 */
class ClientCredentialClient extends msalCommon.BaseClient {
    constructor(configuration, appTokenProvider) {
        super(configuration);
        this.appTokenProvider = appTokenProvider;
    }
    /**
     * Public API to acquire a token with ClientCredential Flow for Confidential clients
     * @param request
     */
    async acquireToken(request) {
        if (request.skipCache || request.claims) {
            return this.executeTokenRequest(request, this.authority);
        }
        const [cachedAuthenticationResult, lastCacheOutcome] = await this.getCachedAuthenticationResult(request, this.config, this.cryptoUtils, this.authority, this.cacheManager, this.serverTelemetryManager);
        if (cachedAuthenticationResult) {
            // if the token is not expired but must be refreshed; get a new one in the background
            if (lastCacheOutcome === msalCommon.CacheOutcome.PROACTIVELY_REFRESHED) {
                this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
                // refresh the access token in the background
                const refreshAccessToken = true;
                await this.executeTokenRequest(request, this.authority, refreshAccessToken);
            }
            // return the cached token
            return cachedAuthenticationResult;
        }
        else {
            return this.executeTokenRequest(request, this.authority);
        }
    }
    /**
     * looks up cache if the tokens are cached already
     */
    async getCachedAuthenticationResult(request, config, cryptoUtils, authority, cacheManager, serverTelemetryManager) {
        const clientConfiguration = config;
        const managedIdentityConfiguration = config;
        let lastCacheOutcome = msalCommon.CacheOutcome.NOT_APPLICABLE;
        // read the user-supplied cache into memory, if applicable
        let cacheContext;
        if (clientConfiguration.serializableCache &&
            clientConfiguration.persistencePlugin) {
            cacheContext = new msalCommon.TokenCacheContext(clientConfiguration.serializableCache, false);
            await clientConfiguration.persistencePlugin.beforeCacheAccess(cacheContext);
        }
        const cachedAccessToken = this.readAccessTokenFromCache(authority, managedIdentityConfiguration.managedIdentityId?.id ||
            clientConfiguration.authOptions.clientId, new msalCommon.ScopeSet(request.scopes || []), cacheManager);
        if (clientConfiguration.serializableCache &&
            clientConfiguration.persistencePlugin &&
            cacheContext) {
            await clientConfiguration.persistencePlugin.afterCacheAccess(cacheContext);
        }
        // must refresh due to non-existent access_token
        if (!cachedAccessToken) {
            serverTelemetryManager?.setCacheOutcome(msalCommon.CacheOutcome.NO_CACHED_ACCESS_TOKEN);
            return [null, msalCommon.CacheOutcome.NO_CACHED_ACCESS_TOKEN];
        }
        // must refresh due to the expires_in value
        if (msalCommon.TimeUtils.isTokenExpired(cachedAccessToken.expiresOn, clientConfiguration.systemOptions?.tokenRenewalOffsetSeconds ||
            msalCommon.DEFAULT_TOKEN_RENEWAL_OFFSET_SEC)) {
            serverTelemetryManager?.setCacheOutcome(msalCommon.CacheOutcome.CACHED_ACCESS_TOKEN_EXPIRED);
            return [null, msalCommon.CacheOutcome.CACHED_ACCESS_TOKEN_EXPIRED];
        }
        // must refresh (in the background) due to the refresh_in value
        if (cachedAccessToken.refreshOn &&
            msalCommon.TimeUtils.isTokenExpired(cachedAccessToken.refreshOn.toString(), 0)) {
            lastCacheOutcome = msalCommon.CacheOutcome.PROACTIVELY_REFRESHED;
            serverTelemetryManager?.setCacheOutcome(msalCommon.CacheOutcome.PROACTIVELY_REFRESHED);
        }
        return [
            await msalCommon.ResponseHandler.generateAuthenticationResult(cryptoUtils, authority, {
                account: null,
                idToken: null,
                accessToken: cachedAccessToken,
                refreshToken: null,
                appMetadata: null,
            }, true, request),
            lastCacheOutcome,
        ];
    }
    /**
     * Reads access token from the cache
     */
    readAccessTokenFromCache(authority, id, scopeSet, cacheManager) {
        const accessTokenFilter = {
            homeAccountId: msalCommon.Constants.EMPTY_STRING,
            environment: authority.canonicalAuthorityUrlComponents.HostNameAndPort,
            credentialType: msalCommon.CredentialType.ACCESS_TOKEN,
            clientId: id,
            realm: authority.tenant,
            target: msalCommon.ScopeSet.createSearchScopes(scopeSet.asArray()),
        };
        const accessTokens = cacheManager.getAccessTokensByFilter(accessTokenFilter);
        if (accessTokens.length < 1) {
            return null;
        }
        else if (accessTokens.length > 1) {
            throw msalCommon.createClientAuthError(msalCommon.ClientAuthErrorCodes.multipleMatchingTokens);
        }
        return accessTokens[0];
    }
    /**
     * Makes a network call to request the token from the service
     * @param request
     * @param authority
     */
    async executeTokenRequest(request, authority, refreshAccessToken) {
        let serverTokenResponse;
        let reqTimestamp;
        if (this.appTokenProvider) {
            this.logger.info("Using appTokenProvider extensibility.");
            const appTokenPropviderParameters = {
                correlationId: request.correlationId,
                tenantId: this.config.authOptions.authority.tenant,
                scopes: request.scopes,
                claims: request.claims,
            };
            reqTimestamp = msalCommon.TimeUtils.nowSeconds();
            const appTokenProviderResult = await this.appTokenProvider(appTokenPropviderParameters);
            serverTokenResponse = {
                access_token: appTokenProviderResult.accessToken,
                expires_in: appTokenProviderResult.expiresInSeconds,
                refresh_in: appTokenProviderResult.refreshInSeconds,
                token_type: msalCommon.AuthenticationScheme.BEARER,
            };
        }
        else {
            const queryParametersString = this.createTokenQueryParameters(request);
            const endpoint = msalCommon.UrlString.appendQueryString(authority.tokenEndpoint, queryParametersString);
            const requestBody = await this.createTokenRequestBody(request);
            const headers = this.createTokenRequestHeaders();
            const thumbprint = {
                clientId: this.config.authOptions.clientId,
                authority: request.authority,
                scopes: request.scopes,
                claims: request.claims,
                authenticationScheme: request.authenticationScheme,
                resourceRequestMethod: request.resourceRequestMethod,
                resourceRequestUri: request.resourceRequestUri,
                shrClaims: request.shrClaims,
                sshKid: request.sshKid,
            };
            this.logger.info("Sending token request to endpoint: " + authority.tokenEndpoint);
            reqTimestamp = msalCommon.TimeUtils.nowSeconds();
            const response = await this.executePostToTokenEndpoint(endpoint, requestBody, headers, thumbprint, request.correlationId);
            serverTokenResponse = response.body;
            serverTokenResponse.status = response.status;
        }
        const responseHandler = new msalCommon.ResponseHandler(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
        responseHandler.validateTokenResponse(serverTokenResponse, refreshAccessToken);
        const tokenResponse = await responseHandler.handleServerTokenResponse(serverTokenResponse, this.authority, reqTimestamp, request);
        return tokenResponse;
    }
    /**
     * generate the request to the server in the acceptable format
     * @param request
     */
    async createTokenRequestBody(request) {
        const parameterBuilder = new msalCommon.RequestParameterBuilder();
        parameterBuilder.addClientId(this.config.authOptions.clientId);
        parameterBuilder.addScopes(request.scopes, false);
        parameterBuilder.addGrantType(msalCommon.GrantType.CLIENT_CREDENTIALS_GRANT);
        parameterBuilder.addLibraryInfo(this.config.libraryInfo);
        parameterBuilder.addApplicationTelemetry(this.config.telemetry.application);
        parameterBuilder.addThrottling();
        if (this.serverTelemetryManager) {
            parameterBuilder.addServerTelemetry(this.serverTelemetryManager);
        }
        const correlationId = request.correlationId ||
            this.config.cryptoInterface.createNewGuid();
        parameterBuilder.addCorrelationId(correlationId);
        if (this.config.clientCredentials.clientSecret) {
            parameterBuilder.addClientSecret(this.config.clientCredentials.clientSecret);
        }
        // Use clientAssertion from request, fallback to client assertion in base configuration
        const clientAssertion = request.clientAssertion ||
            this.config.clientCredentials.clientAssertion;
        if (clientAssertion) {
            parameterBuilder.addClientAssertion(await msalCommon.getClientAssertion(clientAssertion.assertion, this.config.authOptions.clientId, request.resourceRequestUri));
            parameterBuilder.addClientAssertionType(clientAssertion.assertionType);
        }
        if (!msalCommon.StringUtils.isEmptyObj(request.claims) ||
            (this.config.authOptions.clientCapabilities &&
                this.config.authOptions.clientCapabilities.length > 0)) {
            parameterBuilder.addClaims(request.claims, this.config.authOptions.clientCapabilities);
        }
        return parameterBuilder.createQueryString();
    }
}

exports.ClientCredentialClient = ClientCredentialClient;
//# sourceMappingURL=ClientCredentialClient.cjs.map
/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var ClientApplication = require('./ClientApplication.cjs');
var ClientAssertion = require('./ClientAssertion.cjs');
var Constants = require('../utils/Constants.cjs');
var msalCommon = require('@azure/msal-common');
var ClientCredentialClient = require('./ClientCredentialClient.cjs');
var OnBehalfOfClient = require('./OnBehalfOfClient.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// AADAuthorityConstants
/**
 *  This class is to be used to acquire tokens for confidential client applications (webApp, webAPI). Confidential client applications
 *  will configure application secrets, client certificates/assertions as applicable
 * @public
 */
class ConfidentialClientApplication extends ClientApplication.ClientApplication {
    /**
     * Constructor for the ConfidentialClientApplication
     *
     * Required attributes in the Configuration object are:
     * - clientID: the application ID of your application. You can obtain one by registering your application with our application registration portal
     * - authority: the authority URL for your application.
     * - client credential: Must set either client secret, certificate, or assertion for confidential clients. You can obtain a client secret from the application registration portal.
     *
     * In Azure AD, authority is a URL indicating of the form https://login.microsoftonline.com/\{Enter_the_Tenant_Info_Here\}.
     * If your application supports Accounts in one organizational directory, replace "Enter_the_Tenant_Info_Here" value with the Tenant Id or Tenant name (for example, contoso.microsoft.com).
     * If your application supports Accounts in any organizational directory, replace "Enter_the_Tenant_Info_Here" value with organizations.
     * If your application supports Accounts in any organizational directory and personal Microsoft accounts, replace "Enter_the_Tenant_Info_Here" value with common.
     * To restrict support to Personal Microsoft accounts only, replace "Enter_the_Tenant_Info_Here" value with consumers.
     *
     * In Azure B2C, authority is of the form https://\{instance\}/tfp/\{tenant\}/\{policyName\}/
     * Full B2C functionality will be available in this library in future versions.
     *
     * @param Configuration - configuration object for the MSAL ConfidentialClientApplication instance
     */
    constructor(configuration) {
        super(configuration);
        this.setClientCredential(this.config);
        this.appTokenProvider = undefined;
    }
    /**
     * This extensibility point only works for the client_credential flow, i.e. acquireTokenByClientCredential and
     * is meant for Azure SDK to enhance Managed Identity support.
     *
     * @param IAppTokenProvider  - Extensibility interface, which allows the app developer to return a token from a custom source.
     */
    SetAppTokenProvider(provider) {
        this.appTokenProvider = provider;
    }
    /**
     * Acquires tokens from the authority for the application (not for an end user).
     */
    async acquireTokenByClientCredential(request) {
        this.logger.info("acquireTokenByClientCredential called", request.correlationId);
        // If there is a client assertion present in the request, it overrides the one present in the client configuration
        let clientAssertion;
        if (request.clientAssertion) {
            clientAssertion = {
                assertion: await msalCommon.getClientAssertion(request.clientAssertion, this.config.auth.clientId
                // tokenEndpoint will be undefined. resourceRequestUri is omitted in ClientCredentialRequest
                ),
                assertionType: Constants.Constants.JWT_BEARER_ASSERTION_TYPE,
            };
        }
        const baseRequest = await this.initializeBaseRequest(request);
        // valid base request should not contain oidc scopes in this grant type
        const validBaseRequest = {
            ...baseRequest,
            scopes: baseRequest.scopes.filter((scope) => !msalCommon.OIDC_DEFAULT_SCOPES.includes(scope)),
        };
        const validRequest = {
            ...request,
            ...validBaseRequest,
            clientAssertion,
        };
        /*
         * valid request should not have "common" or "organizations" in lieu of the tenant_id in the authority in the auth configuration
         * example authority: "https://login.microsoftonline.com/TenantId",
         */
        const authority = new msalCommon.UrlString(validRequest.authority);
        const tenantId = authority.getUrlComponents().PathSegments[0];
        if (Object.values(msalCommon.AADAuthorityConstants).includes(tenantId)) {
            throw msalCommon.createClientAuthError(msalCommon.ClientAuthErrorCodes.missingTenantIdError);
        }
        const azureRegionConfiguration = {
            azureRegion: validRequest.azureRegion,
            environmentRegion: process.env[Constants.REGION_ENVIRONMENT_VARIABLE],
        };
        const serverTelemetryManager = this.initializeServerTelemetryManager(Constants.ApiId.acquireTokenByClientCredential, validRequest.correlationId, validRequest.skipCache);
        try {
            const clientCredentialConfig = await this.buildOauthClientConfiguration(validRequest.authority, validRequest.correlationId, serverTelemetryManager, azureRegionConfiguration, request.azureCloudOptions);
            const clientCredentialClient = new ClientCredentialClient.ClientCredentialClient(clientCredentialConfig, this.appTokenProvider);
            this.logger.verbose("Client credential client created", validRequest.correlationId);
            return await clientCredentialClient.acquireToken(validRequest);
        }
        catch (e) {
            if (e instanceof msalCommon.AuthError) {
                e.setCorrelationId(validRequest.correlationId);
            }
            serverTelemetryManager.cacheFailedRequest(e);
            throw e;
        }
    }
    /**
     * Acquires tokens from the authority for the application.
     *
     * Used in scenarios where the current app is a middle-tier service which was called with a token
     * representing an end user. The current app can use the token (oboAssertion) to request another
     * token to access downstream web API, on behalf of that user.
     *
     * The current middle-tier app has no user interaction to obtain consent.
     * See how to gain consent upfront for your middle-tier app from this article.
     * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#gaining-consent-for-the-middle-tier-application
     */
    async acquireTokenOnBehalfOf(request) {
        this.logger.info("acquireTokenOnBehalfOf called", request.correlationId);
        const validRequest = {
            ...request,
            ...(await this.initializeBaseRequest(request)),
        };
        try {
            const onBehalfOfConfig = await this.buildOauthClientConfiguration(validRequest.authority, validRequest.correlationId, undefined, undefined, request.azureCloudOptions);
            const oboClient = new OnBehalfOfClient.OnBehalfOfClient(onBehalfOfConfig);
            this.logger.verbose("On behalf of client created", validRequest.correlationId);
            return await oboClient.acquireToken(validRequest);
        }
        catch (e) {
            if (e instanceof msalCommon.AuthError) {
                e.setCorrelationId(validRequest.correlationId);
            }
            throw e;
        }
    }
    setClientCredential(configuration) {
        const clientSecretNotEmpty = !!configuration.auth.clientSecret;
        const clientAssertionNotEmpty = !!configuration.auth.clientAssertion;
        const certificate = configuration.auth.clientCertificate || {
            thumbprint: msalCommon.Constants.EMPTY_STRING,
            privateKey: msalCommon.Constants.EMPTY_STRING,
        };
        const certificateNotEmpty = !!certificate.thumbprint || !!certificate.privateKey;
        /*
         * If app developer configures this callback, they don't need a credential
         * i.e. AzureSDK can get token from Managed Identity without a cert / secret
         */
        if (this.appTokenProvider) {
            return;
        }
        // Check that at most one credential is set on the application
        if ((clientSecretNotEmpty && clientAssertionNotEmpty) ||
            (clientAssertionNotEmpty && certificateNotEmpty) ||
            (clientSecretNotEmpty && certificateNotEmpty)) {
            throw msalCommon.createClientAuthError(msalCommon.ClientAuthErrorCodes.invalidClientCredential);
        }
        if (configuration.auth.clientSecret) {
            this.clientSecret = configuration.auth.clientSecret;
            return;
        }
        if (configuration.auth.clientAssertion) {
            this.developerProvidedClientAssertion =
                configuration.auth.clientAssertion;
            return;
        }
        if (!certificateNotEmpty) {
            throw msalCommon.createClientAuthError(msalCommon.ClientAuthErrorCodes.invalidClientCredential);
        }
        else {
            this.clientAssertion = ClientAssertion.ClientAssertion.fromCertificate(certificate.thumbprint, certificate.privateKey, configuration.auth.clientCertificate?.x5c);
        }
    }
}

exports.ConfidentialClientApplication = ConfidentialClientApplication;
//# sourceMappingURL=ConfidentialClientApplication.cjs.map

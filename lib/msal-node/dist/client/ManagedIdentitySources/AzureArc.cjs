/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var msalCommon = require('@azure/msal-common');
var ManagedIdentityRequestParameters = require('../../config/ManagedIdentityRequestParameters.cjs');
var BaseManagedIdentitySource = require('./BaseManagedIdentitySource.cjs');
var ManagedIdentityError = require('../../error/ManagedIdentityError.cjs');
var Constants = require('../../utils/Constants.cjs');
var fs = require('fs');
var ManagedIdentityErrorCodes = require('../../error/ManagedIdentityErrorCodes.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const ARC_API_VERSION = "2019-11-01";
/**
 * Original source of code: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/src/AzureArcManagedIdentitySource.cs
 */
class AzureArc extends BaseManagedIdentitySource.BaseManagedIdentitySource {
    constructor(logger, nodeStorage, networkClient, cryptoProvider, identityEndpoint) {
        super(logger, nodeStorage, networkClient, cryptoProvider);
        this.identityEndpoint = identityEndpoint;
    }
    static getEnvironmentVariables() {
        const identityEndpoint = process.env[Constants.ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT];
        const imdsEndpoint = process.env[Constants.ManagedIdentityEnvironmentVariableNames.IMDS_ENDPOINT];
        return [identityEndpoint, imdsEndpoint];
    }
    static tryCreate(logger, nodeStorage, networkClient, cryptoProvider, managedIdentityId) {
        const [identityEndpoint, imdsEndpoint] = AzureArc.getEnvironmentVariables();
        // if either of the identity or imds endpoints are undefined, this MSI provider is unavailable.
        if (!identityEndpoint || !imdsEndpoint) {
            logger.info(`[Managed Identity] ${Constants.ManagedIdentitySourceNames.AZURE_ARC} managed identity is unavailable because one or both of the '${Constants.ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT}' and '${Constants.ManagedIdentityEnvironmentVariableNames.IMDS_ENDPOINT}' environment variables are not defined.`);
            return null;
        }
        const validatedIdentityEndpoint = AzureArc.getValidatedEnvVariableUrlString(Constants.ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT, identityEndpoint, Constants.ManagedIdentitySourceNames.AZURE_ARC, logger);
        // remove trailing slash
        validatedIdentityEndpoint.endsWith("/")
            ? validatedIdentityEndpoint.slice(0, -1)
            : validatedIdentityEndpoint;
        AzureArc.getValidatedEnvVariableUrlString(Constants.ManagedIdentityEnvironmentVariableNames.IMDS_ENDPOINT, imdsEndpoint, Constants.ManagedIdentitySourceNames.AZURE_ARC, logger);
        logger.info(`[Managed Identity] Environment variables validation passed for ${Constants.ManagedIdentitySourceNames.AZURE_ARC} managed identity. Endpoint URI: ${validatedIdentityEndpoint}. Creating ${Constants.ManagedIdentitySourceNames.AZURE_ARC} managed identity.`);
        if (managedIdentityId.idType !== Constants.ManagedIdentityIdType.SYSTEM_ASSIGNED) {
            throw ManagedIdentityError.createManagedIdentityError(ManagedIdentityErrorCodes.unableToCreateAzureArc);
        }
        return new AzureArc(logger, nodeStorage, networkClient, cryptoProvider, identityEndpoint);
    }
    createRequest(resource) {
        const request = new ManagedIdentityRequestParameters.ManagedIdentityRequestParameters(Constants.HttpMethod.GET, this.identityEndpoint.replace("localhost", "127.0.0.1"));
        request.headers[Constants.METADATA_HEADER_NAME] = "true";
        request.queryParameters[Constants.API_VERSION_QUERY_PARAMETER_NAME] =
            ARC_API_VERSION;
        request.queryParameters[Constants.RESOURCE_BODY_OR_QUERY_PARAMETER_NAME] =
            resource;
        // bodyParameters calculated in BaseManagedIdentity.acquireTokenWithManagedIdentity
        return request;
    }
    async getServerTokenResponseAsync(originalResponse, networkClient, networkRequest, networkRequestOptions) {
        let retryResponse;
        if (originalResponse.status === msalCommon.HttpStatus.UNAUTHORIZED) {
            const wwwAuthHeader = originalResponse.headers["www-authenticate"];
            if (!wwwAuthHeader) {
                throw ManagedIdentityError.createManagedIdentityError(ManagedIdentityErrorCodes.wwwAuthenticateHeaderMissing);
            }
            if (!wwwAuthHeader.includes("Basic realm=")) {
                throw ManagedIdentityError.createManagedIdentityError(ManagedIdentityErrorCodes.wwwAuthenticateHeaderUnsupportedFormat);
            }
            const secretFile = wwwAuthHeader.split("Basic realm=")[1];
            let secret;
            try {
                secret = fs.readFileSync(secretFile, "utf-8");
            }
            catch (e) {
                throw ManagedIdentityError.createManagedIdentityError(ManagedIdentityErrorCodes.unableToReadSecretFile);
            }
            const authHeaderValue = `Basic ${secret}`;
            this.logger.info(`[Managed Identity] Adding authorization header to the request.`);
            networkRequest.headers[Constants.AUTHORIZATION_HEADER_NAME] = authHeaderValue;
            try {
                retryResponse =
                    await networkClient.sendGetRequestAsync(networkRequest.computeUri(), networkRequestOptions);
            }
            catch (error) {
                if (error instanceof msalCommon.AuthError) {
                    throw error;
                }
                else {
                    throw msalCommon.createClientAuthError(msalCommon.ClientAuthErrorCodes.networkError);
                }
            }
        }
        return this.getServerTokenResponse(retryResponse || originalResponse);
    }
}

exports.ARC_API_VERSION = ARC_API_VERSION;
exports.AzureArc = AzureArc;
//# sourceMappingURL=AzureArc.cjs.map
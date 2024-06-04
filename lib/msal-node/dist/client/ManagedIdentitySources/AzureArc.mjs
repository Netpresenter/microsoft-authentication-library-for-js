/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
import { HttpStatus, AuthError, createClientAuthError, ClientAuthErrorCodes } from '@azure/msal-common';
import { ManagedIdentityRequestParameters } from '../../config/ManagedIdentityRequestParameters.mjs';
import { BaseManagedIdentitySource } from './BaseManagedIdentitySource.mjs';
import { createManagedIdentityError } from '../../error/ManagedIdentityError.mjs';
import { ManagedIdentityEnvironmentVariableNames, ManagedIdentitySourceNames, ManagedIdentityIdType, HttpMethod, METADATA_HEADER_NAME, API_VERSION_QUERY_PARAMETER_NAME, RESOURCE_BODY_OR_QUERY_PARAMETER_NAME, AUTHORIZATION_HEADER_NAME } from '../../utils/Constants.mjs';
import { readFileSync } from 'fs';
import { unableToCreateAzureArc, wwwAuthenticateHeaderMissing, wwwAuthenticateHeaderUnsupportedFormat, unableToReadSecretFile } from '../../error/ManagedIdentityErrorCodes.mjs';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const ARC_API_VERSION = "2019-11-01";
/**
 * Original source of code: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/src/AzureArcManagedIdentitySource.cs
 */
class AzureArc extends BaseManagedIdentitySource {
    constructor(logger, nodeStorage, networkClient, cryptoProvider, identityEndpoint) {
        super(logger, nodeStorage, networkClient, cryptoProvider);
        this.identityEndpoint = identityEndpoint;
    }
    static getEnvironmentVariables() {
        const identityEndpoint = process.env[ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT];
        const imdsEndpoint = process.env[ManagedIdentityEnvironmentVariableNames.IMDS_ENDPOINT];
        return [identityEndpoint, imdsEndpoint];
    }
    static tryCreate(logger, nodeStorage, networkClient, cryptoProvider, managedIdentityId) {
        const [identityEndpoint, imdsEndpoint] = AzureArc.getEnvironmentVariables();
        // if either of the identity or imds endpoints are undefined, this MSI provider is unavailable.
        if (!identityEndpoint || !imdsEndpoint) {
            logger.info(`[Managed Identity] ${ManagedIdentitySourceNames.AZURE_ARC} managed identity is unavailable because one or both of the '${ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT}' and '${ManagedIdentityEnvironmentVariableNames.IMDS_ENDPOINT}' environment variables are not defined.`);
            return null;
        }
        const validatedIdentityEndpoint = AzureArc.getValidatedEnvVariableUrlString(ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT, identityEndpoint, ManagedIdentitySourceNames.AZURE_ARC, logger);
        // remove trailing slash
        validatedIdentityEndpoint.endsWith("/")
            ? validatedIdentityEndpoint.slice(0, -1)
            : validatedIdentityEndpoint;
        AzureArc.getValidatedEnvVariableUrlString(ManagedIdentityEnvironmentVariableNames.IMDS_ENDPOINT, imdsEndpoint, ManagedIdentitySourceNames.AZURE_ARC, logger);
        logger.info(`[Managed Identity] Environment variables validation passed for ${ManagedIdentitySourceNames.AZURE_ARC} managed identity. Endpoint URI: ${validatedIdentityEndpoint}. Creating ${ManagedIdentitySourceNames.AZURE_ARC} managed identity.`);
        if (managedIdentityId.idType !== ManagedIdentityIdType.SYSTEM_ASSIGNED) {
            throw createManagedIdentityError(unableToCreateAzureArc);
        }
        return new AzureArc(logger, nodeStorage, networkClient, cryptoProvider, identityEndpoint);
    }
    createRequest(resource) {
        const request = new ManagedIdentityRequestParameters(HttpMethod.GET, this.identityEndpoint.replace("localhost", "127.0.0.1"));
        request.headers[METADATA_HEADER_NAME] = "true";
        request.queryParameters[API_VERSION_QUERY_PARAMETER_NAME] =
            ARC_API_VERSION;
        request.queryParameters[RESOURCE_BODY_OR_QUERY_PARAMETER_NAME] =
            resource;
        // bodyParameters calculated in BaseManagedIdentity.acquireTokenWithManagedIdentity
        return request;
    }
    async getServerTokenResponseAsync(originalResponse, networkClient, networkRequest, networkRequestOptions) {
        let retryResponse;
        if (originalResponse.status === HttpStatus.UNAUTHORIZED) {
            const wwwAuthHeader = originalResponse.headers["www-authenticate"];
            if (!wwwAuthHeader) {
                throw createManagedIdentityError(wwwAuthenticateHeaderMissing);
            }
            if (!wwwAuthHeader.includes("Basic realm=")) {
                throw createManagedIdentityError(wwwAuthenticateHeaderUnsupportedFormat);
            }
            const secretFile = wwwAuthHeader.split("Basic realm=")[1];
            let secret;
            try {
                secret = readFileSync(secretFile, "utf-8");
            }
            catch (e) {
                throw createManagedIdentityError(unableToReadSecretFile);
            }
            const authHeaderValue = `Basic ${secret}`;
            this.logger.info(`[Managed Identity] Adding authorization header to the request.`);
            networkRequest.headers[AUTHORIZATION_HEADER_NAME] = authHeaderValue;
            try {
                retryResponse =
                    await networkClient.sendGetRequestAsync(networkRequest.computeUri(), networkRequestOptions);
            }
            catch (error) {
                if (error instanceof AuthError) {
                    throw error;
                }
                else {
                    throw createClientAuthError(ClientAuthErrorCodes.networkError);
                }
            }
        }
        return this.getServerTokenResponse(retryResponse || originalResponse);
    }
}

export { ARC_API_VERSION, AzureArc };
//# sourceMappingURL=AzureArc.mjs.map

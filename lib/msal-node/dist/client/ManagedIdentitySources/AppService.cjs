/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var BaseManagedIdentitySource = require('./BaseManagedIdentitySource.cjs');
var Constants = require('../../utils/Constants.cjs');
var ManagedIdentityRequestParameters = require('../../config/ManagedIdentityRequestParameters.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// MSI Constants. Docs for MSI are available here https://docs.microsoft.com/azure/app-service/overview-managed-identity
const APP_SERVICE_MSI_API_VERSION = "2019-08-01";
/**
 * Original source of code: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/src/AppServiceManagedIdentitySource.cs
 */
class AppService extends BaseManagedIdentitySource.BaseManagedIdentitySource {
    constructor(logger, nodeStorage, networkClient, cryptoProvider, identityEndpoint, identityHeader) {
        super(logger, nodeStorage, networkClient, cryptoProvider);
        this.identityEndpoint = identityEndpoint;
        this.identityHeader = identityHeader;
    }
    static getEnvironmentVariables() {
        const identityEndpoint = process.env[Constants.ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT];
        const identityHeader = process.env[Constants.ManagedIdentityEnvironmentVariableNames.IDENTITY_HEADER];
        return [identityEndpoint, identityHeader];
    }
    static tryCreate(logger, nodeStorage, networkClient, cryptoProvider) {
        const [identityEndpoint, identityHeader] = AppService.getEnvironmentVariables();
        // if either of the identity endpoint or identity header variables are undefined, this MSI provider is unavailable.
        if (!identityEndpoint || !identityHeader) {
            logger.info(`[Managed Identity] ${Constants.ManagedIdentitySourceNames.APP_SERVICE} managed identity is unavailable because one or both of the '${Constants.ManagedIdentityEnvironmentVariableNames.IDENTITY_HEADER}' and '${Constants.ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT}' environment variables are not defined.`);
            return null;
        }
        const validatedIdentityEndpoint = AppService.getValidatedEnvVariableUrlString(Constants.ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT, identityEndpoint, Constants.ManagedIdentitySourceNames.APP_SERVICE, logger);
        logger.info(`[Managed Identity] Environment variables validation passed for ${Constants.ManagedIdentitySourceNames.APP_SERVICE} managed identity. Endpoint URI: ${validatedIdentityEndpoint}. Creating ${Constants.ManagedIdentitySourceNames.APP_SERVICE} managed identity.`);
        return new AppService(logger, nodeStorage, networkClient, cryptoProvider, identityEndpoint, identityHeader);
    }
    createRequest(resource, managedIdentityId) {
        const request = new ManagedIdentityRequestParameters.ManagedIdentityRequestParameters(Constants.HttpMethod.GET, this.identityEndpoint);
        request.headers[Constants.APP_SERVICE_SECRET_HEADER_NAME] = this.identityHeader;
        request.queryParameters[Constants.API_VERSION_QUERY_PARAMETER_NAME] =
            APP_SERVICE_MSI_API_VERSION;
        request.queryParameters[Constants.RESOURCE_BODY_OR_QUERY_PARAMETER_NAME] =
            resource;
        if (managedIdentityId.idType !== Constants.ManagedIdentityIdType.SYSTEM_ASSIGNED) {
            request.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(managedIdentityId.idType)] = managedIdentityId.id;
        }
        // bodyParameters calculated in BaseManagedIdentity.acquireTokenWithManagedIdentity
        return request;
    }
}

exports.AppService = AppService;
//# sourceMappingURL=AppService.cjs.map
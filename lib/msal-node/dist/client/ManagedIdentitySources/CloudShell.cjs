/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var ManagedIdentityRequestParameters = require('../../config/ManagedIdentityRequestParameters.cjs');
var BaseManagedIdentitySource = require('./BaseManagedIdentitySource.cjs');
var Constants = require('../../utils/Constants.cjs');
var ManagedIdentityError = require('../../error/ManagedIdentityError.cjs');
var ManagedIdentityErrorCodes = require('../../error/ManagedIdentityErrorCodes.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Original source of code: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/src/CloudShellManagedIdentitySource.cs
 */
class CloudShell extends BaseManagedIdentitySource.BaseManagedIdentitySource {
    constructor(logger, nodeStorage, networkClient, cryptoProvider, msiEndpoint) {
        super(logger, nodeStorage, networkClient, cryptoProvider);
        this.msiEndpoint = msiEndpoint;
    }
    static getEnvironmentVariables() {
        const msiEndpoint = process.env[Constants.ManagedIdentityEnvironmentVariableNames.MSI_ENDPOINT];
        return [msiEndpoint];
    }
    static tryCreate(logger, nodeStorage, networkClient, cryptoProvider, managedIdentityId) {
        const [msiEndpoint] = CloudShell.getEnvironmentVariables();
        // if the msi endpoint environment variable is undefined, this MSI provider is unavailable.
        if (!msiEndpoint) {
            logger.info(`[Managed Identity] ${Constants.ManagedIdentitySourceNames.CLOUD_SHELL} managed identity is unavailable because the '${Constants.ManagedIdentityEnvironmentVariableNames.MSI_ENDPOINT} environment variable is not defined.`);
            return null;
        }
        const validatedMsiEndpoint = CloudShell.getValidatedEnvVariableUrlString(Constants.ManagedIdentityEnvironmentVariableNames.MSI_ENDPOINT, msiEndpoint, Constants.ManagedIdentitySourceNames.CLOUD_SHELL, logger);
        logger.info(`[Managed Identity] Environment variable validation passed for ${Constants.ManagedIdentitySourceNames.CLOUD_SHELL} managed identity. Endpoint URI: ${validatedMsiEndpoint}. Creating ${Constants.ManagedIdentitySourceNames.CLOUD_SHELL} managed identity.`);
        if (managedIdentityId.idType !== Constants.ManagedIdentityIdType.SYSTEM_ASSIGNED) {
            throw ManagedIdentityError.createManagedIdentityError(ManagedIdentityErrorCodes.unableToCreateCloudShell);
        }
        return new CloudShell(logger, nodeStorage, networkClient, cryptoProvider, msiEndpoint);
    }
    createRequest(resource) {
        const request = new ManagedIdentityRequestParameters.ManagedIdentityRequestParameters(Constants.HttpMethod.POST, this.msiEndpoint);
        request.headers[Constants.METADATA_HEADER_NAME] = "true";
        request.bodyParameters[Constants.RESOURCE_BODY_OR_QUERY_PARAMETER_NAME] =
            resource;
        return request;
    }
}

exports.CloudShell = CloudShell;
//# sourceMappingURL=CloudShell.cjs.map

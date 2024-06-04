/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var ManagedIdentityRequestParameters = require('../../config/ManagedIdentityRequestParameters.cjs');
var BaseManagedIdentitySource = require('./BaseManagedIdentitySource.cjs');
var Constants = require('../../utils/Constants.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// IMDS constants. Docs for IMDS are available here https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-http
const IMDS_TOKEN_PATH = "/metadata/identity/oauth2/token";
const DEFAULT_IMDS_ENDPOINT = `http://169.254.169.254${IMDS_TOKEN_PATH}`;
const IMDS_API_VERSION = "2018-02-01";
// Original source of code: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/src/ImdsManagedIdentitySource.cs
class Imds extends BaseManagedIdentitySource.BaseManagedIdentitySource {
    constructor(logger, nodeStorage, networkClient, cryptoProvider, identityEndpoint) {
        super(logger, nodeStorage, networkClient, cryptoProvider);
        this.identityEndpoint = identityEndpoint;
    }
    static tryCreate(logger, nodeStorage, networkClient, cryptoProvider) {
        let validatedIdentityEndpoint;
        if (process.env[Constants.ManagedIdentityEnvironmentVariableNames
            .AZURE_POD_IDENTITY_AUTHORITY_HOST]) {
            logger.info(`[Managed Identity] Environment variable ${Constants.ManagedIdentityEnvironmentVariableNames.AZURE_POD_IDENTITY_AUTHORITY_HOST} for ${Constants.ManagedIdentitySourceNames.IMDS} returned endpoint: ${process.env[Constants.ManagedIdentityEnvironmentVariableNames
                .AZURE_POD_IDENTITY_AUTHORITY_HOST]}`);
            validatedIdentityEndpoint = Imds.getValidatedEnvVariableUrlString(Constants.ManagedIdentityEnvironmentVariableNames.AZURE_POD_IDENTITY_AUTHORITY_HOST, `${process.env[Constants.ManagedIdentityEnvironmentVariableNames
                .AZURE_POD_IDENTITY_AUTHORITY_HOST]}${IMDS_TOKEN_PATH}`, Constants.ManagedIdentitySourceNames.IMDS, logger);
        }
        else {
            logger.info(`[Managed Identity] Unable to find ${Constants.ManagedIdentityEnvironmentVariableNames.AZURE_POD_IDENTITY_AUTHORITY_HOST} environment variable for ${Constants.ManagedIdentitySourceNames.IMDS}, using the default endpoint.`);
            validatedIdentityEndpoint = DEFAULT_IMDS_ENDPOINT;
        }
        return new Imds(logger, nodeStorage, networkClient, cryptoProvider, validatedIdentityEndpoint);
    }
    createRequest(resource, managedIdentityId) {
        const request = new ManagedIdentityRequestParameters.ManagedIdentityRequestParameters(Constants.HttpMethod.GET, this.identityEndpoint);
        request.headers[Constants.METADATA_HEADER_NAME] = "true";
        request.queryParameters[Constants.API_VERSION_QUERY_PARAMETER_NAME] =
            IMDS_API_VERSION;
        request.queryParameters[Constants.RESOURCE_BODY_OR_QUERY_PARAMETER_NAME] =
            resource;
        if (managedIdentityId.idType !== Constants.ManagedIdentityIdType.SYSTEM_ASSIGNED) {
            request.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(managedIdentityId.idType)] = managedIdentityId.id;
        }
        // bodyParameters calculated in BaseManagedIdentity.acquireTokenWithManagedIdentity
        return request;
    }
}

exports.Imds = Imds;
//# sourceMappingURL=Imds.cjs.map
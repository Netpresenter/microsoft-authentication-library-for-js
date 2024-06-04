/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var msalCommon = require('@azure/msal-common');
var ManagedIdentityErrorCodes = require('./ManagedIdentityErrorCodes.cjs');
var Constants = require('../utils/Constants.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * ManagedIdentityErrorMessage class containing string constants used by error codes and messages.
 */
const ManagedIdentityErrorMessages = {
    [ManagedIdentityErrorCodes.invalidManagedIdentityIdType]: "More than one ManagedIdentityIdType was provided.",
    [ManagedIdentityErrorCodes.missingId]: "A ManagedIdentityId id was not provided.",
    [ManagedIdentityErrorCodes.MsiEnvironmentVariableUrlMalformedErrorCodes
        .AZURE_POD_IDENTITY_AUTHORITY_HOST]: `The Managed Identity's '${Constants.ManagedIdentityEnvironmentVariableNames.AZURE_POD_IDENTITY_AUTHORITY_HOST}' environment variable is malformed.`,
    [ManagedIdentityErrorCodes.MsiEnvironmentVariableUrlMalformedErrorCodes
        .IDENTITY_ENDPOINT]: `The Managed Identity's '${Constants.ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT}' environment variable is malformed.`,
    [ManagedIdentityErrorCodes.MsiEnvironmentVariableUrlMalformedErrorCodes
        .IMDS_ENDPOINT]: `The Managed Identity's '${Constants.ManagedIdentityEnvironmentVariableNames.IMDS_ENDPOINT}' environment variable is malformed.`,
    [ManagedIdentityErrorCodes.MsiEnvironmentVariableUrlMalformedErrorCodes
        .MSI_ENDPOINT]: `The Managed Identity's '${Constants.ManagedIdentityEnvironmentVariableNames.MSI_ENDPOINT}' environment variable is malformed.`,
    [ManagedIdentityErrorCodes.networkUnavailable]: "Authentication unavailable. The request to the managed identity endpoint timed out.",
    [ManagedIdentityErrorCodes.unableToCreateAzureArc]: "Azure Arc Managed Identities can only be system assigned.",
    [ManagedIdentityErrorCodes.unableToCreateCloudShell]: "Cloud Shell Managed Identities can only be system assigned.",
    [ManagedIdentityErrorCodes.unableToCreateSource]: "Unable to create a Managed Identity source based on environment variables.",
    [ManagedIdentityErrorCodes.unableToReadSecretFile]: "Unable to read the secret file.",
    [ManagedIdentityErrorCodes.userAssignedNotAvailableAtRuntime]: "Service Fabric user assigned managed identity ClientId or ResourceId is not configurable at runtime.",
    [ManagedIdentityErrorCodes.wwwAuthenticateHeaderMissing]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is missing.",
    [ManagedIdentityErrorCodes.wwwAuthenticateHeaderUnsupportedFormat]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is in an unsupported format.",
};
class ManagedIdentityError extends msalCommon.AuthError {
    constructor(errorCode) {
        super(errorCode, ManagedIdentityErrorMessages[errorCode]);
        this.name = "ManagedIdentityError";
        Object.setPrototypeOf(this, ManagedIdentityError.prototype);
    }
}
function createManagedIdentityError(errorCode) {
    return new ManagedIdentityError(errorCode);
}

exports.ManagedIdentityError = ManagedIdentityError;
exports.ManagedIdentityErrorMessages = ManagedIdentityErrorMessages;
exports.createManagedIdentityError = createManagedIdentityError;
//# sourceMappingURL=ManagedIdentityError.cjs.map
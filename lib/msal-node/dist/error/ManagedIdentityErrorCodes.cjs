/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var Constants = require('../utils/Constants.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const invalidManagedIdentityIdType = "invalid_managed_identity_id_type";
const missingId = "missing_client_id";
const networkUnavailable = "network_unavailable";
const unableToCreateAzureArc = "unable_to_create_azure_arc";
const unableToCreateCloudShell = "unable_to_create_cloud_shell";
const unableToCreateSource = "unable_to_create_source";
const unableToReadSecretFile = "unable_to_read_secret_file";
const userAssignedNotAvailableAtRuntime = "user_assigned_not_available_at_runtime";
const wwwAuthenticateHeaderMissing = "www_authenticate_header_missing";
const wwwAuthenticateHeaderUnsupportedFormat = "www_authenticate_header_unsupported_format";
const MsiEnvironmentVariableUrlMalformedErrorCodes = {
    [Constants.ManagedIdentityEnvironmentVariableNames.AZURE_POD_IDENTITY_AUTHORITY_HOST]: "azure_pod_identity_authority_host_url_malformed",
    [Constants.ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT]: "identity_endpoint_url_malformed",
    [Constants.ManagedIdentityEnvironmentVariableNames.IMDS_ENDPOINT]: "imds_endpoint_url_malformed",
    [Constants.ManagedIdentityEnvironmentVariableNames.MSI_ENDPOINT]: "msi_endpoint_url_malformed",
};

exports.MsiEnvironmentVariableUrlMalformedErrorCodes = MsiEnvironmentVariableUrlMalformedErrorCodes;
exports.invalidManagedIdentityIdType = invalidManagedIdentityIdType;
exports.missingId = missingId;
exports.networkUnavailable = networkUnavailable;
exports.unableToCreateAzureArc = unableToCreateAzureArc;
exports.unableToCreateCloudShell = unableToCreateCloudShell;
exports.unableToCreateSource = unableToCreateSource;
exports.unableToReadSecretFile = unableToReadSecretFile;
exports.userAssignedNotAvailableAtRuntime = userAssignedNotAvailableAtRuntime;
exports.wwwAuthenticateHeaderMissing = wwwAuthenticateHeaderMissing;
exports.wwwAuthenticateHeaderUnsupportedFormat = wwwAuthenticateHeaderUnsupportedFormat;
//# sourceMappingURL=ManagedIdentityErrorCodes.cjs.map

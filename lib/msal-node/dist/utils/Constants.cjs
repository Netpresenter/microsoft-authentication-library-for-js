/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var msalCommon = require('@azure/msal-common');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// MSI Constants. Docs for MSI are available here https://docs.microsoft.com/azure/app-service/overview-managed-identity
const AUTHORIZATION_HEADER_NAME = "Authorization";
const METADATA_HEADER_NAME = "Metadata";
const APP_SERVICE_SECRET_HEADER_NAME = "X-IDENTITY-HEADER";
const SERVICE_FABRIC_SECRET_HEADER_NAME = "secret";
const API_VERSION_QUERY_PARAMETER_NAME = "api-version";
const RESOURCE_BODY_OR_QUERY_PARAMETER_NAME = "resource";
const DEFAULT_MANAGED_IDENTITY_ID = "system_assigned_managed_identity";
const MANAGED_IDENTITY_DEFAULT_TENANT = "managed_identity";
const DEFAULT_AUTHORITY_FOR_MANAGED_IDENTITY = `https://login.microsoftonline.com/${MANAGED_IDENTITY_DEFAULT_TENANT}/`;
/**
 * Managed Identity Environment Variable Names
 */
const ManagedIdentityEnvironmentVariableNames = {
    AZURE_POD_IDENTITY_AUTHORITY_HOST: "AZURE_POD_IDENTITY_AUTHORITY_HOST",
    IDENTITY_ENDPOINT: "IDENTITY_ENDPOINT",
    IDENTITY_HEADER: "IDENTITY_HEADER",
    IDENTITY_SERVER_THUMBPRINT: "IDENTITY_SERVER_THUMBPRINT",
    IMDS_ENDPOINT: "IMDS_ENDPOINT",
    MSI_ENDPOINT: "MSI_ENDPOINT",
};
/**
 * Managed Identity Source Names
 * @public
 */
const ManagedIdentitySourceNames = {
    APP_SERVICE: "AppService",
    AZURE_ARC: "AzureArc",
    CLOUD_SHELL: "CloudShell",
    DEFAULT_TO_IMDS: "DefaultToImds",
    IMDS: "Imds",
    SERVICE_FABRIC: "ServiceFabric",
};
/**
 * Managed Identity Ids
 */
const ManagedIdentityIdType = {
    SYSTEM_ASSIGNED: "system-assigned",
    USER_ASSIGNED_CLIENT_ID: "user-assigned-client-id",
    USER_ASSIGNED_RESOURCE_ID: "user-assigned-resource-id",
    USER_ASSIGNED_OBJECT_ID: "user-assigned-object-id",
};
/**
 * http methods
 */
const HttpMethod = {
    GET: "get",
    POST: "post",
};
const ProxyStatus = {
    SUCCESS: msalCommon.HttpStatus.SUCCESS,
    SUCCESS_RANGE_START: msalCommon.HttpStatus.SUCCESS_RANGE_START,
    SUCCESS_RANGE_END: msalCommon.HttpStatus.SUCCESS_RANGE_END,
    SERVER_ERROR: msalCommon.HttpStatus.SERVER_ERROR,
};
/**
 * Constants used for region discovery
 */
const REGION_ENVIRONMENT_VARIABLE = "REGION_NAME";
/**
 * Constant used for PKCE
 */
const RANDOM_OCTET_SIZE = 32;
/**
 * Constants used in PKCE
 */
const Hash = {
    SHA256: "sha256",
};
/**
 * Constants for encoding schemes
 */
const CharSet = {
    CV_CHARSET: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",
};
/**
 * Constants
 */
const Constants = {
    MSAL_SKU: "msal.js.node",
    JWT_BEARER_ASSERTION_TYPE: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    AUTHORIZATION_PENDING: "authorization_pending",
    HTTP_PROTOCOL: "http://",
    LOCALHOST: "localhost",
};
/**
 * API Codes for Telemetry purposes.
 * Before adding a new code you must claim it in the MSAL Telemetry tracker as these number spaces are shared across all MSALs
 * 0-99 Silent Flow
 * 600-699 Device Code Flow
 * 800-899 Auth Code Flow
 */
const ApiId = {
    acquireTokenSilent: 62,
    acquireTokenByUsernamePassword: 371,
    acquireTokenByDeviceCode: 671,
    acquireTokenByClientCredential: 771,
    acquireTokenByCode: 871,
    acquireTokenByRefreshToken: 872,
};
/**
 * JWT  constants
 */
const JwtConstants = {
    ALGORITHM: "alg",
    RSA_256: "RS256",
    X5T: "x5t",
    X5C: "x5c",
    AUDIENCE: "aud",
    EXPIRATION_TIME: "exp",
    ISSUER: "iss",
    SUBJECT: "sub",
    NOT_BEFORE: "nbf",
    JWT_ID: "jti",
};
const LOOPBACK_SERVER_CONSTANTS = {
    INTERVAL_MS: 100,
    TIMEOUT_MS: 5000,
};
const MANAGED_IDENTITY_MAX_RETRIES = 3;
const MANAGED_IDENTITY_RETRY_DELAY = 1000;
const MANAGED_IDENTITY_HTTP_STATUS_CODES_TO_RETRY_ON = [
    msalCommon.HttpStatus.NOT_FOUND,
    msalCommon.HttpStatus.REQUEST_TIMEOUT,
    msalCommon.HttpStatus.TOO_MANY_REQUESTS,
    msalCommon.HttpStatus.SERVER_ERROR,
    msalCommon.HttpStatus.SERVICE_UNAVAILABLE,
    msalCommon.HttpStatus.GATEWAY_TIMEOUT,
];

exports.API_VERSION_QUERY_PARAMETER_NAME = API_VERSION_QUERY_PARAMETER_NAME;
exports.APP_SERVICE_SECRET_HEADER_NAME = APP_SERVICE_SECRET_HEADER_NAME;
exports.AUTHORIZATION_HEADER_NAME = AUTHORIZATION_HEADER_NAME;
exports.ApiId = ApiId;
exports.CharSet = CharSet;
exports.Constants = Constants;
exports.DEFAULT_AUTHORITY_FOR_MANAGED_IDENTITY = DEFAULT_AUTHORITY_FOR_MANAGED_IDENTITY;
exports.DEFAULT_MANAGED_IDENTITY_ID = DEFAULT_MANAGED_IDENTITY_ID;
exports.Hash = Hash;
exports.HttpMethod = HttpMethod;
exports.JwtConstants = JwtConstants;
exports.LOOPBACK_SERVER_CONSTANTS = LOOPBACK_SERVER_CONSTANTS;
exports.MANAGED_IDENTITY_DEFAULT_TENANT = MANAGED_IDENTITY_DEFAULT_TENANT;
exports.MANAGED_IDENTITY_HTTP_STATUS_CODES_TO_RETRY_ON = MANAGED_IDENTITY_HTTP_STATUS_CODES_TO_RETRY_ON;
exports.MANAGED_IDENTITY_MAX_RETRIES = MANAGED_IDENTITY_MAX_RETRIES;
exports.MANAGED_IDENTITY_RETRY_DELAY = MANAGED_IDENTITY_RETRY_DELAY;
exports.METADATA_HEADER_NAME = METADATA_HEADER_NAME;
exports.ManagedIdentityEnvironmentVariableNames = ManagedIdentityEnvironmentVariableNames;
exports.ManagedIdentityIdType = ManagedIdentityIdType;
exports.ManagedIdentitySourceNames = ManagedIdentitySourceNames;
exports.ProxyStatus = ProxyStatus;
exports.RANDOM_OCTET_SIZE = RANDOM_OCTET_SIZE;
exports.REGION_ENVIRONMENT_VARIABLE = REGION_ENVIRONMENT_VARIABLE;
exports.RESOURCE_BODY_OR_QUERY_PARAMETER_NAME = RESOURCE_BODY_OR_QUERY_PARAMETER_NAME;
exports.SERVICE_FABRIC_SECRET_HEADER_NAME = SERVICE_FABRIC_SECRET_HEADER_NAME;
//# sourceMappingURL=Constants.cjs.map
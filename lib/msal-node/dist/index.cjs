/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var internals = require('./internals.cjs');
var PublicClientApplication = require('./client/PublicClientApplication.cjs');
var ConfidentialClientApplication = require('./client/ConfidentialClientApplication.cjs');
var ClientApplication = require('./client/ClientApplication.cjs');
var ClientCredentialClient = require('./client/ClientCredentialClient.cjs');
var DeviceCodeClient = require('./client/DeviceCodeClient.cjs');
var OnBehalfOfClient = require('./client/OnBehalfOfClient.cjs');
var ManagedIdentityApplication = require('./client/ManagedIdentityApplication.cjs');
var UsernamePasswordClient = require('./client/UsernamePasswordClient.cjs');
var Configuration = require('./config/Configuration.cjs');
var ClientAssertion = require('./client/ClientAssertion.cjs');
var TokenCache = require('./cache/TokenCache.cjs');
var NodeStorage = require('./cache/NodeStorage.cjs');
var DistributedCachePlugin = require('./cache/distributed/DistributedCachePlugin.cjs');
var Constants = require('./utils/Constants.cjs');
var CryptoProvider = require('./crypto/CryptoProvider.cjs');
var msalCommon = require('@azure/msal-common');
var packageMetadata = require('./packageMetadata.cjs');



exports.internals = internals;
exports.PublicClientApplication = PublicClientApplication.PublicClientApplication;
exports.ConfidentialClientApplication = ConfidentialClientApplication.ConfidentialClientApplication;
exports.ClientApplication = ClientApplication.ClientApplication;
exports.ClientCredentialClient = ClientCredentialClient.ClientCredentialClient;
exports.DeviceCodeClient = DeviceCodeClient.DeviceCodeClient;
exports.OnBehalfOfClient = OnBehalfOfClient.OnBehalfOfClient;
exports.ManagedIdentityApplication = ManagedIdentityApplication.ManagedIdentityApplication;
exports.UsernamePasswordClient = UsernamePasswordClient.UsernamePasswordClient;
exports.buildAppConfiguration = Configuration.buildAppConfiguration;
exports.ClientAssertion = ClientAssertion.ClientAssertion;
exports.TokenCache = TokenCache.TokenCache;
exports.NodeStorage = NodeStorage.NodeStorage;
exports.DistributedCachePlugin = DistributedCachePlugin.DistributedCachePlugin;
exports.ManagedIdentitySourceNames = Constants.ManagedIdentitySourceNames;
exports.CryptoProvider = CryptoProvider.CryptoProvider;
Object.defineProperty(exports, "AuthError", {
	enumerable: true,
	get: function () { return msalCommon.AuthError; }
});
Object.defineProperty(exports, "AuthErrorCodes", {
	enumerable: true,
	get: function () { return msalCommon.AuthErrorCodes; }
});
Object.defineProperty(exports, "AuthErrorMessage", {
	enumerable: true,
	get: function () { return msalCommon.AuthErrorMessage; }
});
Object.defineProperty(exports, "AzureCloudInstance", {
	enumerable: true,
	get: function () { return msalCommon.AzureCloudInstance; }
});
Object.defineProperty(exports, "ClientAuthError", {
	enumerable: true,
	get: function () { return msalCommon.ClientAuthError; }
});
Object.defineProperty(exports, "ClientAuthErrorCodes", {
	enumerable: true,
	get: function () { return msalCommon.ClientAuthErrorCodes; }
});
Object.defineProperty(exports, "ClientAuthErrorMessage", {
	enumerable: true,
	get: function () { return msalCommon.ClientAuthErrorMessage; }
});
Object.defineProperty(exports, "ClientConfigurationError", {
	enumerable: true,
	get: function () { return msalCommon.ClientConfigurationError; }
});
Object.defineProperty(exports, "ClientConfigurationErrorCodes", {
	enumerable: true,
	get: function () { return msalCommon.ClientConfigurationErrorCodes; }
});
Object.defineProperty(exports, "ClientConfigurationErrorMessage", {
	enumerable: true,
	get: function () { return msalCommon.ClientConfigurationErrorMessage; }
});
Object.defineProperty(exports, "InteractionRequiredAuthError", {
	enumerable: true,
	get: function () { return msalCommon.InteractionRequiredAuthError; }
});
Object.defineProperty(exports, "InteractionRequiredAuthErrorCodes", {
	enumerable: true,
	get: function () { return msalCommon.InteractionRequiredAuthErrorCodes; }
});
Object.defineProperty(exports, "InteractionRequiredAuthErrorMessage", {
	enumerable: true,
	get: function () { return msalCommon.InteractionRequiredAuthErrorMessage; }
});
Object.defineProperty(exports, "LogLevel", {
	enumerable: true,
	get: function () { return msalCommon.LogLevel; }
});
Object.defineProperty(exports, "Logger", {
	enumerable: true,
	get: function () { return msalCommon.Logger; }
});
Object.defineProperty(exports, "PromptValue", {
	enumerable: true,
	get: function () { return msalCommon.PromptValue; }
});
Object.defineProperty(exports, "ProtocolMode", {
	enumerable: true,
	get: function () { return msalCommon.ProtocolMode; }
});
Object.defineProperty(exports, "ResponseMode", {
	enumerable: true,
	get: function () { return msalCommon.ResponseMode; }
});
Object.defineProperty(exports, "ServerError", {
	enumerable: true,
	get: function () { return msalCommon.ServerError; }
});
Object.defineProperty(exports, "TokenCacheContext", {
	enumerable: true,
	get: function () { return msalCommon.TokenCacheContext; }
});
exports.version = packageMetadata.version;
//# sourceMappingURL=index.cjs.map
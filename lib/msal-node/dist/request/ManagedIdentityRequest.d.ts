import { CommonClientCredentialRequest } from "@azure/msal-common";
import { ManagedIdentityRequestParams } from "./ManagedIdentityRequestParams";
/**
 * ManagedIdentityRequest
 * - forceRefresh - forces managed identity requests to skip the cache and make network calls if true
 * - resource  - resource requested to access the protected API. It should be of the form "{ResourceIdUri}" or {ResourceIdUri/.default}. For instance https://management.azure.net or, for Microsoft Graph, https://graph.microsoft.com/.default
 */
export type ManagedIdentityRequest = ManagedIdentityRequestParams & CommonClientCredentialRequest;
//# sourceMappingURL=ManagedIdentityRequest.d.ts.map
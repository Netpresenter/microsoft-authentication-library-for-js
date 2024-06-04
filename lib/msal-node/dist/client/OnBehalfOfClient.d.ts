import { AuthenticationResult, BaseClient, ClientConfiguration, CommonOnBehalfOfRequest } from "@azure/msal-common";
/**
 * On-Behalf-Of client
 */
export declare class OnBehalfOfClient extends BaseClient {
    private scopeSet;
    private userAssertionHash;
    constructor(configuration: ClientConfiguration);
    /**
     * Public API to acquire tokens with on behalf of flow
     * @param request
     */
    acquireToken(request: CommonOnBehalfOfRequest): Promise<AuthenticationResult | null>;
    /**
     * look up cache for tokens
     * Find idtoken in the cache
     * Find accessToken based on user assertion and account info in the cache
     * Please note we are not yet supported OBO tokens refreshed with long lived RT. User will have to send a new assertion if the current access token expires
     * This is to prevent security issues when the assertion changes over time, however, longlived RT helps retaining the session
     * @param request
     */
    private getCachedAuthenticationResult;
    /**
     * read idtoken from cache, this is a specific implementation for OBO as the requirements differ from a generic lookup in the cacheManager
     * Certain use cases of OBO flow do not expect an idToken in the cache/or from the service
     * @param atHomeAccountId {string}
     */
    private readIdTokenFromCacheForOBO;
    /**
     * Fetches the cached access token based on incoming assertion
     * @param clientId
     * @param request
     * @param userAssertionHash
     */
    private readAccessTokenFromCacheForOBO;
    /**
     * Make a network call to the server requesting credentials
     * @param request
     * @param authority
     */
    private executeTokenRequest;
    /**
     * generate a server request in accepable format
     * @param request
     */
    private createTokenRequestBody;
}
//# sourceMappingURL=OnBehalfOfClient.d.ts.map
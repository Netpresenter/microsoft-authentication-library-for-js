import { AuthenticationResult, BaseClient, ClientConfiguration, CommonDeviceCodeRequest } from "@azure/msal-common";
/**
 * OAuth2.0 Device code client
 */
export declare class DeviceCodeClient extends BaseClient {
    constructor(configuration: ClientConfiguration);
    /**
     * Gets device code from device code endpoint, calls back to with device code response, and
     * polls token endpoint to exchange device code for tokens
     * @param request
     */
    acquireToken(request: CommonDeviceCodeRequest): Promise<AuthenticationResult | null>;
    /**
     * Creates device code request and executes http GET
     * @param request
     */
    private getDeviceCode;
    /**
     * Creates query string for the device code request
     * @param request
     */
    createExtraQueryParameters(request: CommonDeviceCodeRequest): string;
    /**
     * Executes POST request to device code endpoint
     * @param deviceCodeEndpoint
     * @param queryString
     * @param headers
     */
    private executePostRequestToDeviceCodeEndpoint;
    /**
     * Create device code endpoint query parameters and returns string
     */
    private createQueryString;
    /**
     * Breaks the polling with specific conditions.
     * @param request CommonDeviceCodeRequest
     * @param deviceCodeResponse DeviceCodeResponse
     */
    private continuePolling;
    /**
     * Creates token request with device code response and polls token endpoint at interval set by the device code
     * response
     * @param request
     * @param deviceCodeResponse
     */
    private acquireTokenWithDeviceCode;
    /**
     * Creates query parameters and converts to string.
     * @param request
     * @param deviceCodeResponse
     */
    private createTokenRequestBody;
}
//# sourceMappingURL=DeviceCodeClient.d.ts.map
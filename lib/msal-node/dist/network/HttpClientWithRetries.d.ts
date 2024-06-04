import { INetworkModule, NetworkRequestOptions, NetworkResponse } from "@azure/msal-common";
import { IHttpRetryPolicy } from "../retry/IHttpRetryPolicy";
export declare class HttpClientWithRetries implements INetworkModule {
    private httpClientNoRetries;
    private retryPolicy;
    constructor(httpClientNoRetries: INetworkModule, retryPolicy: IHttpRetryPolicy);
    private sendNetworkRequestAsyncHelper;
    private sendNetworkRequestAsync;
    sendGetRequestAsync<T>(url: string, options?: NetworkRequestOptions): Promise<NetworkResponse<T>>;
    sendPostRequestAsync<T>(url: string, options?: NetworkRequestOptions): Promise<NetworkResponse<T>>;
}
//# sourceMappingURL=HttpClientWithRetries.d.ts.map
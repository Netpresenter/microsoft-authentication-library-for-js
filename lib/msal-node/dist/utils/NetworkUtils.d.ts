import { NetworkResponse, UrlToHttpRequestOptions } from "@azure/msal-common";
export declare class NetworkUtils {
    static getNetworkResponse<T>(headers: Record<string, string>, body: T, statusCode: number): NetworkResponse<T>;
    static urlToHttpOptions(url: URL): UrlToHttpRequestOptions;
}
//# sourceMappingURL=NetworkUtils.d.ts.map
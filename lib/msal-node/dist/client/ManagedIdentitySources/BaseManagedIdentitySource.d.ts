import { Authority, INetworkModule, Logger, NetworkRequestOptions, NetworkResponse, ServerAuthorizationTokenResponse, AuthenticationResult } from "@azure/msal-common";
import { ManagedIdentityId } from "../../config/ManagedIdentityId";
import { ManagedIdentityRequestParameters } from "../../config/ManagedIdentityRequestParameters";
import { CryptoProvider } from "../../crypto/CryptoProvider";
import { ManagedIdentityRequest } from "../../request/ManagedIdentityRequest";
import { ManagedIdentityIdType } from "../../utils/Constants";
import { ManagedIdentityTokenResponse } from "../../response/ManagedIdentityTokenResponse";
import { NodeStorage } from "../../cache/NodeStorage";
/**
 * Managed Identity User Assigned Id Query Parameter Names
 */
export declare const ManagedIdentityUserAssignedIdQueryParameterNames: {
    readonly MANAGED_IDENTITY_CLIENT_ID: "client_id";
    readonly MANAGED_IDENTITY_OBJECT_ID: "object_id";
    readonly MANAGED_IDENTITY_RESOURCE_ID: "mi_res_id";
};
export type ManagedIdentityUserAssignedIdQueryParameterNames = (typeof ManagedIdentityUserAssignedIdQueryParameterNames)[keyof typeof ManagedIdentityUserAssignedIdQueryParameterNames];
export declare abstract class BaseManagedIdentitySource {
    protected logger: Logger;
    private nodeStorage;
    private networkClient;
    private cryptoProvider;
    constructor(logger: Logger, nodeStorage: NodeStorage, networkClient: INetworkModule, cryptoProvider: CryptoProvider);
    abstract createRequest(request: string, managedIdentityId: ManagedIdentityId): ManagedIdentityRequestParameters;
    getServerTokenResponseAsync(response: NetworkResponse<ManagedIdentityTokenResponse>, _networkClient: INetworkModule, _networkRequest: ManagedIdentityRequestParameters, _networkRequestOptions: NetworkRequestOptions): Promise<ServerAuthorizationTokenResponse>;
    getServerTokenResponse(response: NetworkResponse<ManagedIdentityTokenResponse>): ServerAuthorizationTokenResponse;
    acquireTokenWithManagedIdentity(managedIdentityRequest: ManagedIdentityRequest, managedIdentityId: ManagedIdentityId, fakeAuthority: Authority, refreshAccessToken?: boolean): Promise<AuthenticationResult>;
    getManagedIdentityUserAssignedIdQueryParameterKey(managedIdentityIdType: ManagedIdentityIdType): string;
    static getValidatedEnvVariableUrlString: (envVariableStringName: string, envVariable: string, sourceName: string, logger: Logger) => string;
}
//# sourceMappingURL=BaseManagedIdentitySource.d.ts.map
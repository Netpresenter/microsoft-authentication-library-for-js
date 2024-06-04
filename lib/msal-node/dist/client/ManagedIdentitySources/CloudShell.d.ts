import { INetworkModule, Logger } from "@azure/msal-common";
import { ManagedIdentityRequestParameters } from "../../config/ManagedIdentityRequestParameters";
import { BaseManagedIdentitySource } from "./BaseManagedIdentitySource";
import { NodeStorage } from "../../cache/NodeStorage";
import { CryptoProvider } from "../../crypto/CryptoProvider";
import { ManagedIdentityId } from "../../config/ManagedIdentityId";
/**
 * Original source of code: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/src/CloudShellManagedIdentitySource.cs
 */
export declare class CloudShell extends BaseManagedIdentitySource {
    private msiEndpoint;
    constructor(logger: Logger, nodeStorage: NodeStorage, networkClient: INetworkModule, cryptoProvider: CryptoProvider, msiEndpoint: string);
    static getEnvironmentVariables(): Array<string | undefined>;
    static tryCreate(logger: Logger, nodeStorage: NodeStorage, networkClient: INetworkModule, cryptoProvider: CryptoProvider, managedIdentityId: ManagedIdentityId): CloudShell | null;
    createRequest(resource: string): ManagedIdentityRequestParameters;
}
//# sourceMappingURL=CloudShell.d.ts.map
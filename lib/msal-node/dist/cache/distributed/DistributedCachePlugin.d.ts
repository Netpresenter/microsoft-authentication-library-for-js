import { ICachePlugin, TokenCacheContext } from "@azure/msal-common";
import { IPartitionManager } from "./IPartitionManager.js";
import { ICacheClient } from "./ICacheClient.js";
export declare class DistributedCachePlugin implements ICachePlugin {
    private client;
    private partitionManager;
    constructor(client: ICacheClient, partitionManager: IPartitionManager);
    beforeCacheAccess(cacheContext: TokenCacheContext): Promise<void>;
    afterCacheAccess(cacheContext: TokenCacheContext): Promise<void>;
}
//# sourceMappingURL=DistributedCachePlugin.d.ts.map
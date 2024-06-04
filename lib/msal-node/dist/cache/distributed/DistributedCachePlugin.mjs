/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
import { AccountEntity } from '@azure/msal-common';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class DistributedCachePlugin {
    constructor(client, partitionManager) {
        this.client = client;
        this.partitionManager = partitionManager;
    }
    async beforeCacheAccess(cacheContext) {
        const partitionKey = await this.partitionManager.getKey();
        const cacheData = await this.client.get(partitionKey);
        cacheContext.tokenCache.deserialize(cacheData);
    }
    async afterCacheAccess(cacheContext) {
        if (cacheContext.cacheHasChanged) {
            const kvStore = cacheContext.tokenCache.getKVStore();
            const accountEntities = Object.values(kvStore).filter((value) => AccountEntity.isAccountEntity(value));
            if (accountEntities.length > 0) {
                const accountEntity = accountEntities[0];
                const partitionKey = await this.partitionManager.extractKey(accountEntity);
                await this.client.set(partitionKey, cacheContext.tokenCache.serialize());
            }
        }
    }
}

export { DistributedCachePlugin };
//# sourceMappingURL=DistributedCachePlugin.mjs.map

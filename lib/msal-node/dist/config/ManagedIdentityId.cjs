/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var ManagedIdentityError = require('../error/ManagedIdentityError.cjs');
var Constants = require('../utils/Constants.cjs');
var ManagedIdentityErrorCodes = require('../error/ManagedIdentityErrorCodes.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class ManagedIdentityId {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get idType() {
        return this._idType;
    }
    set idType(value) {
        this._idType = value;
    }
    constructor(managedIdentityIdParams) {
        const userAssignedClientId = managedIdentityIdParams?.userAssignedClientId;
        const userAssignedResourceId = managedIdentityIdParams?.userAssignedResourceId;
        const userAssignedObjectId = managedIdentityIdParams?.userAssignedObjectId;
        if (userAssignedClientId) {
            if (userAssignedResourceId || userAssignedObjectId) {
                throw ManagedIdentityError.createManagedIdentityError(ManagedIdentityErrorCodes.invalidManagedIdentityIdType);
            }
            this.id = userAssignedClientId;
            this.idType = Constants.ManagedIdentityIdType.USER_ASSIGNED_CLIENT_ID;
        }
        else if (userAssignedResourceId) {
            if (userAssignedClientId || userAssignedObjectId) {
                throw ManagedIdentityError.createManagedIdentityError(ManagedIdentityErrorCodes.invalidManagedIdentityIdType);
            }
            this.id = userAssignedResourceId;
            this.idType = Constants.ManagedIdentityIdType.USER_ASSIGNED_RESOURCE_ID;
        }
        else if (userAssignedObjectId) {
            if (userAssignedClientId || userAssignedResourceId) {
                throw ManagedIdentityError.createManagedIdentityError(ManagedIdentityErrorCodes.invalidManagedIdentityIdType);
            }
            this.id = userAssignedObjectId;
            this.idType = Constants.ManagedIdentityIdType.USER_ASSIGNED_OBJECT_ID;
        }
        else {
            this.id = Constants.DEFAULT_MANAGED_IDENTITY_ID;
            this.idType = Constants.ManagedIdentityIdType.SYSTEM_ASSIGNED;
        }
    }
}

exports.ManagedIdentityId = ManagedIdentityId;
//# sourceMappingURL=ManagedIdentityId.cjs.map
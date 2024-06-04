import { AuthError } from "@azure/msal-common";
import * as ManagedIdentityErrorCodes from "./ManagedIdentityErrorCodes";
export { ManagedIdentityErrorCodes };
/**
 * ManagedIdentityErrorMessage class containing string constants used by error codes and messages.
 */
export declare const ManagedIdentityErrorMessages: {
    invalid_managed_identity_id_type: string;
    missing_client_id: string;
    azure_pod_identity_authority_host_url_malformed: string;
    identity_endpoint_url_malformed: string;
    imds_endpoint_url_malformed: string;
    msi_endpoint_url_malformed: string;
    network_unavailable: string;
    unable_to_create_azure_arc: string;
    unable_to_create_cloud_shell: string;
    unable_to_create_source: string;
    unable_to_read_secret_file: string;
    user_assigned_not_available_at_runtime: string;
    www_authenticate_header_missing: string;
    www_authenticate_header_unsupported_format: string;
};
export declare class ManagedIdentityError extends AuthError {
    constructor(errorCode: string);
}
export declare function createManagedIdentityError(errorCode: string): ManagedIdentityError;
//# sourceMappingURL=ManagedIdentityError.d.ts.map
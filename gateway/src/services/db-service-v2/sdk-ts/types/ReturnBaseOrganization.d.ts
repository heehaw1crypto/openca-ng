import type { ReturnBaseOrganizationAddress } from "./ReturnBaseOrganizationAddress";
import type { ReturnBaseOrganizationCertificateToken } from "./ReturnBaseOrganizationCertificateToken";
import type { ReturnBaseUserOrganization } from "./ReturnBaseUserOrganization";
import type { ReturnBaseAddress } from "./ReturnBaseAddress";
import type { ReturnBaseCertificateToken } from "./ReturnBaseCertificateToken";
import type { ReturnBaseUser } from "./ReturnBaseUser";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export interface ReturnBaseOrganization {
    id?: number;
    name?: string;
    description?: string | null;
    siteUrl?: string | null;
    logoUrl?: string | null;
    isEnabled?: boolean;
    uuid?: string;
    shortDescription?: string | null;
    longDescription?: string | null;
    created?: string;
    creator?: string;
    metadata?: string | null;
    updated?: string | null;
    updaterIdentityUuid?: string | null;
    valid?: boolean;
    archived?: boolean;
    cacheKey?: string | null;
    integrityKey?: string | null;
    deidentified?: boolean;
    deidentifiedTimestamp?: number | null;
    markedForExpungepment?: boolean;
    expungementTimestamp?: number | null;
    containsSensitiveData?: boolean;
    sensitivityClassificationTypeEnum?: string;
    version?: string;
    correlationUuid?: string | null;
    externalId?: string | null;
    comment?: string | null;
    recordType?: string | null;
    organizationAddressList?: ReturnBaseOrganizationAddress[];
    organizationCertificateTokenList?: ReturnBaseOrganizationCertificateToken[];
    userOrganizationList?: ReturnBaseUserOrganization[];
    addressList?: ReturnBaseAddress[];
    certificateTokenList?: ReturnBaseCertificateToken[];
    userList?: ReturnBaseUser[];
    [k: string]: unknown;
}

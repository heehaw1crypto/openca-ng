import type { ReturnBasePki } from "./ReturnBasePki";
import type { ReturnBaseCertificateAuthorityCertificateToken } from "./ReturnBaseCertificateAuthorityCertificateToken";
import type { ReturnBaseCertificateToken } from "./ReturnBaseCertificateToken";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export interface ReturnBaseCertificateAuthority {
    id?: number;
    pkiId?: number | null;
    name?: string;
    description?: string | null;
    status?: "ENABLED" | "DISABLED" | "SUSPENDED" | null;
    isRoot?: boolean;
    hasValidToken?: boolean;
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
    pkiUuid?: string | null;
    pki?: ReturnBasePki;
    certificateAuthorityCertificateTokenList?: ReturnBaseCertificateAuthorityCertificateToken[];
    certificateTokenList?: ReturnBaseCertificateToken[];
    [k: string]: unknown;
}
import type { FieldsOrganization } from "./FieldsOrganization";
import type { FieldsCertificateToken } from "./FieldsCertificateToken";
import type { WhereOrganization } from "./WhereOrganization";
import type { WhereCertificateToken } from "./WhereCertificateToken";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsOrganizationCertificateToken = (("id" | "organizationId" | "certificateTokenId" | "isSelected" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType" | "organizationUuid" | "certificateTokenUuid") | {
    name: "organization";
    as?: string;
    fields: FieldsOrganization;
    args?: {
        $where?: WhereOrganization;
    };
} | {
    name: "certificateToken";
    as?: string;
    fields: FieldsCertificateToken;
    args?: {
        $where?: WhereCertificateToken;
    };
})[];

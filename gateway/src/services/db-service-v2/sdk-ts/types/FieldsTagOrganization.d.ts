import type { FieldsOrganization } from "./FieldsOrganization";
import type { FieldsTag } from "./FieldsTag";
import type { WhereOrganization } from "./WhereOrganization";
import type { WhereTag } from "./WhereTag";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsTagOrganization = (("id" | "tagId" | "organizationId" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType" | "organizationUuid" | "tagUuid") | {
    name: "organization";
    as?: string;
    fields: FieldsOrganization;
    args?: {
        $where?: WhereOrganization;
    };
} | {
    name: "tag";
    as?: string;
    fields: FieldsTag;
    args?: {
        $where?: WhereTag;
    };
})[];
import type { FieldsOrganizationRole } from "./FieldsOrganizationRole";
import type { FieldsUser } from "./FieldsUser";
import type { WhereOrganizationRole } from "./WhereOrganizationRole";
import type { WhereUser } from "./WhereUser";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsUserOrganizationRole = (("id" | "userId" | "organizationRoleId" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType" | "organizationRoleUuid" | "userUuid") | {
    name: "organizationRole";
    as?: string;
    fields: FieldsOrganizationRole;
    args?: {
        $where?: WhereOrganizationRole;
    };
} | {
    name: "user";
    as?: string;
    fields: FieldsUser;
    args?: {
        $where?: WhereUser;
    };
})[];
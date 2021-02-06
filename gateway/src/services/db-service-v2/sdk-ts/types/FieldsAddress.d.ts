import type { FieldsOrganizationAddress } from "./FieldsOrganizationAddress";
import type { FieldsOrganization } from "./FieldsOrganization";
import type { WhereOrganizationAddress } from "./WhereOrganizationAddress";
import type { WhereOrganization } from "./WhereOrganization";
import type { OrderByOrganizationAddress } from "./OrderByOrganizationAddress";
import type { OrderByOrganization } from "./OrderByOrganization";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsAddress = (("id" | "street1" | "street2" | "city" | "state" | "postalCode" | "country" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType") | {
    name: "organizationAddressList";
    as?: string;
    fields: FieldsOrganizationAddress;
    args?: {
        $where?: WhereOrganizationAddress;
        $orderBy?: OrderByOrganizationAddress;
    };
} | {
    name: "organizationList";
    as?: string;
    fields: FieldsOrganization;
    args?: {
        $where?: WhereOrganization | [WhereOrganization, WhereOrganizationAddress];
        $orderBy?: OrderByOrganization;
    };
})[];

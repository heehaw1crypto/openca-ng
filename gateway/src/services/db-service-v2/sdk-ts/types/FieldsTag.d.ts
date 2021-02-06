import type { FieldsTagOrganization } from "./FieldsTagOrganization";
import type { FieldsTagProject } from "./FieldsTagProject";
import type { FieldsOrganization } from "./FieldsOrganization";
import type { FieldsProject } from "./FieldsProject";
import type { WhereTagOrganization } from "./WhereTagOrganization";
import type { WhereTagProject } from "./WhereTagProject";
import type { WhereOrganization } from "./WhereOrganization";
import type { WhereProject } from "./WhereProject";
import type { OrderByTagOrganization } from "./OrderByTagOrganization";
import type { OrderByTagProject } from "./OrderByTagProject";
import type { OrderByOrganization } from "./OrderByOrganization";
import type { OrderByProject } from "./OrderByProject";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsTag = (("id" | "name" | "rgbColor" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType") | {
    name: "tagOrganizationList";
    as?: string;
    fields: FieldsTagOrganization;
    args?: {
        $where?: WhereTagOrganization;
        $orderBy?: OrderByTagOrganization;
    };
} | {
    name: "tagProjectList";
    as?: string;
    fields: FieldsTagProject;
    args?: {
        $where?: WhereTagProject;
        $orderBy?: OrderByTagProject;
    };
} | {
    name: "organizationList";
    as?: string;
    fields: FieldsOrganization;
    args?: {
        $where?: WhereOrganization | [WhereOrganization, WhereTagOrganization];
        $orderBy?: OrderByOrganization;
    };
} | {
    name: "projectList";
    as?: string;
    fields: FieldsProject;
    args?: {
        $where?: WhereProject | [WhereProject, WhereTagProject];
        $orderBy?: OrderByProject;
    };
})[];

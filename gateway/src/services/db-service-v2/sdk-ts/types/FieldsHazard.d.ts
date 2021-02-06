import type { FieldsHazardType } from "./FieldsHazardType";
import type { FieldsProject } from "./FieldsProject";
import type { FieldsRiskSeverity } from "./FieldsRiskSeverity";
import type { FieldsHara } from "./FieldsHara";
import type { WhereHazardType } from "./WhereHazardType";
import type { WhereProject } from "./WhereProject";
import type { WhereRiskSeverity } from "./WhereRiskSeverity";
import type { WhereHara } from "./WhereHara";
import type { OrderByHara } from "./OrderByHara";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsHazard = (("id" | "hrId" | "projectId" | "suggestedSeverityId" | "hazardTypeId" | "description" | "remarks" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType" | "hazardTypeUuid" | "projectUuid" | "suggestedSeverityUuid") | {
    name: "hazardType";
    as?: string;
    fields: FieldsHazardType;
    args?: {
        $where?: WhereHazardType;
    };
} | {
    name: "project";
    as?: string;
    fields: FieldsProject;
    args?: {
        $where?: WhereProject;
    };
} | {
    name: "riskSeverity";
    as?: string;
    fields: FieldsRiskSeverity;
    args?: {
        $where?: WhereRiskSeverity;
    };
} | {
    name: "haraList";
    as?: string;
    fields: FieldsHara;
    args?: {
        $where?: WhereHara;
        $orderBy?: OrderByHara;
    };
})[];
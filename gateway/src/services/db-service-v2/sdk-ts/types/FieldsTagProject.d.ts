import type { FieldsProject } from "./FieldsProject";
import type { FieldsTag } from "./FieldsTag";
import type { WhereProject } from "./WhereProject";
import type { WhereTag } from "./WhereTag";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsTagProject = (("id" | "tagId" | "projectId" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType" | "projectUuid" | "tagUuid") | {
    name: "project";
    as?: string;
    fields: FieldsProject;
    args?: {
        $where?: WhereProject;
    };
} | {
    name: "tag";
    as?: string;
    fields: FieldsTag;
    args?: {
        $where?: WhereTag;
    };
})[];
import type { FieldsRisk } from "./FieldsRisk";
import type { FieldsRiskCategoryAttribute } from "./FieldsRiskCategoryAttribute";
import type { FieldsRiskCategoryAttributeType } from "./FieldsRiskCategoryAttributeType";
import type { FieldsRiskCategoryProject } from "./FieldsRiskCategoryProject";
import type { FieldsProject } from "./FieldsProject";
import type { WhereRisk } from "./WhereRisk";
import type { WhereRiskCategoryAttribute } from "./WhereRiskCategoryAttribute";
import type { WhereRiskCategoryAttributeType } from "./WhereRiskCategoryAttributeType";
import type { WhereRiskCategoryProject } from "./WhereRiskCategoryProject";
import type { WhereProject } from "./WhereProject";
import type { OrderByRisk } from "./OrderByRisk";
import type { OrderByRiskCategoryAttribute } from "./OrderByRiskCategoryAttribute";
import type { OrderByRiskCategoryAttributeType } from "./OrderByRiskCategoryAttributeType";
import type { OrderByRiskCategoryProject } from "./OrderByRiskCategoryProject";
import type { OrderByProject } from "./OrderByProject";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsRiskCategory = (("id" | "sectionNumber" | "enum" | "name" | "referenceUrl" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType") | {
    name: "riskList";
    as?: string;
    fields: FieldsRisk;
    args?: {
        $where?: WhereRisk;
        $orderBy?: OrderByRisk;
    };
} | {
    name: "riskCategoryAttributeList";
    as?: string;
    fields: FieldsRiskCategoryAttribute;
    args?: {
        $where?: WhereRiskCategoryAttribute;
        $orderBy?: OrderByRiskCategoryAttribute;
    };
} | {
    name: "riskCategoryAttributeTypeList";
    as?: string;
    fields: FieldsRiskCategoryAttributeType;
    args?: {
        $where?: WhereRiskCategoryAttributeType;
        $orderBy?: OrderByRiskCategoryAttributeType;
    };
} | {
    name: "riskCategoryProjectList";
    as?: string;
    fields: FieldsRiskCategoryProject;
    args?: {
        $where?: WhereRiskCategoryProject;
        $orderBy?: OrderByRiskCategoryProject;
    };
} | {
    name: "projectList";
    as?: string;
    fields: FieldsProject;
    args?: {
        $where?: WhereProject | [WhereProject, WhereRiskCategoryProject];
        $orderBy?: OrderByProject;
    };
})[];

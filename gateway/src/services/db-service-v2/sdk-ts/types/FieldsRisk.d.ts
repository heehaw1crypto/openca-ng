import type { FieldsRiskCategory } from "./FieldsRiskCategory";
import type { FieldsRiskType } from "./FieldsRiskType";
import type { FieldsRiskAttribute } from "./FieldsRiskAttribute";
import type { FieldsRiskAttributeType } from "./FieldsRiskAttributeType";
import type { FieldsRiskDiscussion } from "./FieldsRiskDiscussion";
import type { FieldsRiskEvaluation } from "./FieldsRiskEvaluation";
import type { FieldsRiskEvaluationEntry } from "./FieldsRiskEvaluationEntry";
import type { FieldsRiskMedia } from "./FieldsRiskMedia";
import type { FieldsMedia } from "./FieldsMedia";
import type { WhereRisk } from "./WhereRisk";
import type { WhereRiskCategory } from "./WhereRiskCategory";
import type { WhereRiskType } from "./WhereRiskType";
import type { WhereRiskAttribute } from "./WhereRiskAttribute";
import type { WhereRiskAttributeType } from "./WhereRiskAttributeType";
import type { WhereRiskDiscussion } from "./WhereRiskDiscussion";
import type { WhereRiskEvaluation } from "./WhereRiskEvaluation";
import type { WhereRiskEvaluationEntry } from "./WhereRiskEvaluationEntry";
import type { WhereRiskMedia } from "./WhereRiskMedia";
import type { WhereMedia } from "./WhereMedia";
import type { OrderByRisk } from "./OrderByRisk";
import type { OrderByRiskAttribute } from "./OrderByRiskAttribute";
import type { OrderByRiskAttributeType } from "./OrderByRiskAttributeType";
import type { OrderByRiskDiscussion } from "./OrderByRiskDiscussion";
import type { OrderByRiskEvaluation } from "./OrderByRiskEvaluation";
import type { OrderByRiskEvaluationEntry } from "./OrderByRiskEvaluationEntry";
import type { OrderByRiskMedia } from "./OrderByRiskMedia";
import type { OrderByMedia } from "./OrderByMedia";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsRisk = (("id" | "projectId" | "riskTypeId" | "riskTypeEnum" | "riskCategoryId" | "riskCategoryEnum" | "name" | "sectionNumber" | "referenceUrl" | "location" | "persons" | "activity" | "photoUrl" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType" | "projectUuid" | "riskCategoryUuid" | "riskTypeUuid") | {
    name: "risk";
    as?: string;
    fields: FieldsRisk;
    args?: {
        $where?: WhereRisk;
    };
} | {
    name: "riskCategory";
    as?: string;
    fields: FieldsRiskCategory;
    args?: {
        $where?: WhereRiskCategory;
    };
} | {
    name: "riskType";
    as?: string;
    fields: FieldsRiskType;
    args?: {
        $where?: WhereRiskType;
    };
} | {
    name: "riskList";
    as?: string;
    fields: FieldsRisk;
    args?: {
        $where?: WhereRisk;
        $orderBy?: OrderByRisk;
    };
} | {
    name: "riskAttributeList";
    as?: string;
    fields: FieldsRiskAttribute;
    args?: {
        $where?: WhereRiskAttribute;
        $orderBy?: OrderByRiskAttribute;
    };
} | {
    name: "riskAttributeTypeList";
    as?: string;
    fields: FieldsRiskAttributeType;
    args?: {
        $where?: WhereRiskAttributeType;
        $orderBy?: OrderByRiskAttributeType;
    };
} | {
    name: "riskDiscussionList";
    as?: string;
    fields: FieldsRiskDiscussion;
    args?: {
        $where?: WhereRiskDiscussion;
        $orderBy?: OrderByRiskDiscussion;
    };
} | {
    name: "riskEvaluationList";
    as?: string;
    fields: FieldsRiskEvaluation;
    args?: {
        $where?: WhereRiskEvaluation;
        $orderBy?: OrderByRiskEvaluation;
    };
} | {
    name: "riskEvaluationEntryList";
    as?: string;
    fields: FieldsRiskEvaluationEntry;
    args?: {
        $where?: WhereRiskEvaluationEntry;
        $orderBy?: OrderByRiskEvaluationEntry;
    };
} | {
    name: "riskMediaList";
    as?: string;
    fields: FieldsRiskMedia;
    args?: {
        $where?: WhereRiskMedia;
        $orderBy?: OrderByRiskMedia;
    };
} | {
    name: "mediaList";
    as?: string;
    fields: FieldsMedia;
    args?: {
        $where?: WhereMedia | [WhereMedia, WhereRiskMedia];
        $orderBy?: OrderByMedia;
    };
})[];
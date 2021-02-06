import type { FieldsOrganization } from "./FieldsOrganization";
import type { FieldsAsil } from "./FieldsAsil";
import type { FieldsAssumption } from "./FieldsAssumption";
import type { FieldsConsideredSituationalAttribute } from "./FieldsConsideredSituationalAttribute";
import type { FieldsExistingExternalMeasure } from "./FieldsExistingExternalMeasure";
import type { FieldsFunctionTask } from "./FieldsFunctionTask";
import type { FieldsGuideword } from "./FieldsGuideword";
import type { FieldsHara } from "./FieldsHara";
import type { FieldsHazop } from "./FieldsHazop";
import type { FieldsHazard } from "./FieldsHazard";
import type { FieldsHazardType } from "./FieldsHazardType";
import type { FieldsHazardousEvent } from "./FieldsHazardousEvent";
import type { FieldsOdd } from "./FieldsOdd";
import type { FieldsPl } from "./FieldsPl";
import type { FieldsProjectAttribute } from "./FieldsProjectAttribute";
import type { FieldsProjectAttributeType } from "./FieldsProjectAttributeType";
import type { FieldsProjectAttributeTypeValue } from "./FieldsProjectAttributeTypeValue";
import type { FieldsRiskAvoidability } from "./FieldsRiskAvoidability";
import type { FieldsRiskCategoryProject } from "./FieldsRiskCategoryProject";
import type { FieldsRiskClass } from "./FieldsRiskClass";
import type { FieldsRiskExposure } from "./FieldsRiskExposure";
import type { FieldsRiskReductionMeasure } from "./FieldsRiskReductionMeasure";
import type { FieldsRiskReductionMeasureType } from "./FieldsRiskReductionMeasureType";
import type { FieldsRiskSeverity } from "./FieldsRiskSeverity";
import type { FieldsSil } from "./FieldsSil";
import type { FieldsTagProject } from "./FieldsTagProject";
import type { FieldsUserProject } from "./FieldsUserProject";
import type { FieldsRiskCategory } from "./FieldsRiskCategory";
import type { FieldsTag } from "./FieldsTag";
import type { WhereOrganization } from "./WhereOrganization";
import type { WhereAsil } from "./WhereAsil";
import type { WhereAssumption } from "./WhereAssumption";
import type { WhereConsideredSituationalAttribute } from "./WhereConsideredSituationalAttribute";
import type { WhereExistingExternalMeasure } from "./WhereExistingExternalMeasure";
import type { WhereFunctionTask } from "./WhereFunctionTask";
import type { WhereGuideword } from "./WhereGuideword";
import type { WhereHara } from "./WhereHara";
import type { WhereHazop } from "./WhereHazop";
import type { WhereHazard } from "./WhereHazard";
import type { WhereHazardType } from "./WhereHazardType";
import type { WhereHazardousEvent } from "./WhereHazardousEvent";
import type { WhereOdd } from "./WhereOdd";
import type { WherePl } from "./WherePl";
import type { WhereProjectAttribute } from "./WhereProjectAttribute";
import type { WhereProjectAttributeType } from "./WhereProjectAttributeType";
import type { WhereProjectAttributeTypeValue } from "./WhereProjectAttributeTypeValue";
import type { WhereRiskAvoidability } from "./WhereRiskAvoidability";
import type { WhereRiskCategoryProject } from "./WhereRiskCategoryProject";
import type { WhereRiskClass } from "./WhereRiskClass";
import type { WhereRiskExposure } from "./WhereRiskExposure";
import type { WhereRiskReductionMeasure } from "./WhereRiskReductionMeasure";
import type { WhereRiskReductionMeasureType } from "./WhereRiskReductionMeasureType";
import type { WhereRiskSeverity } from "./WhereRiskSeverity";
import type { WhereSil } from "./WhereSil";
import type { WhereTagProject } from "./WhereTagProject";
import type { WhereUserProject } from "./WhereUserProject";
import type { WhereRiskCategory } from "./WhereRiskCategory";
import type { WhereTag } from "./WhereTag";
import type { OrderByAsil } from "./OrderByAsil";
import type { OrderByAssumption } from "./OrderByAssumption";
import type { OrderByConsideredSituationalAttribute } from "./OrderByConsideredSituationalAttribute";
import type { OrderByExistingExternalMeasure } from "./OrderByExistingExternalMeasure";
import type { OrderByFunctionTask } from "./OrderByFunctionTask";
import type { OrderByGuideword } from "./OrderByGuideword";
import type { OrderByHara } from "./OrderByHara";
import type { OrderByHazop } from "./OrderByHazop";
import type { OrderByHazard } from "./OrderByHazard";
import type { OrderByHazardType } from "./OrderByHazardType";
import type { OrderByHazardousEvent } from "./OrderByHazardousEvent";
import type { OrderByOdd } from "./OrderByOdd";
import type { OrderByPl } from "./OrderByPl";
import type { OrderByProjectAttribute } from "./OrderByProjectAttribute";
import type { OrderByProjectAttributeType } from "./OrderByProjectAttributeType";
import type { OrderByProjectAttributeTypeValue } from "./OrderByProjectAttributeTypeValue";
import type { OrderByRiskAvoidability } from "./OrderByRiskAvoidability";
import type { OrderByRiskCategoryProject } from "./OrderByRiskCategoryProject";
import type { OrderByRiskClass } from "./OrderByRiskClass";
import type { OrderByRiskExposure } from "./OrderByRiskExposure";
import type { OrderByRiskReductionMeasure } from "./OrderByRiskReductionMeasure";
import type { OrderByRiskReductionMeasureType } from "./OrderByRiskReductionMeasureType";
import type { OrderByRiskSeverity } from "./OrderByRiskSeverity";
import type { OrderBySil } from "./OrderBySil";
import type { OrderByTagProject } from "./OrderByTagProject";
import type { OrderByUserProject } from "./OrderByUserProject";
import type { OrderByRiskCategory } from "./OrderByRiskCategory";
import type { OrderByTag } from "./OrderByTag";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsProject = (("id" | "organizationId" | "enum" | "name" | "startDate" | "targetEndDate" | "targetReleaseDate" | "requirementsUrl" | "standardsUrl" | "projectManagementUrl" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType" | "organizationUuid") | {
    name: "organization";
    as?: string;
    fields: FieldsOrganization;
    args?: {
        $where?: WhereOrganization;
    };
} | {
    name: "asilList";
    as?: string;
    fields: FieldsAsil;
    args?: {
        $where?: WhereAsil;
        $orderBy?: OrderByAsil;
    };
} | {
    name: "assumptionList";
    as?: string;
    fields: FieldsAssumption;
    args?: {
        $where?: WhereAssumption;
        $orderBy?: OrderByAssumption;
    };
} | {
    name: "consideredSituationalAttributeList";
    as?: string;
    fields: FieldsConsideredSituationalAttribute;
    args?: {
        $where?: WhereConsideredSituationalAttribute;
        $orderBy?: OrderByConsideredSituationalAttribute;
    };
} | {
    name: "existingExternalMeasureList";
    as?: string;
    fields: FieldsExistingExternalMeasure;
    args?: {
        $where?: WhereExistingExternalMeasure;
        $orderBy?: OrderByExistingExternalMeasure;
    };
} | {
    name: "functionTaskList";
    as?: string;
    fields: FieldsFunctionTask;
    args?: {
        $where?: WhereFunctionTask;
        $orderBy?: OrderByFunctionTask;
    };
} | {
    name: "guidewordList";
    as?: string;
    fields: FieldsGuideword;
    args?: {
        $where?: WhereGuideword;
        $orderBy?: OrderByGuideword;
    };
} | {
    name: "haraList";
    as?: string;
    fields: FieldsHara;
    args?: {
        $where?: WhereHara;
        $orderBy?: OrderByHara;
    };
} | {
    name: "hazopList";
    as?: string;
    fields: FieldsHazop;
    args?: {
        $where?: WhereHazop;
        $orderBy?: OrderByHazop;
    };
} | {
    name: "hazardList";
    as?: string;
    fields: FieldsHazard;
    args?: {
        $where?: WhereHazard;
        $orderBy?: OrderByHazard;
    };
} | {
    name: "hazardTypeList";
    as?: string;
    fields: FieldsHazardType;
    args?: {
        $where?: WhereHazardType;
        $orderBy?: OrderByHazardType;
    };
} | {
    name: "hazardousEventList";
    as?: string;
    fields: FieldsHazardousEvent;
    args?: {
        $where?: WhereHazardousEvent;
        $orderBy?: OrderByHazardousEvent;
    };
} | {
    name: "oddList";
    as?: string;
    fields: FieldsOdd;
    args?: {
        $where?: WhereOdd;
        $orderBy?: OrderByOdd;
    };
} | {
    name: "plList";
    as?: string;
    fields: FieldsPl;
    args?: {
        $where?: WherePl;
        $orderBy?: OrderByPl;
    };
} | {
    name: "projectAttributeList";
    as?: string;
    fields: FieldsProjectAttribute;
    args?: {
        $where?: WhereProjectAttribute;
        $orderBy?: OrderByProjectAttribute;
    };
} | {
    name: "projectAttributeTypeList";
    as?: string;
    fields: FieldsProjectAttributeType;
    args?: {
        $where?: WhereProjectAttributeType;
        $orderBy?: OrderByProjectAttributeType;
    };
} | {
    name: "projectAttributeTypeValueList";
    as?: string;
    fields: FieldsProjectAttributeTypeValue;
    args?: {
        $where?: WhereProjectAttributeTypeValue;
        $orderBy?: OrderByProjectAttributeTypeValue;
    };
} | {
    name: "riskAvoidabilityList";
    as?: string;
    fields: FieldsRiskAvoidability;
    args?: {
        $where?: WhereRiskAvoidability;
        $orderBy?: OrderByRiskAvoidability;
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
    name: "riskClassList";
    as?: string;
    fields: FieldsRiskClass;
    args?: {
        $where?: WhereRiskClass;
        $orderBy?: OrderByRiskClass;
    };
} | {
    name: "riskExposureList";
    as?: string;
    fields: FieldsRiskExposure;
    args?: {
        $where?: WhereRiskExposure;
        $orderBy?: OrderByRiskExposure;
    };
} | {
    name: "riskReductionMeasureList";
    as?: string;
    fields: FieldsRiskReductionMeasure;
    args?: {
        $where?: WhereRiskReductionMeasure;
        $orderBy?: OrderByRiskReductionMeasure;
    };
} | {
    name: "riskReductionMeasureTypeList";
    as?: string;
    fields: FieldsRiskReductionMeasureType;
    args?: {
        $where?: WhereRiskReductionMeasureType;
        $orderBy?: OrderByRiskReductionMeasureType;
    };
} | {
    name: "riskSeverityList";
    as?: string;
    fields: FieldsRiskSeverity;
    args?: {
        $where?: WhereRiskSeverity;
        $orderBy?: OrderByRiskSeverity;
    };
} | {
    name: "silList";
    as?: string;
    fields: FieldsSil;
    args?: {
        $where?: WhereSil;
        $orderBy?: OrderBySil;
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
    name: "userProjectList";
    as?: string;
    fields: FieldsUserProject;
    args?: {
        $where?: WhereUserProject;
        $orderBy?: OrderByUserProject;
    };
} | {
    name: "riskCategoryList";
    as?: string;
    fields: FieldsRiskCategory;
    args?: {
        $where?: WhereRiskCategory | [WhereRiskCategory, WhereRiskCategoryProject];
        $orderBy?: OrderByRiskCategory;
    };
} | {
    name: "tagList";
    as?: string;
    fields: FieldsTag;
    args?: {
        $where?: WhereTag | [WhereTag, WhereTagProject];
        $orderBy?: OrderByTag;
    };
})[];

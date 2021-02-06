import type { ReturnBaseSil } from "./ReturnBaseSil";
import type { ReturnBaseExistingExternalMeasure } from "./ReturnBaseExistingExternalMeasure";
import type { ReturnBaseRiskAvoidability } from "./ReturnBaseRiskAvoidability";
import type { ReturnBaseRiskExposure } from "./ReturnBaseRiskExposure";
import type { ReturnBaseRiskClass } from "./ReturnBaseRiskClass";
import type { ReturnBaseRiskSeverity } from "./ReturnBaseRiskSeverity";
import type { ReturnBaseHazard } from "./ReturnBaseHazard";
import type { ReturnBaseHazardousEvent } from "./ReturnBaseHazardousEvent";
import type { ReturnBaseProject } from "./ReturnBaseProject";
import type { ReturnBaseRiskReductionMeasure } from "./ReturnBaseRiskReductionMeasure";
import type { ReturnBaseRiskReductionMeasureType } from "./ReturnBaseRiskReductionMeasureType";
import type { ReturnBaseUser } from "./ReturnBaseUser";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export interface ReturnBaseHara {
    id?: number;
    hrId?: string;
    userId?: number | null;
    projectId?: number | null;
    hazardousEventId?: number | null;
    hazardId?: number | null;
    existingExternalMeasureId?: number | null;
    initialSeverityId?: number | null;
    initialSeverityJustification?: string | null;
    initialExposureId?: number | null;
    initialExposureJustification?: string | null;
    initialAvoidabilityId?: number | null;
    initialAvoidabilityJustification?: string | null;
    initialRiskClassId?: number | null;
    targetRiskReductionMeasureTypeId?: number | null;
    safetyTargetType?: string | null;
    allocatedSILId?: number | null;
    riskReductionMeasureId?: number | null;
    finalSeverityId?: number | null;
    finalSeverityJustification?: string | null;
    finalExposureId?: number | null;
    finalExposureJustification?: string | null;
    finalAvoidabilityId?: number | null;
    finalAvoidabilityJustification?: string | null;
    finalRiskClassId?: number | null;
    remarks?: string | null;
    uuid?: string;
    shortDescription?: string | null;
    longDescription?: string | null;
    created?: string;
    creator?: string;
    metadata?: string | null;
    updated?: string | null;
    updaterIdentityUuid?: string | null;
    valid?: boolean;
    archived?: boolean;
    cacheKey?: string | null;
    integrityKey?: string | null;
    deidentified?: boolean;
    deidentifiedTimestamp?: number | null;
    markedForExpungepment?: boolean;
    expungementTimestamp?: number | null;
    containsSensitiveData?: boolean;
    sensitivityClassificationTypeEnum?: string;
    version?: string;
    correlationUuid?: string | null;
    externalId?: string | null;
    comment?: string | null;
    recordType?: string | null;
    allocatedSILUuid?: string | null;
    existingExternalMeasureUuid?: string | null;
    finalAvoidabilityUuid?: string | null;
    finalExposureUuid?: string | null;
    finalRiskClassUuid?: string | null;
    finalSeverityUuid?: string | null;
    hazardUuid?: string | null;
    hazardousEventUuid?: string | null;
    initialAvoidabilityUuid?: string | null;
    initialExposureUuid?: string | null;
    initialRiskClassUuid?: string | null;
    initialSeverityUuid?: string | null;
    projectUuid?: string | null;
    riskReductionMeasureUuid?: string | null;
    targetRiskReductionMeasureTypeUuid?: string | null;
    userUuid?: string | null;
    sil?: ReturnBaseSil;
    existingExternalMeasure?: ReturnBaseExistingExternalMeasure;
    riskAvoidability1?: ReturnBaseRiskAvoidability;
    riskExposure1?: ReturnBaseRiskExposure;
    riskClass1?: ReturnBaseRiskClass;
    riskSeverity1?: ReturnBaseRiskSeverity;
    hazard?: ReturnBaseHazard;
    hazardousEvent?: ReturnBaseHazardousEvent;
    riskAvoidability2?: ReturnBaseRiskAvoidability;
    riskExposure2?: ReturnBaseRiskExposure;
    riskClass2?: ReturnBaseRiskClass;
    riskSeverity2?: ReturnBaseRiskSeverity;
    project?: ReturnBaseProject;
    riskReductionMeasure?: ReturnBaseRiskReductionMeasure;
    riskReductionMeasureType?: ReturnBaseRiskReductionMeasureType;
    user?: ReturnBaseUser;
    [k: string]: unknown;
}
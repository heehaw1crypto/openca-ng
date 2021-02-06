import type { ReturnBaseConsideredSituationalAttribute } from "./ReturnBaseConsideredSituationalAttribute";
import type { ReturnBaseProject } from "./ReturnBaseProject";
import type { ReturnBaseHazardousEvent } from "./ReturnBaseHazardousEvent";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export interface ReturnBaseOdd {
    id?: number;
    hrId?: string;
    projectId?: number | null;
    csaModeId?: number | null;
    csaMotionId?: number | null;
    csaLoadId?: number | null;
    csaObstacleExposureId?: number | null;
    description?: string | null;
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
    csaLoadUuid?: string | null;
    csaModeUuid?: string | null;
    csaMotionUuid?: string | null;
    csaObstacleExposureUuid?: string | null;
    projectUuid?: string | null;
    consideredSituationalAttribute1?: ReturnBaseConsideredSituationalAttribute;
    consideredSituationalAttribute2?: ReturnBaseConsideredSituationalAttribute;
    consideredSituationalAttribute3?: ReturnBaseConsideredSituationalAttribute;
    consideredSituationalAttribute4?: ReturnBaseConsideredSituationalAttribute;
    project?: ReturnBaseProject;
    hazardousEventList?: ReturnBaseHazardousEvent[];
    [k: string]: unknown;
}
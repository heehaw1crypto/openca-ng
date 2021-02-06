import type { ReturnBaseHazop } from "./ReturnBaseHazop";
import type { ReturnBaseOdd } from "./ReturnBaseOdd";
import type { ReturnBaseProject } from "./ReturnBaseProject";
import type { ReturnBaseHara } from "./ReturnBaseHara";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export interface ReturnBaseHazardousEvent {
    id?: number;
    hrId?: string;
    projectId?: number | null;
    hazopId?: number | null;
    oddId?: number | null;
    description?: string;
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
    hazopUuid?: string | null;
    oddUuid?: string | null;
    projectUuid?: string | null;
    hazop?: ReturnBaseHazop;
    odd?: ReturnBaseOdd;
    project?: ReturnBaseProject;
    haraList?: ReturnBaseHara[];
    [k: string]: unknown;
}

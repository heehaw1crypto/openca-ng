import type { ReturnBaseProject } from "./ReturnBaseProject";
import type { ReturnBaseStandard } from "./ReturnBaseStandard";
import type { ReturnBaseHazop } from "./ReturnBaseHazop";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export interface ReturnBaseGuideword {
    id?: number;
    projectId?: number | null;
    standardId?: number | null;
    value?: string;
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
    projectUuid?: string | null;
    standardUuid?: string | null;
    project?: ReturnBaseProject;
    standard?: ReturnBaseStandard;
    hazopList?: ReturnBaseHazop[];
    [k: string]: unknown;
}

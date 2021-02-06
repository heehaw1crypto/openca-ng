/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export interface DataPatchMedia {
    name?: string | null;
    type?: "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null;
    mimeType?: string | null;
    sourceMediaUrl?: string | null;
    compressedMediaUrl?: string | null;
    caption?: string | null;
    sourceMediaKey?: string | null;
    compressedMediaKey?: string | null;
    storageLocation?: "S3_BUCKET" | "GCP_BUCKET" | "INTERNAL";
    originalFilename?: string;
    isPublic?: boolean;
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
}
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type WhereMedia = _WhereMedia | {
    $and?: _WhereMedia[];
} | {
    $or?: _WhereMedia[];
};
export declare type _WhereMedia = {
    id?: number | {
        $eq?: number;
    } | {
        $neq?: number;
    } | {
        $gt?: number;
    } | {
        $gte?: number;
    } | {
        $lt?: number;
    } | {
        $lte?: number;
    } | {
        $like?: string;
    } | {
        $in?: number[];
    } | {
        $nin?: number[];
    } | {
        $btwn?: [number, number];
    } | {
        $nbtwn?: [number, number];
    };
    name?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    type?: ("DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null) | {
        $eq?: "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null;
    } | {
        $neq?: "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null;
    } | {
        $gt?: "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null;
    } | {
        $gte?: "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null;
    } | {
        $lt?: "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null;
    } | {
        $lte?: "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null;
    } | {
        $like?: string;
    } | {
        $in?: ("DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null)[];
    } | {
        $nin?: ("DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null)[];
    } | {
        $btwn?: ["DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null, "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null];
    } | {
        $nbtwn?: ["DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null, "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | null];
    };
    mimeType?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    sourceMediaUrl?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    compressedMediaUrl?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    caption?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    sourceMediaKey?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    compressedMediaKey?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    storageLocation?: ("S3_BUCKET" | "GCP_BUCKET" | "INTERNAL") | {
        $eq?: "S3_BUCKET" | "GCP_BUCKET" | "INTERNAL";
    } | {
        $neq?: "S3_BUCKET" | "GCP_BUCKET" | "INTERNAL";
    } | {
        $gt?: "S3_BUCKET" | "GCP_BUCKET" | "INTERNAL";
    } | {
        $gte?: "S3_BUCKET" | "GCP_BUCKET" | "INTERNAL";
    } | {
        $lt?: "S3_BUCKET" | "GCP_BUCKET" | "INTERNAL";
    } | {
        $lte?: "S3_BUCKET" | "GCP_BUCKET" | "INTERNAL";
    } | {
        $like?: string;
    } | {
        $in?: ("S3_BUCKET" | "GCP_BUCKET" | "INTERNAL")[];
    } | {
        $nin?: ("S3_BUCKET" | "GCP_BUCKET" | "INTERNAL")[];
    } | {
        $btwn?: ["S3_BUCKET" | "GCP_BUCKET" | "INTERNAL", "S3_BUCKET" | "GCP_BUCKET" | "INTERNAL"];
    } | {
        $nbtwn?: ["S3_BUCKET" | "GCP_BUCKET" | "INTERNAL", "S3_BUCKET" | "GCP_BUCKET" | "INTERNAL"];
    };
    originalFilename?: string | {
        $eq?: string;
    } | {
        $neq?: string;
    } | {
        $gt?: string;
    } | {
        $gte?: string;
    } | {
        $lt?: string;
    } | {
        $lte?: string;
    } | {
        $like?: string;
    } | {
        $in?: string[];
    } | {
        $nin?: string[];
    } | {
        $btwn?: [string, string];
    } | {
        $nbtwn?: [string, string];
    };
    isPublic?: boolean | {
        $eq?: boolean;
    } | {
        $neq?: boolean;
    } | {
        $gt?: boolean;
    } | {
        $gte?: boolean;
    } | {
        $lt?: boolean;
    } | {
        $lte?: boolean;
    } | {
        $like?: string;
    } | {
        $in?: boolean[];
    } | {
        $nin?: boolean[];
    } | {
        $btwn?: [boolean, boolean];
    } | {
        $nbtwn?: [boolean, boolean];
    };
    uuid?: string | {
        $eq?: string;
    } | {
        $neq?: string;
    } | {
        $gt?: string;
    } | {
        $gte?: string;
    } | {
        $lt?: string;
    } | {
        $lte?: string;
    } | {
        $like?: string;
    } | {
        $in?: string[];
    } | {
        $nin?: string[];
    } | {
        $btwn?: [string, string];
    } | {
        $nbtwn?: [string, string];
    };
    shortDescription?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    longDescription?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    created?: string | {
        $eq?: string;
    } | {
        $neq?: string;
    } | {
        $gt?: string;
    } | {
        $gte?: string;
    } | {
        $lt?: string;
    } | {
        $lte?: string;
    } | {
        $like?: string;
    } | {
        $in?: string[];
    } | {
        $nin?: string[];
    } | {
        $btwn?: [string, string];
    } | {
        $nbtwn?: [string, string];
    };
    creator?: string | {
        $eq?: string;
    } | {
        $neq?: string;
    } | {
        $gt?: string;
    } | {
        $gte?: string;
    } | {
        $lt?: string;
    } | {
        $lte?: string;
    } | {
        $like?: string;
    } | {
        $in?: string[];
    } | {
        $nin?: string[];
    } | {
        $btwn?: [string, string];
    } | {
        $nbtwn?: [string, string];
    };
    metadata?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    updated?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    updaterIdentityUuid?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    valid?: boolean | {
        $eq?: boolean;
    } | {
        $neq?: boolean;
    } | {
        $gt?: boolean;
    } | {
        $gte?: boolean;
    } | {
        $lt?: boolean;
    } | {
        $lte?: boolean;
    } | {
        $like?: string;
    } | {
        $in?: boolean[];
    } | {
        $nin?: boolean[];
    } | {
        $btwn?: [boolean, boolean];
    } | {
        $nbtwn?: [boolean, boolean];
    };
    archived?: boolean | {
        $eq?: boolean;
    } | {
        $neq?: boolean;
    } | {
        $gt?: boolean;
    } | {
        $gte?: boolean;
    } | {
        $lt?: boolean;
    } | {
        $lte?: boolean;
    } | {
        $like?: string;
    } | {
        $in?: boolean[];
    } | {
        $nin?: boolean[];
    } | {
        $btwn?: [boolean, boolean];
    } | {
        $nbtwn?: [boolean, boolean];
    };
    cacheKey?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    integrityKey?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    deidentified?: boolean | {
        $eq?: boolean;
    } | {
        $neq?: boolean;
    } | {
        $gt?: boolean;
    } | {
        $gte?: boolean;
    } | {
        $lt?: boolean;
    } | {
        $lte?: boolean;
    } | {
        $like?: string;
    } | {
        $in?: boolean[];
    } | {
        $nin?: boolean[];
    } | {
        $btwn?: [boolean, boolean];
    } | {
        $nbtwn?: [boolean, boolean];
    };
    deidentifiedTimestamp?: (number | null) | {
        $eq?: number | null;
    } | {
        $neq?: number | null;
    } | {
        $gt?: number | null;
    } | {
        $gte?: number | null;
    } | {
        $lt?: number | null;
    } | {
        $lte?: number | null;
    } | {
        $like?: string;
    } | {
        $in?: (number | null)[];
    } | {
        $nin?: (number | null)[];
    } | {
        $btwn?: [number | null, number | null];
    } | {
        $nbtwn?: [number | null, number | null];
    };
    markedForExpungepment?: boolean | {
        $eq?: boolean;
    } | {
        $neq?: boolean;
    } | {
        $gt?: boolean;
    } | {
        $gte?: boolean;
    } | {
        $lt?: boolean;
    } | {
        $lte?: boolean;
    } | {
        $like?: string;
    } | {
        $in?: boolean[];
    } | {
        $nin?: boolean[];
    } | {
        $btwn?: [boolean, boolean];
    } | {
        $nbtwn?: [boolean, boolean];
    };
    expungementTimestamp?: (number | null) | {
        $eq?: number | null;
    } | {
        $neq?: number | null;
    } | {
        $gt?: number | null;
    } | {
        $gte?: number | null;
    } | {
        $lt?: number | null;
    } | {
        $lte?: number | null;
    } | {
        $like?: string;
    } | {
        $in?: (number | null)[];
    } | {
        $nin?: (number | null)[];
    } | {
        $btwn?: [number | null, number | null];
    } | {
        $nbtwn?: [number | null, number | null];
    };
    containsSensitiveData?: boolean | {
        $eq?: boolean;
    } | {
        $neq?: boolean;
    } | {
        $gt?: boolean;
    } | {
        $gte?: boolean;
    } | {
        $lt?: boolean;
    } | {
        $lte?: boolean;
    } | {
        $like?: string;
    } | {
        $in?: boolean[];
    } | {
        $nin?: boolean[];
    } | {
        $btwn?: [boolean, boolean];
    } | {
        $nbtwn?: [boolean, boolean];
    };
    sensitivityClassificationTypeEnum?: string | {
        $eq?: string;
    } | {
        $neq?: string;
    } | {
        $gt?: string;
    } | {
        $gte?: string;
    } | {
        $lt?: string;
    } | {
        $lte?: string;
    } | {
        $like?: string;
    } | {
        $in?: string[];
    } | {
        $nin?: string[];
    } | {
        $btwn?: [string, string];
    } | {
        $nbtwn?: [string, string];
    };
    version?: string | {
        $eq?: string;
    } | {
        $neq?: string;
    } | {
        $gt?: string;
    } | {
        $gte?: string;
    } | {
        $lt?: string;
    } | {
        $lte?: string;
    } | {
        $like?: string;
    } | {
        $in?: string[];
    } | {
        $nin?: string[];
    } | {
        $btwn?: [string, string];
    } | {
        $nbtwn?: [string, string];
    };
    correlationUuid?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    externalId?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    comment?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
    recordType?: (string | null) | {
        $eq?: string | null;
    } | {
        $neq?: string | null;
    } | {
        $gt?: string | null;
    } | {
        $gte?: string | null;
    } | {
        $lt?: string | null;
    } | {
        $lte?: string | null;
    } | {
        $like?: string;
    } | {
        $in?: (string | null)[];
    } | {
        $nin?: (string | null)[];
    } | {
        $btwn?: [string | null, string | null];
    } | {
        $nbtwn?: [string | null, string | null];
    };
} | {
    $and?: _WhereMedia[];
} | {
    $or?: _WhereMedia[];
};
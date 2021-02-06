/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type WhereUser = _WhereUser | {
    $and?: _WhereUser[];
} | {
    $or?: _WhereUser[];
};
export declare type _WhereUser = {
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
    primaryRoleId?: number | {
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
    primaryRoleEnum?: string | {
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
    firstName?: (string | null) | {
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
    lastName?: (string | null) | {
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
    username?: string | {
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
    email?: string | {
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
    password?: (string | null) | {
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
    $and?: _WhereUser[];
} | {
    $or?: _WhereUser[];
};

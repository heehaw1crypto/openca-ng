import type { FieldsCspCapabilityCryptocmdAlgorcmd } from "./FieldsCspCapabilityCryptocmdAlgorcmd";
import type { WhereCspCapabilityCryptocmdAlgorcmd } from "./WhereCspCapabilityCryptocmdAlgorcmd";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsCspCapabilityCryptocmd = (("id" | "algorcmdId" | "enabled" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType" | "algorcmdUuid") | {
    name: "cspCapabilityCryptocmdAlgorcmd";
    as?: string;
    fields: FieldsCspCapabilityCryptocmdAlgorcmd;
    args?: {
        $where?: WhereCspCapabilityCryptocmdAlgorcmd;
    };
})[];
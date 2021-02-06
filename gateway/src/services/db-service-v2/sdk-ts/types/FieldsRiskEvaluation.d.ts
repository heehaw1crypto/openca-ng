import type { FieldsRisk } from "./FieldsRisk";
import type { WhereRisk } from "./WhereRisk";
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export declare type FieldsRiskEvaluation = (("id" | "type" | "riskId" | "stage" | "compositeSeverityOfInjury" | "compositeFrequencyOfEvent" | "compositePossibilityOfInjury" | "severityOfInjuryMin" | "severityOfInjuryMax" | "severityOfInjuryVoteAllowed" | "frequencyOfEventMin" | "frequencyOfEventMax" | "frequencyOfEventVoteAllowed" | "possibilityOfInjuryMin" | "possibilityOfInjuryMax" | "possibilityOfInjuryVoteAllowed" | "compositeRiskScore" | "riskReductionMeasureComment" | "uuid" | "shortDescription" | "longDescription" | "created" | "creator" | "metadata" | "updated" | "updaterIdentityUuid" | "valid" | "archived" | "cacheKey" | "integrityKey" | "deidentified" | "deidentifiedTimestamp" | "markedForExpungepment" | "expungementTimestamp" | "containsSensitiveData" | "sensitivityClassificationTypeEnum" | "version" | "correlationUuid" | "externalId" | "comment" | "recordType" | "riskUuid") | {
    name: "risk";
    as?: string;
    fields: FieldsRisk;
    args?: {
        $where?: WhereRisk;
    };
})[];
